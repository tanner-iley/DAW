import { Track } from './Track'

export interface Project {
  name: string
  bpm: number
  tracks: Track[]
  currentTime: number
  isPlaying: boolean
  isRecording: boolean
}
