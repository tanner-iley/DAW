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
  isRecording: boolean
  recordingTrackId?: string
  currentSec: number
  pxPerSec: number
  bpm: number
  beatsPerBar: number
  metronomeEnabled: boolean
  metronomeVolumeDb: number
  // actions
  addTrack: () => void
  removeTrack: (trackId: string) => void
  addClipFromFile: (trackId: string, file: File) => Promise<void>
  addClipFromBlob: (trackId: string, blob: Blob, name: string, startSec: number) => Promise<void>
  moveClip: (trackId: string, clipId: string, newStartSec: number) => void
  setTrackPan: (trackId: string, pan: number) => void
  setTrackVolume: (trackId: string, volumeDb: number) => void
  play: () => Promise<void>
  pause: () => void
  stop: () => void
  setPxPerSec: (v: number) => void
  startRecording: (trackId: string) => Promise<void>
  stopRecording: () => Promise<void>
  setBpm: (bpm: number) => void
  setBeatsPerBar: (n: number) => void
  toggleMetronome: () => void
  setMetronomeVolumeDb: (db: number) => void
}

// Internal audio graph per track
type TrackAudioGraph = {
  panVol: Tone.PanVol
  playersByClipId: Map<string, Tone.Player>
}

const trackIdToGraph = new Map<string, TrackAudioGraph>()
let transportStarted = false

// Recording internals (non-serializable)
let mediaStream: MediaStream | null = null
let mediaRecorder: MediaRecorder | null = null
let recChunks: Blob[] = []
let recStartSec = 0

// Metronome internals
let metVolume: Tone.Volume | null = null
let metSynth: Tone.Synth | null = null
let metRepeatId: number | null = null
let metBeatCounter = 0

async function ensureTransportStarted() {
  await Tone.start()
  if (!transportStarted) {
    transportStarted = true
  }
}

function ensureMetronomeNodes(volumeDb: number) {
  if (!metVolume) {
    metVolume = new Tone.Volume(volumeDb).toDestination()
  }
  if (!metSynth) {
    metSynth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 },
    }).connect(metVolume!)
  }
  if (metVolume.volume.value !== volumeDb) {
    metVolume.volume.value = volumeDb
  }
}

function scheduleMetronome(beatsPerBar: number) {
  if (!metSynth) return
  metBeatCounter = 0
  metRepeatId = Tone.Transport.scheduleRepeat((time) => {
    const isAccent = metBeatCounter % beatsPerBar === 0
    const note = isAccent ? 'C6' : 'C5'
    const velocity = isAccent ? 1.0 : 0.6
    metSynth!.triggerAttackRelease(note, '16n', time, velocity)
    metBeatCounter = (metBeatCounter + 1) % Math.max(1, beatsPerBar)
  }, '4n')
}

function cancelMetronome() {
  if (metRepeatId != null) {
    try {
      Tone.Transport.clear(metRepeatId)
    } catch {}
    metRepeatId = null
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

async function getBlobDurationSec(blob: Blob): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob)
    const audio = new Audio()
    let resolved = false
    const cleanup = () => {
      if (!resolved) {
        resolved = true
        URL.revokeObjectURL(url)
      }
    }
    const finish = () => {
      if (!resolved) {
        resolved = true
        const duration = Number.isFinite(audio.duration) ? audio.duration : 0
        URL.revokeObjectURL(url)
        resolve(duration)
      }
    }
    audio.preload = 'metadata'
    audio.src = url
    audio.onloadedmetadata = finish
    audio.ondurationchange = finish
    audio.onerror = () => {
      cleanup()
      resolve(0)
    }
  })
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
  isRecording: false,
  recordingTrackId: undefined,
  currentSec: 0,
  pxPerSec: 100,
  bpm: 120,
  beatsPerBar: 4,
  metronomeEnabled: false,
  metronomeVolumeDb: -18,

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

  addClipFromBlob: async (trackId, blob, name, startSec) => {
    const url = URL.createObjectURL(blob)
    const durationSec = await getBlobDurationSec(blob)
    const newClip: Clip = { id: nanoid(), name, url, startSec, durationSec }
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
    cancelMetronome()

    const { tracks, bpm, metronomeEnabled, metronomeVolumeDb, beatsPerBar } = get()

    Tone.Transport.bpm.value = bpm

    for (const track of tracks) {
      const graph = getOrCreateTrackGraph(track)
      for (const clip of track.clips) {
        const player = new Tone.Player({ url: clip.url, autostart: false })
        player.connect(graph.panVol)
        player.sync().start(clip.startSec)
        graph.playersByClipId.set(clip.id, player)
      }
    }

    if (metronomeEnabled) {
      ensureMetronomeNodes(metronomeVolumeDb)
      scheduleMetronome(beatsPerBar)
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
    cancelMetronome()
    set({ isPlaying: false, currentSec: 0 })
  },

  setPxPerSec: (v: number) => set({ pxPerSec: Math.max(10, Math.min(800, v)) }),

  startRecording: async (trackId: string) => {
    if (get().isRecording) return
    // Request mic
    if (!mediaStream) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (e) {
        console.error('Microphone permission denied or unavailable', e)
        return
      }
    }

    await ensureTransportStarted()

    const options: MediaRecorderOptions = {}
    // pick a supported mime type if available
    const preferredTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
    ]
    for (const t of preferredTypes) {
      if ((window as any).MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
        options.mimeType = t
        break
      }
    }

    mediaRecorder = new MediaRecorder(mediaStream!, options)
    recChunks = []
    recStartSec = Tone.Transport.seconds
    mediaRecorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) recChunks.push(ev.data)
    }
    mediaRecorder.onstop = async () => {
      const blob = new Blob(recChunks, { type: mediaRecorder?.mimeType || 'audio/webm' })
      const startAt = recStartSec
      const name = 'Recording'
      await get().addClipFromBlob(trackId, blob, name, startAt)
    }

    mediaRecorder.start()
    set({ isRecording: true, recordingTrackId: trackId })
  },

  stopRecording: async () => {
    if (!get().isRecording) return
    try {
      mediaRecorder?.stop()
    } catch (e) {
      console.warn('Failed to stop recorder', e)
    }
    set({ isRecording: false, recordingTrackId: undefined })
  },

  setBpm: (bpm: number) => {
    bpm = Math.max(30, Math.min(300, Math.round(bpm)))
    set({ bpm })
    if (transportStarted) {
      Tone.Transport.bpm.value = bpm
    }
  },

  setBeatsPerBar: (n: number) => {
    set({ beatsPerBar: Math.max(1, Math.min(16, Math.round(n))) })
  },

  toggleMetronome: () => {
    const { metronomeEnabled, metronomeVolumeDb, beatsPerBar, isPlaying } = get()
    const next = !metronomeEnabled
    set({ metronomeEnabled: next })
    if (next) {
      ensureMetronomeNodes(metronomeVolumeDb)
      if (isPlaying) scheduleMetronome(beatsPerBar)
    } else {
      cancelMetronome()
    }
  },

  setMetronomeVolumeDb: (db: number) => {
    set({ metronomeVolumeDb: Math.max(-60, Math.min(0, db)) })
    if (metVolume) metVolume.volume.value = Math.max(-60, Math.min(0, db))
  },
}))