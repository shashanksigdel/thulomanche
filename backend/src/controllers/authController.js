import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';

const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Please provide email, password, and name' });
    }

    // Check if user already exists in auth.users
    const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers();
    
    if (existingUser && existingUser.users.some(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    // Create user profile in users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authUser.user.id,
          email,
          name,
          role: 'user'
        }
      ])
      .select()
      .single();

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      return res.status(400).json({ message: 'Error creating user profile' });
    }

    // Generate JWT token
    const token = generateToken(authUser.user.id, email, 'user');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: authUser.user.id,
        email,
        name,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get user profile - use service role to bypass RLS
    let userProfile = null;
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profileData) {
      // Create user profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            name: email.split('@')[0],
            role: email === 'admin@thulomanche.com' ? 'admin' : 'user'
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user profile:', createError);
        // Still allow login even if profile creation fails
        userProfile = {
          id: authData.user.id,
          email,
          name: email.split('@')[0],
          role: email === 'admin@thulomanche.com' ? 'admin' : 'user'
        };
      } else {
        userProfile = newProfile;
      }
    } else {
      userProfile = profileData;
    }

    // Generate JWT token
    const token = generateToken(authData.user.id, email, userProfile.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: authData.user.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (profileError) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};
