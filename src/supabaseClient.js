import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oaldilzpkhhegiznkxdo.supabase.co/rest/v1/'
const supabaseKey = 'sb_publishable_ANwtPgKO2iH9pR4XNXYF-A_FtyM1B2P'

export const supabase = createClient(supabaseUrl, supabaseKey)
