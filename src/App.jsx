import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import CrearPerfil from './pages/CrearPerfil'
import Feed from './pages/Feed'
import Matches from './pages/Matches'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/crear-perfil" element={<CrearPerfil />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/matches" element={<Matches />} />
    </Routes>
  )
}

export default App