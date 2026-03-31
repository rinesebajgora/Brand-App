'use client'
import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface AddPostProps {
  onPostSaved: (newPost: any) => void
}

export default function AddPost({ onPostSaved }: AddPostProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  // Gjenero postin me AI
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError('')
    setResponse('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${input}\nPlease write this post in fluent English suitable for social media.`
        })
      })

      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setResponse(data.reply)
    } catch (err: any) {
      console.error('AI generation error:', err)
      setError('Something went wrong while generating the post.')
    } finally {
      setLoading(false)
    }
  }

  // Ruaj postin në Supabase
  const handleSavePost = async () => {
    if (!response) return

    // Merr user-in nga session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      console.error('No user session found', sessionError)
      setError('You must be logged in to save a post.')
      return
    }

    console.log('Session user:', session.user) // 🔹 debug
    console.log('Post data to insert:', {
      title: response.slice(0, 50),
      content: response,
      user_id: session.user.id
    }) // 🔹 debug

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        title: response.slice(0, 50),
        content: response,
        user_id: session.user.id
      }])

    if (error) {
      console.error('Error saving post:', error) // 🔹 debug
      setError(`Failed to save post. Check RLS policy or user_id. Details: ${error.message}`)
      return
    }

    if (data) {
      console.log('Post saved successfully:', data) // 🔹 debug
      onPostSaved(data[0])
      setResponse('')
      setInput('')
    }
  }

  return (
    <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #ccc', borderRadius: '12px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Write a post idea..."
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '100px' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{ padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px' }}>
          {loading ? 'Generating...' : 'Generate Post'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}

      {response && (
        <div style={{ marginTop: '12px', padding: '12px', background: '#e6ffed', borderRadius: '8px' }}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
          <button
            onClick={handleSavePost}
            style={{ marginTop: '8px', padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Save Post
          </button>
        </div>
      )}
    </div>
  )
}