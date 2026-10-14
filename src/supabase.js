import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://clvropzqjfwoegougjly.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_YlZ70CYWdqNLx5kXwzFyMg_nfKecdn9'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)