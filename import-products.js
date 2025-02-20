import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or service role key. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const csvUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Product%20List%20(2).csv-mG5rmOkcwrrMU5DIVlyN8aB8nUXvcW.csv';

async function importProducts() {
  try {
    // Fetch CSV file
    const response = await fetch(csvUrl);
    const csvData = await response.text();

    // Parse CSV data
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true
    });

    // Get existing columns from the products table
    const { data: tableInfo, error: tableError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Error fetching table structure:', tableError);
      return;
    }

    const existingColumns = tableInfo.length > 0 ? Object.keys(tableInfo[0]) : [];

    // Process and insert data
    for (const record of records) {
      const insertData = {
        id: uuidv4(), // Generate a new UUID for each record
        original_row_id: record['🔒 Row ID'], // Store the original Row ID in a separate column
      };

      // Only include fields that exist in the table
      for (const column of existingColumns) {
        if (record[column] !== undefined) {
          insertData[column] = record[column];
        }
      }

      const { data, error } = await supabase
        .from('products')
        .upsert(insertData, { onConflict: 'original_row_id' });

      if (error) {
        console.error('Error inserting record:', error);
      } else {
        console.log('Inserted record:', record.Name);
      }
    }

    console.log('Import completed');
  } catch (error) {
    console.error('Error:', error);
  }
}

importProducts();