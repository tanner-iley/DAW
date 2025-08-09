import { create } from 'zustand'
import { nanoid } from 'nanoid'
import * as Tone from 'tone'

export type Clip = {
  id: string
  name: string
  url: string
  startSec: number
  durationSec: number
}

export type Track = {
  id: string
  name: string
  pan: number // -1..1
  volumeDb: number // -60..0
  clips: Clip[]
}

export type DawState = {
  tracks: Track[]
  isPlaying: boolean
  currentSec: number
  pxPerSec: number
  // actions
  addTrack: () => void
  removeTrack: (trackId: string) => void
  addClipFromFile: (trackId: string, file: File) => Promise<void>
  moveClip: (trackId: string, clipId: string, newStartSec: number) => void
  setTrackPan: (trackId: string, pan: number) => void
  setTrackVolume: (trackId: string, volumeDb: number) => void
  play: () => Promise<void>
  pause: () => void
  stop: () => void
  setPxPerSec: (v: number) => void
}

// Internal audio graph per track
type TrackAudioGraph = {
  panVol: Tone.PanVol
  playersByClipId: Map<string, Tone.Player>
}

const trackIdToGraph = new Map<string, TrackAudioGraph>()
let transportStarted = false

async function ensureTransportStarted() {
  await Tone.start()
  if (!transportStarted) {
    transportStarted = true
  }
}

function getOrCreateTrackGraph(track: Track): TrackAudioGraph {
  let graph = trackIdToGraph.get(track.id)
  if (!graph) {
    const panVol = new Tone.PanVol(track.pan, track.volumeDb).toDestination()
    graph = { panVol, playersByClipId: new Map() }
    trackIdToGraph.set(track.id, graph)
  }
  // update params
  const current = trackIdToGraph.get(track.id)!
  current.panVol.pan.value = track.pan
  current.panVol.volume.value = track.volumeDb
  return current
}

function disposeAllPlayers() {
  for (const [, graph] of trackIdToGraph) {
    for (const [, p] of graph.playersByClipId) {
      try {
        p.unsync()
      } catch {}
      p.dispose()
    }
    graph.playersByClipId.clear()
  }
}

function stopAndClearTransport() {
  Tone.Transport.stop()
  Tone.Transport.cancel(0)
}

async function getFileDurationSec(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer()
  const audioContext = Tone.getContext().rawContext
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0))
  return audioBuffer.duration
}

function fileToObjectUrl(file: File): string {
  return URL.createObjectURL(file)
}

export const useDawStore = create<DawState>((set, get) => ({
  tracks: [
    {
      id: nanoid(),
      name: 'Track 1',
      pan: 0,
      volumeDb: -6,
      clips: [],
    },
  ],
  isPlaying: false,
  currentSec: 0,
  pxPerSec: 100,

  addTrack: () =>
    set((state) => ({
      tracks: [
        ...state.tracks,
        { id: nanoid(), name: `Track ${state.tracks.length + 1}`, pan: 0, volumeDb: -6, clips: [] },
      ],
    })),

  removeTrack: (trackId) =>
    set((state) => ({ tracks: state.tracks.filter((t) => t.id !== trackId) })),

  addClipFromFile: async (trackId, file) => {
    const [durationSec, url] = await Promise.all([getFileDurationSec(file), Promise.resolve(fileToObjectUrl(file))])
    const newClip: Clip = {
      id: nanoid(),
      name: file.name,
      url,
      startSec: 0,
      durationSec,
    }
    set((state) => ({
      tracks: state.tracks.map((t) => (t.id === trackId ? { ...t, clips: [...t.clips, newClip] } : t)),
    }))
  },

  moveClip: (trackId, clipId, newStartSec) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id !== trackId
          ? t
          : { ...t, clips: t.clips.map((c) => (c.id === clipId ? { ...c, startSec: Math.max(0, newStartSec) } : c)) },
      ),
    })),

  setTrackPan: (trackId, pan) =>
    set((state) => ({ tracks: state.tracks.map((t) => (t.id === trackId ? { ...t, pan } : t)) })),

  setTrackVolume: (trackId, volumeDb) =>
    set((state) => ({ tracks: state.tracks.map((t) => (t.id === trackId ? { ...t, volumeDb } : t)) })),

  play: async () => {
    await ensureTransportStarted()

    // Build players and sync to transport
    disposeAllPlayers()
    stopAndClearTransport()

    const { tracks } = get()
    for (const track of tracks) {
      const graph = getOrCreateTrackGraph(track)
      for (const clip of track.clips) {
        const player = new Tone.Player({ url: clip.url, autostart: false })
        player.connect(graph.panVol)
        player.sync().start(clip.startSec)
        graph.playersByClipId.set(clip.id, player)
      }
    }

    Tone.Transport.seconds = get().currentSec
    Tone.Transport.start()
    set({ isPlaying: true })
  },

  pause: () => {
    Tone.Transport.pause()
    set({ isPlaying: false, currentSec: Tone.Transport.seconds })
  },

  stop: () => {
    stopAndClearTransport()
    disposeAllPlayers()
    set({ isPlaying: false, currentSec: 0 })
  },

  setPxPerSec: (v: number) => set({ pxPerSec: Math.max(10, Math.min(800, v)) }),
}))