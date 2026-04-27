import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://oqzevoapwgrtssmzawap.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY environment variable is required!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupAuth() {
  try {
    console.log('🔧 Setting up authentication tables...\n');

    // Create users table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('create_users_table', {}, {
      // Using SQL to create table
    });

    // For now, let's just try to create admin user directly
    console.log('Creating admin user...');
    
    const adminEmail = 'admin@thulomanche.com';
    const adminPassword = 'admin123456';
    const adminName = 'Admin';

    // Check if admin user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const adminExists = existingUsers?.users?.some(u => u.email === adminEmail);

    if (adminExists) {
      console.log('✅ Admin user already exists:', adminEmail);
    } else {
      // Create admin user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true
      });

      if (authError) {
        console.error('❌ Error creating admin user:', authError.message);
        return;
      }

      console.log('✅ Admin user created successfully');

      // Create user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.user.id,
            email: adminEmail,
            name: adminName,
            role: 'admin'
          }
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Note: Could not create user profile in database:', profileError.message);
        console.log('You may need to create the users table manually with the following SQL:');
        console.log(`
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamp DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
        `);
      } else {
        console.log('✅ User profile created successfully');
      }
    }

    console.log('\n✅ Authentication setup complete!\n');
    console.log('Admin Credentials:');
    console.log('─────────────────');
    console.log('Email: admin@thulomanche.com');
    console.log('Password: admin123456');
    console.log('\nLogin URL: http://localhost:3000/login');
    console.log('Admin Dashboard: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Setup error:', error);
  }
}

setupAuth();
