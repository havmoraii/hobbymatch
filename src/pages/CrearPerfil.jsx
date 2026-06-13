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
  const [foto, setFoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const navigate = useNavigate()

  const toggleHobby = (hobby) => {
    setIntereses(prev =>
      prev.includes(hobby)
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    )
  }

  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFoto(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleGuardar = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    let foto_url = null

    if (foto) {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}/avatar`, foto, { upsert: true })

      if (!error) {
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${user.id}/avatar`)
        foto_url = urlData.publicUrl
      }
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      nombre,
      edad: parseInt(edad),
      ciudad,
      bio,
      intereses,
      foto_url
    })

    if (!error) navigate('/feed')
  }

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Tu perfil</h1>

      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
          {preview
            ? <img src={preview} alt="foto" className="w-full h-full object-cover" />
            : <span className="text-gray-400 text-sm">Sin foto</span>
          }
        </div>
        <label className="text-sm underline cursor-pointer">
          Subir foto
          <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
        </label>
      </div>

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