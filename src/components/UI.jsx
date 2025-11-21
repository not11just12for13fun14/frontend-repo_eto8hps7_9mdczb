import React from 'react'
import { useTheme } from './ThemeProvider'
import { motion } from 'framer-motion'
import { Moon, Sun, Palette, Type, Droplets, Dumbbell, CupSoda, Smile, Water } from 'lucide-react'

export function TopBar({onOpenSettings}){
  const { theme, THEMES } = useTheme()
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full bg-${THEMES[theme].accent}`}></div>
        <h1 className="text-white/90 font-semibold tracking-tight">Muse Journal</h1>
      </div>
      <button onClick={onOpenSettings} className="text-white/70 hover:text-white transition">Settings</button>
    </div>
  )
}

export function Card({children, className=''}){
  return (
    <motion.div layout className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 ${className}`}
      initial={{opacity:0, y:8}} animate={{opacity:1, y:0}}>
      {children}
    </motion.div>
  )
}

export function MetricToggle({label, icon:Icon, value, onChange}){
  return (
    <label className="flex items-center gap-3 text-sm text-white/80">
      <Icon className="w-4 h-4" />
      <span className="min-w-24">{label}</span>
      <input type="number" step="0.5" value={value??''} onChange={e=>onChange(parseFloat(e.target.value)||0)}
        className="bg-white/10 rounded px-2 py-1 text-white w-20 outline-none" />
    </label>
  )
}

export function MoodPicker({value, onChange}){
  const moods = [
    {k:'joy', icon:'😊'},
    {k:'calm', icon:'😌'},
    {k:'tired', icon:'🥱'},
    {k:'anxious', icon:'😬'},
    {k:'grateful', icon:'🙏'},
    {k:'sad', icon:'😔'},
  ]
  return (
    <div className="flex gap-2 flex-wrap">
      {moods.map(m=> (
        <button key={m.k} onClick={()=>onChange(m.k)}
          className={`px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition ${value===m.k?'ring-2 ring-white/40':''}`}>
          <span className="text-xl">{m.icon}</span>
          <span className="ml-2 text-white/80 text-sm">{m.k}</span>
        </button>
      ))}
    </div>
  )
}

export function ToggleThemeFont(){
  const { theme, setTheme, THEMES, font, setFont, FONTS } = useTheme()
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-white/80" />
        <select value={theme} onChange={e=>setTheme(e.target.value)} className="bg-white/10 rounded px-2 py-1 text-white">
          {Object.entries(THEMES).map(([k,v])=> <option key={k} value={k}>{v.name}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Type className="w-4 h-4 text-white/80" />
        <select value={font} onChange={e=>setFont(e.target.value)} className="bg-white/10 rounded px-2 py-1 text-white">
          {FONTS.map(f=> <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
    </div>
  )
}
