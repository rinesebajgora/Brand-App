'use client'
import React, { useState, useEffect } from 'react'
import Protected from '../components/Protected'
import AddPost from './components/AddPost'
import PostList from './components/PostList'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [posts, setPosts] = useState<any[]>([])
  const router = useRouter()

  // Fetch postimet e user-it loguar
  useEffect(() => {
    const fetchPosts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setPosts(data || [])
    }

    fetchPosts()
  }, [])

  const handlePostSaved = (newPost: any) => setPosts(prev => [newPost, ...prev])
  const handlePostDeleted = (id: string) => setPosts(prev => prev.filter(p => p.id !== id))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Protected>
      <div style={{ maxWidth: '700px', margin: '40px auto', padding: '24px', background: 'white', borderRadius: '12px' }}>
        <h2>Dashboard</h2>
        <AddPost onPostSaved={handlePostSaved} />
        <PostList posts={posts} onPostDeleted={handlePostDeleted} />

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={handleLogout}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>
    </Protected>
  )
}