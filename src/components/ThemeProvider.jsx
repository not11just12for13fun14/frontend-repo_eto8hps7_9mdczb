import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

const THEMES = {
  aurora: {
    name: 'Aurora',
    bg: 'from-[#0f172a] via-[#0b1220] to-[#0f172a]',
    glow: 'shadow-[0_0_50px_rgba(56,189,248,0.35)]',
    accent: 'cyan-400',
    gradient: 'bg-gradient-to-br from-cyan-400/20 to-fuchsia-400/20',
  },
  sunset: {
    name: 'Sunset',
    bg: 'from-rose-900 via-fuchsia-900 to-slate-900',
    glow: 'shadow-[0_0_50px_rgba(244,63,94,0.35)]',
    accent: 'rose-400',
    gradient: 'bg-gradient-to-br from-rose-400/20 to-amber-400/20',
  },
  forest: {
    name: 'Forest',
    bg: 'from-emerald-950 via-slate-900 to-emerald-950',
    glow: 'shadow-[0_0_50px_rgba(16,185,129,0.35)]',
    accent: 'emerald-400',
    gradient: 'bg-gradient-to-br from-emerald-400/20 to-lime-400/20',
  },
  midnight: {
    name: 'Midnight',
    bg: 'from-slate-950 via-slate-900 to-slate-950',
    glow: 'shadow-[0_0_50px_rgba(148,163,184,0.2)]',
    accent: 'indigo-400',
    gradient: 'bg-gradient-to-br from-indigo-400/20 to-blue-400/20',
  },
}

const FONTS = ['Inter','Mona Sans','Manrope','IBM Plex Sans','Geist','serif','mono']

export function useTheme(){
  return useContext(ThemeContext)
}

export default function ThemeProvider({children}){
  const [theme, setTheme] = useState('aurora')
  const [font, setFont] = useState('Inter')

  useEffect(()=>{
    const saved = localStorage.getItem('journal.theme')
    const savedFont = localStorage.getItem('journal.font')
    if(saved && THEMES[saved]) setTheme(saved)
    if(savedFont) setFont(savedFont)
  },[])

  useEffect(()=>{
    localStorage.setItem('journal.theme', theme)
  },[theme])

  useEffect(()=>{
    localStorage.setItem('journal.font', font)
    document.documentElement.style.setProperty('--app-font', font)
  },[font])

  const value = useMemo(()=>({theme, setTheme, font, setFont, THEMES, FONTS}),[theme,font])

  return (
    <ThemeContext.Provider value={value}>
      <div className={`min-h-screen bg-gradient-to-br ${THEMES[theme].bg}`} style={{fontFamily:'var(--app-font, Inter)'}}>
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className={`absolute -inset-24 ${THEMES[theme].gradient} blur-3xl`} />
        </div>
        <div className="relative">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  )
}
