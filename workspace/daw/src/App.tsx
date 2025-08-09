import './App.css'
import React from 'react'
import { Transport } from './components/Transport'
import { Timeline } from './components/Timeline'
import { useDawStore } from './store/useDawStore'

function App(): React.ReactElement {
  const addTrack = useDawStore((s) => s.addTrack)

  return (
    <div className="app">
      <div className="topbar">
        <div className="logo">Mini DAW</div>
        <Transport />
        <div className="spacer" />
        <button onClick={() => addTrack()}>+ Track</button>
      </div>
      <div className="main">
        <Timeline />
      </div>
    </div>
  )
}

export default App
