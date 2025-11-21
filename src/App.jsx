import React, { useState } from 'react'
import ThemeProvider from './components/ThemeProvider'
import Dashboard from './components/Dashboard'
import Journal from './components/Journal'
import Todos from './components/Todos'
import { motion } from 'framer-motion'

function TabButton({label, active, onClick}){
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-xl border ${active?'border-white/30 bg-white/10 text-white':'border-white/10 bg-white/5 text-white/70'} hover:bg-white/10 transition`}>{label}</button>
  )
}

export default function App(){
  const [tab, setTab] = useState('Dashboard')
  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <img src="/flame-icon.svg" className="w-8 h-8" />
              <h1 className="text-white/90 font-semibold tracking-tight">Muse Journal</h1>
            </div>
            <div className="flex gap-2">
              {['Dashboard','Journal','Todos'].map(l=> (
                <TabButton key={l} label={l} active={tab===l} onClick={()=>setTab(l)} />
              ))}
            </div>
          </div>
          <motion.div key={tab} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}}>
            {tab==='Dashboard' && <Dashboard />}
            {tab==='Journal' && <Journal />}
            {tab==='Todos' && <Todos />}
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  )
}
