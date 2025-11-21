import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

function MonthMatrix(year, month){
  const first = new Date(year, month, 1)
  const start = new Date(first)
  start.setDate(first.getDate() - ((first.getDay()+6)%7)) // Monday start
  const days = []
  for(let i=0;i<42;i++){
    const d = new Date(start)
    d.setDate(start.getDate()+i)
    days.push(d)
  }
  return days
}

export default function Calendar({year, month, itemsByDay, onSelect}){
  const days = useMemo(()=>MonthMatrix(year,month),[year,month])
  return (
    <div className="grid grid-cols-7 gap-2">
      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(h=> (
        <div key={h} className="text-xs text-white/50 text-center">{h}</div>
      ))}
      {days.map((d,idx)=>{
        const key = d.toISOString().slice(0,10)
        const info = itemsByDay[key]
        const inMonth = d.getMonth()===month
        return (
          <motion.button layoutId={`d-${key}`} key={idx} onClick={()=>onSelect(key)}
            className={`aspect-square rounded-2xl p-2 border ${inMonth?'border-white/10 bg-white/5':'border-white/5 bg-white/0'} hover:bg-white/10 transition relative overflow-hidden`}
            whileHover={{scale:1.02}}>
            <div className="text-[10px] text-white/60">{d.getDate()}</div>
            {/* Doodle preview */}
            <div className="absolute inset-0 p-4 flex flex-wrap gap-1 items-end justify-end">
              {(info?.doodle?.items||[]).slice(0,3).map((el,i)=> (
                <div key={i} className="text-[10px] bg-white/10 rounded px-1 text-white/80">
                  {el.name}
                </div>
              ))}
            </div>
            {/* Todo bullets */}
            <div className="absolute left-2 bottom-2 flex gap-1">
              {(info?.todos||[]).slice(0,3).map((t,i)=> (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${t.done?'bg-emerald-400':'bg-white/40'}`}></div>
              ))}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
