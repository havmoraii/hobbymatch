import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Matches() {
  const [matches, setMatches] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    cargarMatches()
  }, [])

  const cargarMatches = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: misLikes } = await supabase
      .from('likes')
      .select('para')
      .eq('de', user.id)

    const idsQueLesGusteA = misLikes?.map(l => l.para) || []

    const { data: likesRecibidos } = await supabase
      .from('likes')
      .select('de')
      .eq('para', user.id)
      .in('de', idsQueLesGusteA)

    const idsMatches = likesRecibidos?.map(l => l.de) || []

    if (idsMatches.length === 0) return setMatches([])

    const { data: perfiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', idsMatches)

    setMatches(perfiles || [])
  }

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col gap-4 mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Tus matches ❤️</h1>
        <button onClick={() => navigate('/feed')} className="text-sm underline">
          Ver feed
        </button>
      </div>
      {matches.length === 0 ? (
        <p className="text-gray-500 text-sm">Aún no tienes matches — sigue explorando en el feed.</p>
      ) : (
        matches.map(perfil => (
          <div key={perfil.id} className="border rounded-xl p-4 flex gap-3 items-center shadow">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
              {perfil.foto_url
                ? <img src={perfil.foto_url} alt="foto" className="w-full h-full object-cover" />
                : 'Sin foto'
              }
            </div>
            <div className="flex-1">
              <p className="font-semibold">{perfil.nombre}, {perfil.edad}</p>
              <p className="text-sm text-gray-500">{perfil.ciudad}</p>
            </div>
            <button
              onClick={() => navigate(`/chat/${perfil.id}`)}
              className="bg-black text-white px-3 py-1 rounded-full text-sm"
            >
              Chat
            </button>
          </div>
        ))
      )}
    </div>
  )
}