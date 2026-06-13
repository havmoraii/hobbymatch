import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Feed() {
  const [perfiles, setPerfiles] = useState([])
  const [miId, setMiId] = useState(null)
  const [misIntereses, setMisIntereses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    cargarPerfiles()
  }, [])

  const cargarPerfiles = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setMiId(user.id)

    const { data: miPerfil } = await supabase
      .from('profiles')
      .select('intereses')
      .eq('id', user.id)
      .single()

    setMisIntereses(miPerfil?.intereses || [])

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)

    setPerfiles(data || [])
  }

  const handleLike = async (perfilId) => {
    await supabase.from('likes').insert({ de: miId, para: perfilId })
    setPerfiles(prev => prev.filter(p => p.id !== perfilId))
  }

  const handleSkip = () => {
    setPerfiles(prev => prev.slice(1))
  }

  const interesesEnComun = (interesesOtro) => {
    return (interesesOtro || []).filter(i => misIntereses.includes(i))
  }

  if (perfiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No hay más perfiles por ahora 👀</p>
      </div>
    )
  }

  const perfil = perfiles[0]

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col gap-4 mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">HobbyMatch</h1>
        <button onClick={() => navigate('/matches')} className="text-sm underline">
          Mis matches
        </button>
      </div>
      <div className="border rounded-xl p-4 flex flex-col gap-3 shadow">
        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          Sin foto
        </div>
        <h2 className="text-lg font-semibold">{perfil.nombre}, {perfil.edad}</h2>
        <p className="text-sm text-gray-500">{perfil.ciudad}</p>
        <p className="text-sm">{perfil.bio}</p>
        <div className="flex flex-wrap gap-1">
          {(perfil.intereses || []).map(i => (
            <span
              key={i}
              className={`text-xs px-2 py-1 rounded-full border ${
                misIntereses.includes(i)
                  ? 'bg-black text-white'
                  : 'bg-gray-100'
              }`}
            >
              {i}
            </span>
          ))}
        </div>
        {interesesEnComun(perfil.intereses).length > 0 && (
          <p className="text-xs text-green-600 font-medium">
            ✓ {interesesEnComun(perfil.intereses).length} intereses en común
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={handleSkip} className="flex-1 border py-2 rounded-lg">
          Pasar
        </button>
        <button onClick={() => handleLike(perfil.id)} className="flex-1 bg-black text-white py-2 rounded-lg">
          Me interesa ❤️
        </button>
      </div>
    </div>
  )
}