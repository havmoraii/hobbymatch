import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { useParams, useNavigate } from 'react-router-dom'

export default function Chat() {
  const { otroId } = useParams()
  const [mensajes, setMensajes] = useState([])
  const [texto, setTexto] = useState('')
  const [miId, setMiId] = useState(null)
  const [otroPerfil, setOtroPerfil] = useState(null)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    iniciar()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const iniciar = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setMiId(user.id)

    const { data: perfil } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', otroId)
      .single()
    setOtroPerfil(perfil)

    const { data } = await supabase
      .from('mensajes')
      .select('*')
      .or(`and(de.eq.${user.id},para.eq.${otroId}),and(de.eq.${otroId},para.eq.${user.id})`)
      .order('created_at', { ascending: true })

    setMensajes(data || [])

    // Escuchar mensajes en tiempo real
    supabase
      .channel('chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes'
      }, (payload) => {
        const msg = payload.new
        if (
          (msg.de === user.id && msg.para === otroId) ||
          (msg.de === otroId && msg.para === user.id)
        ) {
          setMensajes(prev => [...prev, msg])
        }
      })
      .subscribe()
  }

  const handleEnviar = async () => {
    if (!texto.trim()) return
    await supabase.from('mensajes').insert({ de: miId, para: otroId, texto })
    setTexto('')
  }

  return (
    <div className="max-w-sm mx-auto flex flex-col h-screen">
      <div className="flex items-center gap-3 p-4 border-b">
        <button onClick={() => navigate('/matches')} className="text-sm underline">
          ← Volver
        </button>
        <p className="font-semibold">{otroPerfil?.nombre}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {mensajes.map(msg => (
          <div
            key={msg.id}
            className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
              msg.de === miId
                ? 'bg-black text-white self-end'
                : 'bg-gray-100 text-black self-start'
            }`}
          >
            {msg.texto}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm"
          placeholder="Escribe un mensaje..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleEnviar()}
        />
        <button
          onClick={handleEnviar}
          className="bg-black text-white px-4 py-2 rounded-full text-sm"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}