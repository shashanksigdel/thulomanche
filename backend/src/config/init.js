import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// From src/config/ go up 2 levels to get to backend/
const backendDir = path.resolve(__dirname, '../..');
const envPath = path.resolve(backendDir, '.env');

console.log('Initializing environment...');
console.log('Backend directory:', backendDir);
console.log('ENV file path:', envPath);
console.log('ENV file exists:', fs.existsSync(envPath));

if (!fs.existsSync(envPath)) {
  console.error('ERROR: .env file not found at', envPath);
  process.exit(1);
}

// Load from file content directly
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim();
    if (key && value) {
      process.env[key] = value;
      if (key.includes('SUPABASE') || key.includes('PORT')) {
        console.log(`  ${key}: ${value.substring(0, 30)}${value.length > 30 ? '...' : ''}`);
      }
    }
  }
}

console.log('\nEnvironment variables ready:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✓' : '✗');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✓' : '✗');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✓' : '✗');
