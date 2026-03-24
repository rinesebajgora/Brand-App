'use client'
import React, { useState } from 'react'
import Protected from '../components/Protected'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [input,setInput] = useState('')
  const [loading,setLoading] = useState(false)
  const [response,setResponse] = useState('')
  const [error,setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!input.trim()) return

    setLoading(true)
    setError('')
    setResponse('')

    try{
      const res = await fetch('/api/chat',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({message:input})
      })
      if(!res.ok) throw new Error("Server error")
      const data = await res.json()
      setResponse(data.reply)
    }catch(err:any){
      setError("Something went wrong. Try again.")
    }finally{
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Protected>
      <div style={{
        maxWidth:'700px',
        margin:'40px auto',
        padding:'24px',
        background:'white',
        borderRadius:'12px',
        boxShadow:'0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize:'28px', marginBottom:'12px' }}>Generate an AI Post</h2>
        <p style={{ color:'#555', marginBottom:'20px' }}>Write an example post about your brand:</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          <textarea
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="Example: Create an Instagram post about premium coffee"
            style={{ padding:'12px', borderRadius:'8px', border:'1px solid #ccc', minHeight:'100px', resize:'vertical'}}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{ background:'#2563eb', color:'white', padding:'10px 16px', border:'none', borderRadius:'8px', cursor: loading?'not-allowed':'pointer'}}
          >
            {loading ? "It's generating..." : "Generate Post"}
          </button>
        </form>

        {error && <p style={{ color:'red', marginTop:'12px'}}>{error}</p>}

        {response && (
          <div style={{ marginTop:'16px', padding:'16px', background:'#e6ffed', border:'1px solid #b7f5c9', borderRadius:'8px'}}>
            <h3 style={{ fontWeight:'bold', marginBottom:'8px'}}>Generated Post</h3>
            <p style={{ whiteSpace:'pre-wrap'}}>{response}</p>
          </div>
        )}

        {/* Logout poshtë */}
        <div style={{ marginTop:'24px', textAlign:'center' }}>
          <button
            onClick={handleLogout}
            style={{
              padding:'10px 20px',
              borderRadius:'8px',
              border:'none',
              background:'#ef4444',
              color:'white',
              fontWeight:'bold',
              cursor:'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </Protected>
  )
}