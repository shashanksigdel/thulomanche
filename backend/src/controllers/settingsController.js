import { supabase, supabaseAdmin } from '../config/supabase.js';

// Helper function to convert snake_case to camelCase
const formatSettings = (data) => {
  const defaultSettings = {
    siteName: 'Thulomanche',
    siteTagline: 'big talks only.',
    siteUrl: 'http://localhost:3000',
    adminEmail: 'sashanksigdel@gmail.com',
    postsPerPage: 3,
    enableComments: true,
    enableSearch: true
  };

  if (!data) return defaultSettings;
  
  // Convert snake_case from database to camelCase for frontend
  return {
    siteName: data.site_name || data.siteName || defaultSettings.siteName,
    siteTagline: data.site_tagline || data.siteTagline || defaultSettings.siteTagline,
    siteUrl: data.site_url || data.siteUrl || defaultSettings.siteUrl,
    adminEmail: data.admin_email || data.adminEmail || defaultSettings.adminEmail,
    postsPerPage: data.posts_per_page || data.postsPerPage || defaultSettings.postsPerPage,
    enableComments: (data.enable_comments !== undefined ? data.enable_comments : data.enableComments) !== undefined ? (data.enable_comments !== undefined ? data.enable_comments : data.enableComments) : defaultSettings.enableComments,
    enableSearch: (data.enable_search !== undefined ? data.enable_search : data.enableSearch) !== undefined ? (data.enable_search !== undefined ? data.enable_search : data.enableSearch) : defaultSettings.enableSearch
  };
};

// Get all settings
export const getSettings = async (req, res) => {
  try {
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }

    console.log('Settings fetched from database:', data);
    const formattedSettings = formatSettings(data);
    
    res.status(200).json({
      success: true,
      settings: formattedSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    console.log('=== UPDATE SETTINGS REQUEST ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);

    const { siteName, siteTagline, siteUrl, adminEmail, postsPerPage, enableComments, enableSearch } = req.body;

    // Use snake_case for database columns
    const settingsData = {
      site_name: siteName,
      site_tagline: siteTagline,
      site_url: siteUrl,
      admin_email: adminEmail,
      posts_per_page: parseInt(postsPerPage),
      enable_comments: enableComments,
      enable_search: enableSearch,
      updated_at: new Date().toISOString()
    };

    console.log('Settings data to save:', settingsData);

    // First check if settings row exists
    const { data: existingSettings, error: selectError } = await supabaseAdmin
      .from('settings')
      .select('id')
      .eq('id', 1)
      .single();

    console.log('Check existing result:', { error: selectError, data: existingSettings });

    let updateResult;

    if (!selectError && existingSettings) {
      // Row exists, update it
      console.log('Settings row exists, updating...');
      updateResult = await supabaseAdmin
        .from('settings')
        .update(settingsData)
        .eq('id', 1)
        .select();
    } else if (selectError && selectError.code === 'PGRST116') {
      // No row found, insert it
      console.log('Settings row not found, creating new one');
      const insertResult = await supabaseAdmin
        .from('settings')
        .insert([{ id: 1, ...settingsData, created_at: new Date().toISOString() }])
        .select();

      console.log('Insert result:', insertResult);

      if (insertResult.error) {
        console.error('Error inserting settings:', insertResult.error);
        return res.status(500).json({ 
          message: 'Error saving settings', 
          error: insertResult.error.message 
        });
      }

      console.log('Settings created successfully');
      const formattedData = formatSettings(insertResult.data[0]);
      return res.status(200).json({
        success: true,
        message: 'Settings saved successfully',
        settings: formattedData
      });
    } else {
      throw selectError;
    }

    console.log('Update result:', updateResult);

    if (updateResult.error) {
      console.error('Error updating settings:', updateResult.error);
      
      // Check if it's a column not found error
      if (updateResult.error.message && updateResult.error.message.includes("column")) {
        console.error('Settings table schema appears to be incorrect');
        return res.status(500).json({ 
          message: 'Settings table schema error. Please run SETUP_SETTINGS.sql in Supabase dashboard',
          error: updateResult.error.message,
          setupInstructions: 'Go to Supabase Dashboard > SQL Editor > paste content of SETUP_SETTINGS.sql > Execute'
        });
      }
      
      return res.status(500).json({ 
        message: 'Error updating settings', 
        error: updateResult.error.message 
      });
    }

    console.log('Settings updated successfully');
    const formattedData = formatSettings(updateResult.data[0]);
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings: formattedData
    });
  } catch (error) {
    console.error('Exception in updateSettings:', error);
    res.status(500).json({ 
      message: 'Error updating settings', 
      error: error.message 
    });
  }
};
