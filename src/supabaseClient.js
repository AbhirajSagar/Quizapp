import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjokozmmslvcupaceyam.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqb2tvem1tc2x2Y3VwYWNleWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDM2ODksImV4cCI6MjA2MDQ3OTY4OX0.TJcJaQDFVm39mTyDaB3UCadMTV1rS1JOgQt-c8hQjM4'
export const supabase = createClient(supabaseUrl, supabaseKey)
