import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const HOBBIES = [
  'Música', 'Hiking', 'Cine', 'Cocina', 'Fotografía',
  'Viajes', 'Deporte', 'Arte', 'Lectura', 'Gaming',
  'Baile', 'Yoga', 'Tecnología', 'Naturaleza', 'Teatro'
]

export default function CrearPerfil() {
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [bio, setBio] = useState('')
  const [intereses, setIntereses] = useState([])
  const navigate = useNavigate()

  const toggleHobby = (hobby) => {
    setIntereses(prev =>
      prev.includes(hobby)
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    )
  }

  const handleGuardar = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      nombre,
      edad: parseInt(edad),
      ciudad,
      bio,
      intereses
    })
    if (!error) navigate('/feed')
  }

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Tu perfil</h1>
      <input className="border p-2 rounded" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
      <input className="border p-2 rounded" placeholder="Edad" type="number" value={edad} onChange={e => setEdad(e.target.value)} />
      <input className="border p-2 rounded" placeholder="Ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)} />
      <textarea className="border p-2 rounded" placeholder="Bio — cuéntanos algo de ti" value={bio} onChange={e => setBio(e.target.value)} />
      <p className="font-medium">Tus intereses:</p>
      <div className="flex flex-wrap gap-2">
        {HOBBIES.map(hobby => (
          <button
            key={hobby}
            onClick={() => toggleHobby(hobby)}
            className={`px-3 py-1 rounded-full border text-sm ${
              intereses.includes(hobby)
                ? 'bg-black text-white'
                : 'bg-white text-black'
            }`}
          >
            {hobby}
          </button>
        ))}
      </div>
      <button onClick={handleGuardar} className="bg-black text-white py-2 rounded mt-2">
        Guardar perfil
      </button>
    </div>
  )
}
