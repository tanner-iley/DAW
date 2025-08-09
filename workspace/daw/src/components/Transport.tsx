import React from 'react'
import { useDawStore } from '../store/useDawStore'

export function Transport(): React.ReactElement {
  const { isPlaying, play, pause, stop, pxPerSec, setPxPerSec } = useDawStore((s) => ({
    isPlaying: s.isPlaying,
    play: s.play,
    pause: s.pause,
    stop: s.stop,
    pxPerSec: s.pxPerSec,
    setPxPerSec: s.setPxPerSec,
  }))

  return (
    <div className="transport">
      <div className="transport-buttons">
        <button onClick={() => (isPlaying ? pause() : play())}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={() => stop()}>Stop</button>
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