import React from 'react'
import { motion } from 'framer-motion'

const ICONS = {
  'coffee-cup':'☕', 'dumbbell':'🏋️', 'running-shoe':'👟', 'footsteps':'🚶', 'family':'👨‍👩‍👧', 'laptop':'💻', 'book':'📚', 'dog':'🐶', 'cat':'🐱', 'film-reel':'🎞️', 'leaf':'🍃', 'moon':'🌙', 'sun':'☀️', 'wave':'🌊', 'balloons':'🎈', 'chef-hat':'👨‍🍳', 'cupcake':'🧁', 'smiley':'😊', 'sparkles':'✨'
}

export default function DoodleCanvas({doodle, className=''}){
  const items = doodle?.items || []
  return (
    <div className={`relative w-full h-56 rounded-2xl border border-white/10 bg-white/5 overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute -inset-16 ${doodle?.palette==='sunset'?'bg-gradient-to-br from-rose-400/20 to-amber-400/20':'bg-gradient-to-br from-indigo-400/20 to-blue-400/20'} blur-2xl`} />
      </div>
      {items.map((el,i)=> (
        <motion.div key={i} initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}}
          className="absolute text-3xl select-none"
          style={{left:el.x, top:el.y}}>
          <span title={el.name}>{ICONS[el.name] || '🔖'}</span>
        </motion.div>
      ))}
    </div>
  )
}
