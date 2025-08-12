export interface Track {
  id: string
  name: string
  type: 'audio' | 'midi'
  volume: number // 0 to 1
  pan: number // -1 to 1
  muted: boolean
  solo: boolean
  clips: AudioClip[]
  effects: Effect[]
}

export interface AudioClip {
  id: string
  name: string
  startTime: number
  duration: number
  audioData?: AudioBuffer
  file?: File
}

export interface Effect {
  id: string
  type: 'reverb' | 'delay' | 'compressor' | 'eq' | 'distortion'
  enabled: boolean
  parameters: Record<string, number>
}
