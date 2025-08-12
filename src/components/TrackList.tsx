import React, { useState } from 'react'
import { Volume2, VolumeX, Mic, Trash2, Settings } from 'lucide-react'
import { Track } from '../types/Track'

interface TrackListProps {
  tracks: Track[]
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void
  onDeleteTrack: (trackId: string) => void
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onUpdateTrack,
  onDeleteTrack
}) => {
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null)

  const handleVolumeChange = (trackId: string, volume: number) => {
    onUpdateTrack(trackId, { volume })
  }

  const handlePanChange = (trackId: string, pan: number) => {
    onUpdateTrack(trackId, { pan })
  }

  const toggleMute = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId)
    if (track) {
      onUpdateTrack(trackId, { muted: !track.muted })
    }
  }

  const toggleSolo = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId)
    if (track) {
      onUpdateTrack(trackId, { solo: !track.solo })
    }
  }

  const formatVolume = (volume: number) => {
    return Math.round(volume * 100)
  }

  const formatPan = (pan: number) => {
    if (pan === 0) return 'C'
    return pan > 0 ? `R${Math.round(pan * 100)}` : `L${Math.round(Math.abs(pan) * 100)}`
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-daw-light-gray">
        <h2 className="text-lg font-semibold text-white">Tracks</h2>
        <p className="text-sm text-gray-400">{tracks.length} tracks</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No tracks yet</p>
            <p className="text-xs">Add a track to get started</p>
          </div>
        ) : (
          tracks.map(track => (
            <div
              key={track.id}
              className={`border-b border-daw-light-gray transition-colors duration-200 ${
                track.muted ? 'opacity-50' : ''
              }`}
            >
              {/* Track Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    track.type === 'audio' ? 'bg-daw-accent' : 'bg-daw-yellow'
                  }`} />
                  <span className="text-sm font-medium text-white truncate">
                    {track.name}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleMute(track.id)}
                    className={`p-1 rounded ${
                      track.muted ? 'bg-daw-red text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    title={track.muted ? 'Unmute' : 'Mute'}
                  >
                    {track.muted ? (
                      <VolumeX className="w-3 h-3" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => toggleSolo(track.id)}
                    className={`p-1 rounded text-xs font-bold ${
                      track.solo ? 'bg-daw-yellow text-black' : 'text-gray-400 hover:text-white'
                    }`}
                    title={track.solo ? 'Unsolo' : 'Solo'}
                  >
                    S
                  </button>
                  
                  <button
                    onClick={() => setExpandedTrack(expandedTrack === track.id ? null : track.id)}
                    className="p-1 text-gray-400 hover:text-white"
                    title="Track Settings"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => onDeleteTrack(track.id)}
                    className="p-1 text-gray-400 hover:text-daw-red"
                    title="Delete Track"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Expanded Track Controls */}
              {expandedTrack === track.id && (
                <div className="px-3 pb-3 space-y-3">
                  {/* Volume Control */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Volume</span>
                      <span>{formatVolume(track.volume)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={track.volume}
                      onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                      className="daw-slider"
                    />
                  </div>

                  {/* Pan Control */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Pan</span>
                      <span>{formatPan(track.pan)}</span>
                    </div>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.01"
                      value={track.pan}
                      onChange={(e) => handlePanChange(track.id, parseFloat(e.target.value))}
                      className="daw-slider"
                    />
                  </div>

                  {/* Track Info */}
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Type: {track.type}</div>
                    <div>Clips: {track.clips.length}</div>
                    <div>Effects: {track.effects.length}</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TrackList
