'use client'
import { useState } from 'react'

export default function Home(){

const [input,setInput] = useState('')
const [loading,setLoading] = useState(false)
const [response,setResponse] = useState('')
const [error,setError] = useState('')

const handleSubmit = async (e:any) =>{

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

if(!res.ok){
throw new Error("Server error")
}

const data = await res.json()

setResponse(data.reply)

}catch(err:any){

setError("Diçka shkoi gabim. Provo përsëri.")

}finally{

setLoading(false)

}

}

return(

<main style={{
maxWidth:"700px",
margin:"auto",
padding:"40px",
fontFamily:"Arial"
}}>

<h1 style={{fontSize:"32px",marginBottom:"10px"}}>
Brandify AI
</h1>

<p style={{color:"gray",marginBottom:"30px"}}>
Gjenero post marketingu për brandet në social media.
</p>

<form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"15px"}}>

<textarea
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Shembull: krijo nje post Instagrami per nje brand qe shet kafe premium"
style={{
padding:"12px",
borderRadius:"8px",
border:"1px solid #ddd",
height:"120px"
}}
disabled={loading}
/>

<button
type="submit"
disabled={loading || !input.trim()}
style={{
padding:"12px",
borderRadius:"8px",
border:"none",
background:"#2563eb",
color:"white",
cursor:"pointer"
}}
>

{loading ? "AI po gjeneron..." : "Gjenero Post"}

</button>

</form>

{loading && (
<p style={{marginTop:"20px",color:"gray"}}>
AI po krijon postin...
</p>
)}

{error && (
<div style={{
marginTop:"20px",
background:"#fee2e2",
padding:"15px",
borderRadius:"8px",
color:"#b91c1c"
}}>
{error}
</div>
)}

{response && (

<div style={{
marginTop:"25px",
padding:"20px",
background:"#f0fdf4",
borderRadius:"10px",
border:"1px solid #bbf7d0"
}}>

<h3>Post i Gjeneruar</h3>

<p style={{whiteSpace:"pre-wrap"}}>
{response}
</p>

</div>

)}

</main>

)

}