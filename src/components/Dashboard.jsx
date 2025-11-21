import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, MoodPicker, ToggleThemeFont, MetricToggle } from './UI'
import Calendar from './Calendar'
import DoodleCanvas from './DoodleCanvas'

const API = import.meta.env.VITE_BACKEND_URL

function useAffirmation(email){
  const [text, setText] = useState('')
  useEffect(()=>{
    fetch(`${API}/api/affirmation/daily?email=${encodeURIComponent(email||'anon')}`)
      .then(r=>r.json()).then(d=>setText(d.affirmation)).catch(()=>{})
  },[email])
  return text
}

export default function Dashboard(){
  const [email, setEmail] = useState('demo@muse.app')
  const [profile, setProfile] = useState({name:'Muse User'})
  const [date, setDate] = useState(()=> new Date())
  const year = date.getFullYear(); const month = date.getMonth()
  const [byDay, setByDay] = useState({})
  const affirmation = useAffirmation(email)

  useEffect(()=>{
    // minimal: fetch entries + todos for month
    const start = new Date(year, month, 1).toISOString().slice(0,10)
    const end = new Date(year, month+1, 0).toISOString().slice(0,10)
    Promise.all([
      fetch(`${API}/api/entries?email=${email}&start=${start}&end=${end}`).then(r=>r.json()),
      fetch(`${API}/api/todos?email=${email}&start=${start}&end=${end}`).then(r=>r.json()),
    ]).then(([E,T])=>{
      const map = {}
      ;(E.entries||[]).forEach(e=>{ const k = e.date.slice(0,10); map[k] = map[k]||{}; map[k].doodle = e.doodle })
      ;(T.todos||[]).forEach(t=>{ const k = t.date.slice(0,10); map[k] = map[k]||{}; map[k].todos = (map[k].todos||[]).concat([t]) })
      setByDay(map)
    }).catch(()=>{})
  },[email,year,month])

  const todayKey = new Date().toISOString().slice(0,10)
  const todayInfo = byDay[todayKey] || {}

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white/90">Welcome back, {profile.name}</h2>
          <p className="text-white/60">{affirmation}</p>
        </div>
        <ToggleThemeFont />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white/80 font-medium">Your Month</h3>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded bg-white/10 text-white" onClick={()=>setDate(new Date(year, month-1, 1))}>Prev</button>
              <button className="px-2 py-1 rounded bg-white/10 text-white" onClick={()=>setDate(new Date(year, month+1, 1))}>Next</button>
            </div>
          </div>
          <Calendar year={year} month={month} itemsByDay={byDay} onSelect={(k)=>{
            const d = new Date(k); setDate(d)
          }} />
        </Card>
        <Card>
          <h3 className="text-white/80 font-medium mb-3">Today at a glance</h3>
          <DoodleCanvas doodle={todayInfo.doodle} />
          <div className="mt-3 space-y-2">
            {(todayInfo.todos||[]).map(t=> (
              <div key={t._id} className="flex items-center gap-2 text-white/80 text-sm">
                <div className={`w-2 h-2 rounded-full ${t.done?'bg-emerald-400':'bg-white/40'}`}></div>
                <span>{t.title}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
