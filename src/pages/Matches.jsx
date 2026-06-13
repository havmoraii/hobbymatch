import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Matches() {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    cargarMatches()
  }, [])

  const cargarMatches = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    // Personas a quienes yo di like
    const { data: misLikes } = await supabase
      .from('likes')
      .select('para')
      .eq('de', user.id)

    const idsQueLesGusteA = misLikes?.map(l => l.para) || []

    // De esas personas, cuáles también me dieron like a mí
    const { data: likesRecibidos } = await supabase
      .from('likes')
      .select('de')
      .eq('para', user.id)
      .in('de', idsQueLesGusteA)

    const idsMatches = likesRecibidos?.map(l => l.de) || []

    // Traer los perfiles de esos matches
    if (idsMatches.length === 0) return setMatches([])

    const { data: perfiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', idsMatches)

    setMatches(perfiles || [])
  }

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col gap-4 mt-10">
      <h1 className="text-xl font-bold">Tus matches ❤️</h1>
      {matches.length === 0 ? (
        <p className="text-gray-500 text-sm">Aún no tienes matches — sigue explorando en el feed.</p>
      ) : (
        matches.map(perfil => (
          <div key={perfil.id} className="border rounded-xl p-4 flex gap-3 items-center shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xs">
              Sin foto
            </div>
            <div>
              <p className="font-semibold">{perfil.nombre}, {perfil.edad}</p>
              <p className="text-sm text-gray-500">{perfil.ciudad}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(perfil.intereses || []).slice(0, 3).map(i => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{i}</span>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}