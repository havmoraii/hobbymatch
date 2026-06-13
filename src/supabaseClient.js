import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oaldilzpkhhegiznkxdo.supabase.co/rest/v1/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hbGRpbHpwa2hoZWdpem5reGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMDEyMDYsImV4cCI6MjA5Njg3NzIwNn0.6lwt65uWZxJapBSL31_bx7_MOiHbWWoLb88jvrzX4pE'
export const supabase = createClient(supabaseUrl, supabaseKey)




