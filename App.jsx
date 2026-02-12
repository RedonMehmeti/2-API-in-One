import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:3000/api/register",{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ email, password, name })
      })
      const data = await res.json()
  
      if (!data.ok) {
        alert('Registration failed: ' + data.error)
      } else {
        alert('User registered successfully')
      }

  
    } catch (error) {
      alert('Error:', error);
    }
  }

  const onLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:3000/api/login",{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
  
      if (!data.ok) {
        alert('Login failed: ' + data.error)
      } else {
        alert('Login successful')
      }

  
    } catch (error) {
      alert('Error:', error);
    }
  }


  return (
    <div className="App">
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type='submit'>Register</button>
      </form>

      <h1>Login</h1>
      <form onSubmit={onLogin}>
        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}
 
 



export default App
