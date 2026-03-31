'use client'
import React from 'react'
import { supabase } from '../../lib/supabase'

interface PostListProps {
  posts: any[]
  onPostDeleted: (id: string) => void
}

export default function PostList({ posts, onPostDeleted }: PostListProps) {
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete post:', error)
      return
    }
    onPostDeleted(id)
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <h3>My Saved Posts</h3>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map(p => (
        <div key={p.id} style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          <h4>{p.title}</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>{p.content}</p>
          <button
            onClick={() => handleDelete(p.id)}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}