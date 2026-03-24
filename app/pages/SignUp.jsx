import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSignup = async () => {
    if (!email.includes("@")) { setError("Email jo valid"); return }
    if (password.length < 6) { setError("Password min 6 karaktere"); return }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })

    if (error) setError(error.message)
    else { alert("Kontrollo email për verifikim"); navigate("/login") }
  }

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder="Emri" onChange={e => setName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      {error && <p>{error}</p>}
    </div>
  )
}