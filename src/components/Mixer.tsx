import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { Track } from '../types/Track'

interface MixerProps {
  tracks: Track[]
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void
}

const Mixer: React.FC<MixerProps> = ({ tracks, onUpdateTrack }) => {
  const handleVolumeChange = (trackId: string, volume: number) => {
    onUpdateTrack(trackId, { volume })
  }

  const toggleMute = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId)
    if (track) {
      onUpdateTrack(trackId, { muted: !track.muted })
    }
  }

  const formatVolume = (volume: number) => {
    return Math.round(volume * 100)
  }

  const getVolumeColor = (volume: number) => {
    if (volume > 0.8) return 'bg-daw-red'
    if (volume > 0.6) return 'bg-daw-yellow'
    return 'bg-daw-green'
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Mixer</h2>
        <p className="text-sm text-gray-400">Track mixing and levels</p>
      </div>

      {tracks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No tracks to mix</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {tracks.map(track => (
              <div
                key={track.id}
                className={`daw-panel transition-opacity duration-200 ${
                  track.muted ? 'opacity-50' : ''
                }`}
              >
                {/* Track Name */}
                <div className="text-center mb-3">
                  <h3 className="text-sm font-medium text-white truncate">
                    {track.name}
                  </h3>
                </div>

                {/* Volume Fader */}
                <div className="flex flex-col items-center space-y-2">
                  {/* Volume Display */}
                  <div className="text-xs text-gray-400">
                    {formatVolume(track.volume)}%
                  </div>

                  {/* Vertical Fader */}
                  <div className="relative h-32 w-8">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={track.volume}
                      onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                      className="daw-slider transform -rotate-90 origin-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32"
                      style={{ transform: 'rotate(-90deg) translateX(-50%) translateY(50%)' }}
                    />
                  </div>

                  {/* Volume Meter */}
                  <div className="w-8 h-16 bg-daw-darker rounded-sm relative overflow-hidden">
                    <div
                      className={`absolute bottom-0 w-full transition-all duration-100 ${getVolumeColor(track.volume)}`}
                      style={{ height: `${track.volume * 100}%` }}
                    />
                    {/* Peak indicator */}
                    {track.volume > 0.9 && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-white animate-pulse" />
                    )}
                  </div>

                  {/* Mute Button */}
                  <button
                    onClick={() => toggleMute(track.id)}
                    className={`p-2 rounded ${
                      track.muted ? 'bg-daw-red text-white' : 'bg-daw-light-gray text-gray-400 hover:text-white'
                    }`}
                    title={track.muted ? 'Unmute' : 'Mute'}
                  >
                    {track.muted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Track Info */}
                <div className="mt-3 text-xs text-gray-400 text-center space-y-1">
                  <div>Pan: {track.pan === 0 ? 'C' : track.pan > 0 ? `R${Math.round(track.pan * 100)}` : `L${Math.round(Math.abs(track.pan) * 100)}`}</div>
                  <div>Type: {track.type}</div>
                  {track.solo && (
                    <div className="text-daw-yellow font-bold">SOLO</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Mixer
