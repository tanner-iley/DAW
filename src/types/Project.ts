import { Track } from './Track'

export interface Project {
  name: string
  bpm: number
  timeSignature: TimeSignature
  tracks: Track[]
  currentTime: number
  isPlaying: boolean
  isRecording: boolean
  timelineZoom: number // pixels per second
  timelineScroll: number // horizontal scroll position
  recordStartTime: number // when recording should start
  recordArmedTracks: string[] // track IDs that are armed for recording
}

export interface TimeSignature {
  beats: number // numerator (e.g., 4 in 4/4)
  beatType: number // denominator (e.g., 4 in 4/4)
}
