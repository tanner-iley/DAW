import React, { useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { AudioEngine } from '../audio/AudioEngine'

interface MetronomeProps {
  bpm: number
  onBpmChange: (bpm: number) => void
  audioEngine: AudioEngine
}

const Metronome: React.FC<MetronomeProps> = ({ bpm, onBpmChange, audioEngine }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    // Stop metronome when component unmounts
    return () => {
      if (isPlaying) {
        audioEngine.stop()
        setIsPlaying(false)
      }
    }
  }, [audioEngine, isPlaying])

  const toggleMetronome = () => {
    if (isPlaying) {
      audioEngine.stop()
      setIsPlaying(false)
    } else {
      audioEngine.playMetronome(bpm)
      setIsPlaying(true)
    }
  }

  const handleBpmChange = (newBpm: number) => {
    onBpmChange(newBpm)
    // If metronome is playing, restart with new BPM
    if (isPlaying) {
      audioEngine.stop()
      audioEngine.playMetronome(newBpm)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    // Update metronome volume in audio engine
    // This would require adding volume control to the AudioEngine
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // Mute/unmute metronome in audio engine
    // This would require adding mute control to the AudioEngine
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Metronome</h3>
        <button
          onClick={toggleMute}
          className={`p-2 rounded ${
            isMuted ? 'bg-daw-red text-white' : 'bg-daw-light-gray text-gray-400 hover:text-white'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* BPM Control */}
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>BPM</span>
          <span className="font-mono">{bpm}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleBpmChange(Math.max(40, bpm - 1))}
            className="w-8 h-8 bg-daw-light-gray hover:bg-daw-accent text-white rounded flex items-center justify-center text-sm font-bold"
          >
            -
          </button>
          <input
            type="range"
            min="40"
            max="200"
            value={bpm}
            onChange={(e) => handleBpmChange(parseInt(e.target.value))}
            className="flex-1 daw-slider"
          />
          <button
            onClick={() => handleBpmChange(Math.min(200, bpm + 1))}
            className="w-8 h-8 bg-daw-light-gray hover:bg-daw-accent text-white rounded flex items-center justify-center text-sm font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Volume Control */}
      {!isMuted && (
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Volume</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="daw-slider"
          />
        </div>
      )}

      {/* Play/Stop Button */}
      <button
        onClick={toggleMetronome}
        className={`w-full py-3 rounded-lg transition-all duration-200 ${
          isPlaying 
            ? 'bg-daw-yellow hover:bg-yellow-500 text-black' 
            : 'bg-daw-accent hover:bg-daw-accent-hover text-white'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Stop Click</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start Click</span>
            </>
          )}
        </div>
      </button>

      {/* Tempo Presets */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Tempo Presets</div>
        <div className="grid grid-cols-3 gap-2">
          {[60, 90, 120, 140, 160, 180].map(tempo => (
            <button
              key={tempo}
              onClick={() => handleBpmChange(tempo)}
              className={`py-2 px-3 text-xs rounded ${
                bpm === tempo 
                  ? 'bg-daw-accent text-white' 
                  : 'bg-daw-light-gray text-gray-400 hover:text-white'
              }`}
            >
              {tempo}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      {isPlaying && (
        <div className="flex items-center justify-center space-x-2 text-sm text-daw-green">
          <div className="w-2 h-2 bg-daw-green rounded-full animate-pulse"></div>
          <span>Clicking at {bpm} BPM</span>
        </div>
      )}
    </div>
  )
}

export default Metronome
