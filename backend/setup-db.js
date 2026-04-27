import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || 'https://oqzevoapwgrtssmzawap.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_sHAjBIV4TPn4XWn4FwV3Jg_PhFYoABW';

console.log('🚀 Starting Supabase database setup...\n');
console.log(`📍 Supabase URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL file
const sqlFile = path.join(process.cwd(), 'SUPABASE_SETUP.sql');
const sql = fs.readFileSync(sqlFile, 'utf-8');

// Split statements
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--'));

console.log(`📋 Found ${statements.length} SQL statements\n`);

let executed = 0;
let failed = 0;

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i];
  
  try {
    // Execute raw SQL via Supabase
    const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
    
    if (error) {
      // Try alternative approach - just log that we need manual setup
      console.log(`⚠️  Statement ${i + 1}: ${statement.substring(0, 50)}...`);
      console.log(`   Note: Run this manually in Supabase SQL Editor`);
      failed++;
    } else {
      console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
      executed++;
    }
  } catch (err) {
    console.log(`⚠️  Statement ${i + 1}: Could not execute via RPC`);
    console.log(`   Error: ${err.message}`);
    failed++;
  }
}

console.log(`\n📊 Results: ${executed} executed, ${failed} require manual setup`);
console.log('\n💡 If setup failed, visit your Supabase dashboard:');
console.log('   1. Go to SQL Editor');
console.log('   2. Create new query');
console.log('   3. Paste the contents of SUPABASE_SETUP.sql');
console.log('   4. Click Run');
