import React, { useEffect, useMemo, useState } from 'react'
import { Card, MoodPicker } from './UI'
import DoodleCanvas from './DoodleCanvas'

const API = import.meta.env.VITE_BACKEND_URL

const QUESTIONS = [
  {k:'recap', q:'Quick recap of your day'},
  {k:'happy', q:'What made you happy today?'},
  {k:'grateful', q:'What are you grateful for?'},
  {k:'challenge', q:'What challenged you and how did you respond?'},
]

export default function Journal(){
  const [email] = useState('demo@muse.app')
  const [date, setDate] = useState(()=> new Date().toISOString().slice(0,10))
  const [mood, setMood] = useState('joy')
  const [answers, setAnswers] = useState({})
  const [thoughts, setThoughts] = useState('')
  const [metrics, setMetrics] = useState({sleep:7, water:6, caffeine:1, exercise:20})
  const [doodle, setDoodle] = useState(null)

  function handleGenerate(){
    const text = [answers.recap, answers.happy, answers.grateful, thoughts].filter(Boolean).join(' ')
    fetch(`${API}/api/doodle/generate`,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text, answers, metrics})})
      .then(r=>r.json()).then(d=> setDoodle(d.doodle))
  }

  function handleSave(){
    fetch(`${API}/api/entries`,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({user_email:email, date, mood, answers, thoughts, metrics, doodle})})
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white/80 font-medium">New Entry</h3>
            <p className="text-white/60 text-sm">Guided prompts, rich fonts, stickers and a doodle generated from your words.</p>
          </div>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="bg-white/10 rounded px-2 py-1 text-white"/>
        </div>
        <div className="mb-3">
          <MoodPicker value={mood} onChange={setMood} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {QUESTIONS.map(q=> (
              <div key={q.k}>
                <label className="text-sm text-white/60">{q.q}</label>
                <textarea rows={3} value={answers[q.k]||''} onChange={e=>setAnswers({...answers,[q.k]:e.target.value})}
                  className="w-full mt-1 bg-white/10 rounded-xl text-white p-3 outline-none placeholder-white/40"
                  placeholder="Write here... fancy fonts supported via settings" />
              </div>
            ))}
            <div>
              <label className="text-sm text-white/60">Your thoughts</label>
              <textarea rows={5} value={thoughts} onChange={e=>setThoughts(e.target.value)} className="w-full mt-1 bg-white/10 rounded-xl text-white p-3 outline-none"/>
            </div>
            <div className="flex gap-2">
              <button onClick={handleGenerate} className="px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/15">Generate Doodle</button>
              <button onClick={handleSave} className="px-3 py-2 rounded-xl bg-emerald-500/80 text-white hover:bg-emerald-500">Save Entry</button>
            </div>
          </div>
          <div>
            <DoodleCanvas doodle={doodle} />
          </div>
        </div>
      </Card>
    </div>
  )
}
