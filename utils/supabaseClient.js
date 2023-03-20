import {createClient } from '@supabase/supabase-js'
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)