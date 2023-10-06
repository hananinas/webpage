import { createClient, type Session } from '@supabase/supabase-js'

import type { Database } from './types'

import { useState } from 'react';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)



 