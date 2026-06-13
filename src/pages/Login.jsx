import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://hobbymatch-two.vercel.app'
      }
    })
    if (error) setMensaje('Error: ' + error.message)
    else setMensaje('Revisa tu correo, te enviamos un link 🎉')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">HobbyMatch</h1>
      <input
        className="border p-2 rounded w-64"
        placeholder="tu@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button
        className="bg-black text-white px-6 py-2 rounded"
        onClick={handleLogin}
      >
        Entrar
      </button>
      {mensaje && <p className="text-sm text-gray-500">{mensaje}</p>}
    </div>
  )
}