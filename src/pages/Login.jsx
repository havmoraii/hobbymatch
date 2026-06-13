import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [esRegistro, setEsRegistro] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (esRegistro) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMensaje('Error: ' + error.message)
      else setMensaje('Cuenta creada, ahora inicia sesión')
      setEsRegistro(false)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMensaje('Error: ' + error.message)
      else navigate('/crear-perfil')
    }
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
      <input
        className="border p-2 rounded w-64"
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        className="bg-black text-white px-6 py-2 rounded w-64"
        onClick={handleSubmit}
      >
        {esRegistro ? 'Crear cuenta' : 'Entrar'}
      </button>
      <button
        className="text-sm underline text-gray-500"
        onClick={() => setEsRegistro(!esRegistro)}
      >
        {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
      {mensaje && <p className="text-sm text-gray-500">{mensaje}</p>}
    </div>
  )
}