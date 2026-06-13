import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import CrearPerfil from './pages/CrearPerfil'
import Feed from './pages/Feed'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/crear-perfil" element={<CrearPerfil />} />
      <Route path="/feed" element={<Feed />} />
    </Routes>
  )
}

export default App