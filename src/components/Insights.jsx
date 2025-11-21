import React, { useEffect, useMemo, useState } from 'react'
import { Card } from './UI'

const API = import.meta.env.VITE_BACKEND_URL

function Bar({label, value, max, color='bg-emerald-400'}){
  const pct = max ? Math.max(2, (value/max)*100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-white/60">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-2 ${color}`} style={{width:`${pct}%`}} />
      </div>
    </div>
  )
}

export default function Insights(){
  const [email] = useState('demo@muse.app')
  const [range, setRange] = useState('month') // 'week' | 'month'
  const [data, setData] = useState({mood:{}, metrics_avg:{}})

  const {start, end, label} = useMemo(()=>{
    const now = new Date()
    let s, e
    if(range==='week'){
      const day = (now.getDay()+6)%7
      s = new Date(now); s.setDate(now.getDate()-day)
      e = new Date(s); e.setDate(s.getDate()+6)
    } else {
      s = new Date(now.getFullYear(), now.getMonth(), 1)
      e = new Date(now.getFullYear(), now.getMonth()+1, 0)
    }
    return {start:s.toISOString().slice(0,10), end:e.toISOString().slice(0,10), label: range==='week'? 'This Week' : 'This Month'}
  },[range])

  useEffect(()=>{
    fetch(`${API}/api/insights/summary?email=${email}&start=${start}&end=${end}`).then(r=>r.json()).then(setData).catch(()=>{})
  },[email,start,end])

  const moods = Object.entries(data.mood||{})
  const moodMax = moods.reduce((m, [,v])=>Math.max(m, v),0)
  const metrics = Object.entries(data.metrics_avg||{})

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white/80 font-medium">Insights</div>
          <div className="text-white/60 text-sm">{label}: mood distribution and average wellness</div>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setRange('week')} className={`px-3 py-1 rounded-xl border ${range==='week'?'border-white/30 bg-white/10 text-white':'border-white/10 bg-white/5 text-white/70'}`}>Week</button>
          <button onClick={()=>setRange('month')} className={`px-3 py-1 rounded-xl border ${range==='month'?'border-white/30 bg-white/10 text-white':'border-white/10 bg-white/5 text-white/70'}`}>Month</button>
        </div>
      </div>
      <Card>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-white/70 text-sm mb-2">Mood distribution</div>
            <div className="space-y-2">
              {moods.length===0 && <div className="text-white/50 text-sm">No entries yet.</div>}
              {moods.map(([k,v])=> (
                <Bar key={k} label={k} value={v} max={moodMax} color="bg-cyan-400" />
              ))}
            </div>
          </div>
          <div>
            <div className="text-white/70 text-sm mb-2">Average wellness metrics</div>
            <div className="space-y-2">
              {metrics.length===0 && <div className="text-white/50 text-sm">No metrics yet.</div>}
              {metrics.map(([k,v])=> (
                <Bar key={k} label={k} value={Number(v.toFixed? v.toFixed(1): v)} max={Math.max(...metrics.map(([,mv])=>mv),1)} color="bg-emerald-400" />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
