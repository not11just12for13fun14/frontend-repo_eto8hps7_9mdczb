import React, { useEffect, useState } from 'react'
import { Card } from './UI'

const API = import.meta.env.VITE_BACKEND_URL

export default function Todos(){
  const [email] = useState('demo@muse.app')
  const [date, setDate] = useState(()=> new Date().toISOString().slice(0,10))
  const [title, setTitle] = useState('')
  const [items, setItems] = useState([])

  function load(){
    fetch(`${API}/api/todos?email=${email}&on=${date}`).then(r=>r.json()).then(d=> setItems(d.todos||[]))
  }
  useEffect(()=>{ load() },[date])

  function add(){
    if(!title) return
    fetch(`${API}/api/todos`,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({user_email:email,date,title})})
      .then(()=>{ setTitle(''); load() })
  }

  function toggle(id, done){
    fetch(`${API}/api/todos`,{method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id, done:!done})})
      .then(load)
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="bg-white/10 rounded px-2 py-1 text-white"/>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Add a task" className="flex-1 bg-white/10 rounded px-3 py-2 text-white placeholder-white/40" />
          <button onClick={add} className="px-3 py-2 rounded-xl bg-emerald-500/80 text-white hover:bg-emerald-500">Add</button>
        </div>
        <div className="space-y-2">
          {items.map(it=> (
            <label key={it._id} className="flex items-center gap-3 text-white/80">
              <input type="checkbox" checked={!!it.done} onChange={()=>toggle(it._id, it.done)} />
              <span className={it.done?'line-through opacity-60':''}>{it.title}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  )
}
