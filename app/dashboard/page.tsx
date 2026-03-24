'use client'
import React, { useState } from 'react'
import Protected from '../components/Protected'
import { supabase } from '../lib/supabase'

export default function DashboardPage() {
  const [input,setInput] = useState('')
  const [loading,setLoading] = useState(false)
  const [response,setResponse] = useState('')
  const [error,setError] = useState('')

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
      setError("Diçka shkoi gabim. Provo përsëri.")
    }finally{
      setLoading(false)
    }
  }

  return (
    <Protected>
      <div style={{
        maxWidth:'700px',
        margin:'auto',
        padding:'24px',
        background:'white',
        borderRadius:'12px',
        boxShadow:'0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize:'28px', marginBottom:'12px' }}>Gjenero Post Marketingu</h2>
        <p style={{ color:'#555', marginBottom:'20px' }}>Shkruaj shembullin e postit për brandin tënd:</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          <textarea value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Shembull: Krijo një post Instagrami për kafen premium" style={{ padding:'12px', borderRadius:'8px', border:'1px solid #ccc', minHeight:'100px', resize:'vertical'}} disabled={loading}/>
          <button type="submit" disabled={loading || !input.trim()} style={{ background:'#2563eb', color:'white', padding:'10px 16px', border:'none', borderRadius:'8px', cursor: loading?'not-allowed':'pointer'}}>{loading ? "Po gjenerohet..." : "Gjenero Post"}</button>
        </form>

        {error && <p style={{ color:'red', marginTop:'12px'}}>{error}</p>}

        {response && (
          <div style={{ marginTop:'16px', padding:'16px', background:'#e6ffed', border:'1px solid #b7f5c9', borderRadius:'8px'}}>
            <h3 style={{ fontWeight:'bold', marginBottom:'8px'}}>Post i Gjeneruar</h3>
            <p style={{ whiteSpace:'pre-wrap'}}>{response}</p>
          </div>
        )}
      </div>
    </Protected>
  )
}