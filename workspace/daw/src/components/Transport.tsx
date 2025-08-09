import React from 'react'
import { useDawStore } from '../store/useDawStore'

export function Transport(): React.ReactElement {
  const {
    isPlaying,
    play,
    pause,
    stop,
    pxPerSec,
    setPxPerSec,
    bpm,
    setBpm,
    beatsPerBar,
    setBeatsPerBar,
    metronomeEnabled,
    toggleMetronome,
    metronomeVolumeDb,
    setMetronomeVolumeDb,
  } = useDawStore((s) => ({
    isPlaying: s.isPlaying,
    play: s.play,
    pause: s.pause,
    stop: s.stop,
    pxPerSec: s.pxPerSec,
    setPxPerSec: s.setPxPerSec,
    bpm: s.bpm,
    setBpm: s.setBpm,
    beatsPerBar: s.beatsPerBar,
    setBeatsPerBar: s.setBeatsPerBar,
    metronomeEnabled: s.metronomeEnabled,
    toggleMetronome: s.toggleMetronome,
    metronomeVolumeDb: s.metronomeVolumeDb,
    setMetronomeVolumeDb: s.setMetronomeVolumeDb,
  }))

  return (
    <div className="transport">
      <div className="transport-buttons">
        <button onClick={() => (isPlaying ? pause() : play())}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={() => stop()}>Stop</button>
      </div>
      <div className="tempo">
        <label>
          Tempo
          <input
            type="number"
            min={40}
            max={240}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            style={{ width: 64, marginLeft: 6 }}
          />
          <span> BPM</span>
        </label>
        <label style={{ marginLeft: 12 }}>
          Beat
          <input
            type="number"
            min={1}
            max={16}
            value={beatsPerBar}
            onChange={(e) => setBeatsPerBar(Number(e.target.value))}
            style={{ width: 48, marginLeft: 6 }}
          />
          <span> /4</span>
        </label>
        <label style={{ marginLeft: 12 }}>
          Click
          <input
            type="checkbox"
            checked={metronomeEnabled}
            onChange={toggleMetronome}
            style={{ marginLeft: 6 }}
          />
        </label>
        <label style={{ marginLeft: 8 }}>
          Vol
          <input
            type="range"
            min={-60}
            max={0}
            step={1}
            value={metronomeVolumeDb}
            onChange={(e) => setMetronomeVolumeDb(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="zoom">
        <label>
          Zoom
          <input
            type="range"
            min={20}
            max={400}
            step={5}
            value={pxPerSec}
            onChange={(e) => setPxPerSec(Number(e.target.value))}
          />
          <span>{Math.round(pxPerSec)} px/s</span>
        </label>
      </div>
    </div>
  )
}