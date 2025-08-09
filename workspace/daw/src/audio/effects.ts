import * as Tone from 'tone'

export type EffectType =
  | 'reverb'
  | 'delay'
  | 'distortion'
  | 'chorus'
  | 'bitcrusher'
  | 'filter'
  | 'compressor'
  | 'eq3'

export type EffectDescriptor = {
  id: string
  type: EffectType
  params?: Record<string, any>
}

export type EffectPack = {
  id: string
  name: string
  effects: EffectDescriptor[]
}

export const EFFECT_PACKS: EffectPack[] = [
  {
    id: 'vocal-shine',
    name: 'Vocal Shine',
    effects: [
      { id: 'eq', type: 'eq3', params: { low: -2, mid: -1, high: 2 } },
      { id: 'verb', type: 'reverb', params: { decay: 2.5, wet: 0.25 } },
      { id: 'comp', type: 'compressor', params: { threshold: -18, ratio: 3 } },
    ],
  },
  {
    id: 'lofi-tape',
    name: 'Lo-Fi Tape',
    effects: [
      { id: 'crusher', type: 'bitcrusher', params: { bits: 6, wet: 0.5 } },
      { id: 'chorus', type: 'chorus', params: { frequency: 1.5, delayTime: 3.5, depth: 0.6, wet: 0.35 } },
      { id: 'filter', type: 'filter', params: { type: 'lowpass', frequency: 8000, Q: 0.7 } },
    ],
  },
  {
    id: 'space-delay',
    name: 'Space Delay',
    effects: [
      { id: 'delay', type: 'delay', params: { delayTime: '8n', feedback: 0.35, wet: 0.35 } },
      { id: 'verb', type: 'reverb', params: { decay: 3.5, wet: 0.2 } },
    ],
  },
  {
    id: 'crunch-guitar',
    name: 'Crunch Guitar',
    effects: [
      { id: 'dist', type: 'distortion', params: { distortion: 0.5, oversample: '2x', wet: 0.6 } },
      { id: 'eq', type: 'eq3', params: { low: -4, mid: 2, high: 3 } },
      { id: 'comp', type: 'compressor', params: { threshold: -22, ratio: 4 } },
    ],
  },
]

export function createEffectNode(desc: EffectDescriptor): Tone.ToneAudioNode {
  switch (desc.type) {
    case 'reverb': {
      const node = new Tone.Reverb({ decay: 2, wet: 0.2, ...desc.params })
      return node
    }
    case 'delay': {
      const node = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.3, wet: 0.25, ...desc.params })
      return node
    }
    case 'distortion': {
      const node = new Tone.Distortion({ distortion: 0.4, oversample: '4x', wet: 0.5, ...desc.params })
      return node
    }
    case 'chorus': {
      const node = new Tone.Chorus({ frequency: 1.5, delayTime: 3.5, depth: 0.4, wet: 0.3, ...desc.params }).start()
      return node
    }
    case 'bitcrusher': {
      const BitCrusherCtor = (Tone as any).BitCrusher as new (opts?: any) => Tone.ToneAudioNode
      const node = new BitCrusherCtor({ bits: 8, wet: 0.5, ...desc.params })
      return node
    }
    case 'filter': {
      const node = new Tone.Filter({ type: 'lowpass', frequency: 10000, Q: 0, ...desc.params })
      return node
    }
    case 'compressor': {
      const node = new Tone.Compressor({ threshold: -24, ratio: 2, ...desc.params })
      return node
    }
    case 'eq3': {
      const node = new Tone.EQ3({ low: 0, mid: 0, high: 0, ...desc.params })
      return node
    }
    default:
      throw new Error(`Unknown effect type: ${(desc as any).type}`)
  }
}