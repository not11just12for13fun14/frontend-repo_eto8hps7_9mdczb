import React, { useEffect, useState } from 'react'
import { Card, ToggleThemeFont } from './UI'
import { useTheme } from './ThemeProvider'

const API = import.meta.env.VITE_BACKEND_URL

export default function Profile(){
  const { theme, setTheme, THEMES, font, setFont, FONTS } = useTheme()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [bio, setBio] = useState('')
  const [goals, setGoals] = useState('')
  const [status, setStatus] = useState('')

  useEffect(()=>{
    const saved = localStorage.getItem('journal.email') || 'demo@muse.app'
    setEmail(saved)
    // Try load profile
    fetch(`${API}/api/users?email=${encodeURIComponent(saved)}`).then(r=>r.json()).then(d=>{
      const u = d.user
      if(u){
        setName(u.name||'')
        setAvatar(u.avatar||'')
        setBio(u.bio||'')
        setGoals((u.goals||[]).join(', '))
        if(u.theme && THEMES[u.theme]) setTheme(u.theme)
        if(u.font) setFont(u.font)
      } else {
        setName('Muse User')
      }
    }).catch(()=>{})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  function save(){
    if(!email){ setStatus('Please enter an email.'); return }
    const payload = { email, name: name||'Muse User', avatar: avatar||null, bio: bio||'', theme, font, goals: goals.split(',').map(s=>s.trim()).filter(Boolean) }
    fetch(`${API}/api/users`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      .then(r=>r.json()).then(()=>{
        localStorage.setItem('journal.email', email)
        localStorage.setItem('journal.theme', theme)
        localStorage.setItem('journal.font', font)
        setStatus('Saved! Your preferences will be used across the app.')
      }).catch(()=> setStatus('Could not save. Try again.'))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white/90">Your Profile</h2>
          <p className="text-white/60 text-sm">Set your identity, vibe, and goals. These sync with your entries.</p>
        </div>
        <ToggleThemeFont />
      </div>

      <Card>
        <div className="grid md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2 space-y-3">
            <label className="block text-sm text-white/70">
              Email
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 w-full bg-white/10 text-white px-3 py-2 rounded-xl outline-none placeholder-white/40" />
            </label>
            <label className="block text-sm text-white/70">
              Name
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your display name" className="mt-1 w-full bg-white/10 text-white px-3 py-2 rounded-xl outline-none placeholder-white/40" />
            </label>
            <label className="block text-sm text-white/70">
              Avatar URL
              <input value={avatar} onChange={e=>setAvatar(e.target.value)} placeholder="https://..." className="mt-1 w-full bg-white/10 text-white px-3 py-2 rounded-xl outline-none placeholder-white/40" />
            </label>
            <label className="block text-sm text-white/70">
              Bio
              <textarea rows={4} value={bio} onChange={e=>setBio(e.target.value)} placeholder="A few words about you" className="mt-1 w-full bg-white/10 text-white px-3 py-2 rounded-xl outline-none placeholder-white/40" />
            </label>
            <label className="block text-sm text-white/70">
              Goals (comma separated)
              <input value={goals} onChange={e=>setGoals(e.target.value)} placeholder="Read daily, Run 3x/week, Practice gratitude" className="mt-1 w-full bg-white/10 text-white px-3 py-2 rounded-xl outline-none placeholder-white/40" />
            </label>
            <div className="flex gap-2">
              <button onClick={save} className="px-4 py-2 rounded-xl bg-emerald-500/80 text-white hover:bg-emerald-500">Save</button>
              {status && <span className="text-white/70 text-sm">{status}</span>}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
                {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover"/> : <div className="text-white/40 text-sm">No avatar</div>}
              </div>
              <div>
                <div className="text-white/80 font-medium">Preview</div>
                <div className="text-white/60 text-sm">{name||'Muse User'}</div>
                <div className="text-white/50 text-xs">{email||'you@example.com'}</div>
              </div>
            </div>
            <div className="text-white/70 text-sm">Theme & Font</div>
            <div className="flex items-center gap-3">
              <select value={theme} onChange={e=>setTheme(e.target.value)} className="bg-white/10 rounded px-2 py-1 text-white">
                {Object.entries(THEMES).map(([k,v])=> <option key={k} value={k}>{v.name}</option>)}
              </select>
              <select value={font} onChange={e=>setFont(e.target.value)} className="bg-white/10 rounded px-2 py-1 text-white">
                {FONTS.map(f=> <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
