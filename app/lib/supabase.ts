'use client'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tzjkfzblvxadkublbbdb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6amtmemJsdnhhZGt1YmxiYmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzY0NjUsImV4cCI6MjA4OTQxMjQ2NX0.xS_DSvZNwe4duaX_IOeAA0jcZQB2FqF5bI9TjdNLDbc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)