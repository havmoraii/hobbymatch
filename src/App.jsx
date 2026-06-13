import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './pages/Login'
import CrearPerfil from './pages/CrearPerfil'
import Feed from './pages/Feed'
import Matches from './pages/Matches'
import Chat from './pages/Chat'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/crear-perfil')
      else navigate('/')
    })
  }, [])

  return <p style={{ padding: 20 }}>Cargando...</p>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/crear-perfil" element={<CrearPerfil />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/chat/:otroId" element={<Chat />} />
    </Routes>
  )
}

export default App