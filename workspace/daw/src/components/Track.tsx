import React, { useRef } from 'react'
import { useDawStore } from '../store/useDawStore'
import type { Clip, Track } from '../store/useDawStore'

type Props = {
  track: Track
  pxPerSec: number
  onStartDragClip: (clip: Clip, clientX: number) => void
}

export function TrackRow({ track, pxPerSec, onStartDragClip }: Props): React.ReactElement {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { setTrackPan, setTrackVolume, addClipFromFile } = useDawStore((s) => ({
    setTrackPan: s.setTrackPan,
    setTrackVolume: s.setTrackVolume,
    addClipFromFile: s.addClipFromFile,
  }))

  return (
    <div className="track-row">
      <div className="track-header">
        <div className="track-title">{track.name}</div>
        <div className="track-controls">
          <label>
            Vol
            <input
              type="range"
              min={-60}
              max={0}
              step={1}
              value={track.volumeDb}
              onChange={(e) => setTrackVolume(track.id, Number(e.target.value))}
            />
            <span>{track.volumeDb} dB</span>
          </label>
          <label>
            Pan
            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              value={track.pan}
              onChange={(e) => setTrackPan(track.id, Number(e.target.value))}
            />
            <span>{track.pan.toFixed(2)}</span>
          </label>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                await addClipFromFile(track.id, file)
                e.currentTarget.value = ''
              }
            }}
          />
          <button onClick={() => inputRef.current?.click()}>+ Clip</button>
        </div>
      </div>
      <div className="track-lane">
        {track.clips.map((clip) => {
          const left = clip.startSec * pxPerSec
          const width = Math.max(clip.durationSec * pxPerSec, 12)
          return (
            <div
              key={clip.id}
              className="clip"
              style={{ left, width }}
              onPointerDown={(e) => onStartDragClip(clip, e.clientX)}
              title={`${clip.name} (${clip.durationSec.toFixed(2)}s)`}
            >
              <span className="clip-name">{clip.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}