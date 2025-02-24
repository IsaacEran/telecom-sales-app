
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables', {
    url: !!supabaseUrl,
    key: !!supabaseKey
  })
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

// Test the connection
supabase.from('companies').select('count').single()
  .then(() => console.log('Successfully connected to Supabase'))
  .catch(err => console.error('Error connecting to Supabase:', err.message))
