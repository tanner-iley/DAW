import React, { useMemo, useRef, useState } from 'react'
import { useDawStore } from '../store/useDawStore'
import type { Clip } from '../store/useDawStore'
import { TrackRow } from './Track'

function secondsToLabel(s: number): string {
  const minutes = Math.floor(s / 60)
  const seconds = Math.floor(s % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function Timeline(): React.ReactElement {
  const { tracks, pxPerSec, moveClip } = useDawStore((s) => ({
    tracks: s.tracks,
    pxPerSec: s.pxPerSec,
    moveClip: s.moveClip,
  }))

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [dragState, setDragState] = useState<{
    trackId: string
    clip: Clip
    startClientX: number
    originalStartSec: number
  } | null>(null)

  const totalDurationSec = useMemo(() => {
    let max = 30
    for (const t of tracks) {
      for (const c of t.clips) {
        max = Math.max(max, c.startSec + c.durationSec + 5)
      }
    }
    return max
  }, [tracks])

  const contentWidth = totalDurationSec * pxPerSec

  function onStartDragClip(clip: Clip, clientX: number, trackId?: string) {
    setDragState({ trackId: trackId!, clip, startClientX: clientX, originalStartSec: clip.startSec })
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState) return
    const deltaX = e.clientX - dragState.startClientX
    const deltaSec = deltaX / pxPerSec
    const newStartSec = Math.max(0, dragState.originalStartSec + deltaSec)
    moveClip(dragState.trackId, dragState.clip.id, newStartSec)
  }

  function onPointerUp() {
    setDragState(null)
  }

  return (
    <div className="timeline" onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <div className="ruler" style={{ width: contentWidth }}>
        {Array.from({ length: Math.ceil(totalDurationSec) + 1 }).map((_, i) => {
          const left = i * pxPerSec
          const isMajor = i % 5 === 0
          return (
            <div key={i} className={isMajor ? 'tick major' : 'tick'} style={{ left }}>
              {isMajor && <span className="label">{secondsToLabel(i)}</span>}
            </div>
          )
        })}
      </div>
      <div className="tracks" ref={scrollRef} style={{ width: contentWidth }}>
        {tracks.map((t) => (
          <TrackRow key={t.id} track={t} pxPerSec={pxPerSec} onStartDragClip={(c, x) => onStartDragClip(c, x, t.id)} />
        ))}
      </div>
    </div>
  )
}