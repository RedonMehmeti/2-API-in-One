import { useState } from 'react'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 
  const onRegister = async (e) => {
    e.preventDefault()
 
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })
 
      const data = await res.json()
 
      if (!res.ok) {
        alert(data?.error || 'Something went wrong')
        return
      }
 
      alert(`Registered: ${data?.user?.email || email}`)
 
      setEmail('')
      setName('')
      setPassword('')
    } catch {
      alert('Network error')
    }
  }

const onLogin = async (e) => {
    e.preventDefault()
 
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
 
      const data = await res.json()
 
      if (!res.ok) {
        alert(data?.error || 'Something went wrong')
        return
      }
 
      alert(`Logged in: ${data?.user?.email || email}`)
 
   
    } catch {
      alert('Network error')
    }
  }


  return (
 <div>
      <h1>Register / Login</h1>
 
      <form onSubmit={onRegister}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
 
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
 
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      
 
        <button type="submit">Register</button>
      </form>

        <form onSubmit={onLogin}>
          <button type="submit">Login</button>
        </form>
    </div>

    
  )
}

export default App
