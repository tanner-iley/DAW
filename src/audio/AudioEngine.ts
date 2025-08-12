export class AudioEngine {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private metronomeGain: GainNode | null = null
  private metronomeOscillator: OscillatorNode | null = null
  private mediaRecorder: MediaRecorder | null = null
  private recordedChunks: Blob[] = []
  private isInitialized = false

  async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create master gain node
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = 0.8
      this.masterGain.connect(this.audioContext.destination)
      
      // Create metronome gain node
      this.metronomeGain = this.audioContext.createGain()
      this.metronomeGain.gain.value = 0.3
      this.metronomeGain.connect(this.masterGain)
      
      this.isInitialized = true
      console.log('Audio engine initialized successfully')
    } catch (error) {
      console.error('Failed to initialize audio engine:', error)
      throw error
    }
  }

  cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close()
    }
    this.isInitialized = false
  }

  play(bpm: number): void {
    if (!this.isInitialized || !this.audioContext) {
      console.warn('Audio engine not initialized')
      return
    }

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    console.log(`Starting playback at ${bpm} BPM`)
  }

  stop(): void {
    if (this.metronomeOscillator) {
      this.metronomeOscillator.stop()
      this.metronomeOscillator = null
    }
    console.log('Playback stopped')
  }

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(stream)
      this.recordedChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/wav' })
        this.handleRecordedAudio(blob)
      }

      this.mediaRecorder.start()
      console.log('Recording started')
    } catch (error) {
      console.error('Failed to start recording:', error)
      throw error
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop()
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
      console.log('Recording stopped')
    }
  }

  private handleRecordedAudio(blob: Blob): void {
    // Convert blob to AudioBuffer
    const arrayBuffer = blob.arrayBuffer()
    arrayBuffer.then(buffer => {
      if (this.audioContext) {
        this.audioContext.decodeAudioData(buffer).then(audioBuffer => {
          console.log('Audio recorded successfully:', audioBuffer)
          // Here you would typically add the recorded audio to a track
        }).catch(error => {
          console.error('Failed to decode audio data:', error)
        })
      }
    })
  }

  playMetronome(bpm: number): void {
    if (!this.isInitialized || !this.audioContext || !this.metronomeGain) {
      return
    }

    const interval = (60 / bpm) * 1000 // Convert BPM to milliseconds

    const playClick = () => {
      if (!this.audioContext || !this.metronomeGain) return

      // Create click sound
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.frequency.value = 1000 // 1kHz click
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)
      
      oscillator.connect(gainNode)
      gainNode.connect(this.metronomeGain)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.1)
    }

    // Play initial click
    playClick()
    
    // Set up interval for subsequent clicks
    const metronomeInterval = setInterval(playClick, interval)
    
    // Store interval ID for cleanup
    this.metronomeOscillator = {
      stop: () => clearInterval(metronomeInterval)
    } as any
  }

  createTrackNode(): GainNode | null {
    if (!this.isInitialized || !this.audioContext || !this.masterGain) {
      return null
    }

    const trackGain = this.audioContext.createGain()
    trackGain.connect(this.masterGain)
    return trackGain
  }

  createEffectNode(type: string): AudioNode | null {
    if (!this.isInitialized || !this.audioContext) {
      return null
    }

    switch (type) {
      case 'reverb':
        return this.createReverbNode()
      case 'delay':
        return this.createDelayNode()
      case 'compressor':
        return this.createCompressorNode()
      case 'eq':
        return this.createEQNode()
      case 'distortion':
        return this.createDistortionNode()
      default:
        return null
    }
  }

  private createReverbNode(): ConvolverNode {
    const convolver = this.audioContext!.createConvolver()
    // Create a simple impulse response for reverb
    const sampleRate = this.audioContext!.sampleRate
    const length = sampleRate * 2 // 2 second reverb
    const impulse = this.audioContext!.createBuffer(2, length, sampleRate)
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.1))
      }
    }
    
    convolver.buffer = impulse
    return convolver
  }

  private createDelayNode(): DelayNode {
    const delay = this.audioContext!.createDelay(5.0) // 5 second max delay
    delay.delayTime.value = 0.5 // 500ms delay
    return delay
  }

  private createCompressorNode(): DynamicsCompressorNode {
    const compressor = this.audioContext!.createDynamicsCompressor()
    compressor.threshold.value = -24
    compressor.knee.value = 30
    compressor.ratio.value = 12
    compressor.attack.value = 0.003
    compressor.release.value = 0.25
    return compressor
  }

  private createEQNode(): BiquadFilterNode {
    const eq = this.audioContext!.createBiquadFilter()
    eq.type = 'peaking'
    eq.frequency.value = 1000
    eq.Q.value = 1
    eq.gain.value = 0
    return eq
  }

  private createDistortionNode(): WaveShaperNode {
    const distortion = this.audioContext!.createWaveShaper()
    
    // Create distortion curve
    const sampleRate = this.audioContext!.sampleRate
    const curve = new Float32Array(sampleRate)
    const deg = Math.PI / 180
    
    for (let i = 0; i < sampleRate; i++) {
      const x = (i * 2) / sampleRate - 1
      curve[i] = ((3 + 20) * x * 20 * deg) / (Math.PI + 20 * Math.abs(x))
    }
    
    distortion.curve = curve
    distortion.oversample = '4x'
    return distortion
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext
  }

  isReady(): boolean {
    return this.isInitialized
  }
}
