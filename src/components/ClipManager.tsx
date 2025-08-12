import React, { useState } from 'react'
import { Plus, Edit, Trash2, Clock } from 'lucide-react'
import { Track } from '../types/Track'
import { AudioClip } from '../types/Track'

interface ClipManagerProps {
  track: Track
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void
}

const ClipManager: React.FC<ClipManagerProps> = ({ track, onUpdateTrack }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClip, setNewClip] = useState({
    name: '',
    startTime: 0,
    duration: 4
  })

  const addClip = () => {
    if (newClip.name.trim()) {
      const clip: AudioClip = {
        id: `clip-${Date.now()}`,
        name: newClip.name,
        startTime: newClip.startTime,
        duration: newClip.duration,
        audioData: undefined,
        file: undefined
      }

      onUpdateTrack(track.id, {
        clips: [...track.clips, clip]
      })

      setNewClip({ name: '', startTime: 0, duration: 4 })
      setShowAddForm(false)
    }
  }

  const deleteClip = (clipId: string) => {
    onUpdateTrack(track.id, {
      clips: track.clips.filter(clip => clip.id !== clipId)
    })
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">Clips</h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1 bg-daw-accent hover:bg-daw-accent-hover text-white rounded"
          title="Add Clip"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Add Clip Form */}
      {showAddForm && (
        <div className="p-3 bg-daw-light-gray rounded space-y-2">
          <input
            type="text"
            placeholder="Clip name"
            value={newClip.name}
            onChange={(e) => setNewClip({ ...newClip, name: e.target.value })}
            className="w-full bg-daw-gray text-white text-sm rounded px-2 py-1 border border-daw-accent focus:outline-none"
          />
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Start (s)"
              value={newClip.startTime}
              onChange={(e) => setNewClip({ ...newClip, startTime: parseFloat(e.target.value) || 0 })}
              className="flex-1 bg-daw-gray text-white text-sm rounded px-2 py-1 border border-daw-accent focus:outline-none"
            />
            <input
              type="number"
              placeholder="Duration (s)"
              value={newClip.duration}
              onChange={(e) => setNewClip({ ...newClip, duration: parseFloat(e.target.value) || 1 })}
              className="flex-1 bg-daw-gray text-white text-sm rounded px-2 py-1 border border-daw-accent focus:outline-none"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={addClip}
              className="flex-1 py-1 bg-daw-green hover:bg-green-600 text-white text-xs rounded"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-1 bg-daw-gray hover:bg-daw-light-gray text-white text-xs rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Clip List */}
      <div className="space-y-1">
        {track.clips.map(clip => (
          <div
            key={clip.id}
            className="flex items-center justify-between p-2 bg-daw-light-gray rounded text-xs"
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-white truncate">{clip.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">
                {formatTime(clip.startTime)} - {formatTime(clip.startTime + clip.duration)}
              </span>
              <button
                onClick={() => deleteClip(clip.id)}
                className="p-1 text-gray-400 hover:text-daw-red"
                title="Delete Clip"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        
        {track.clips.length === 0 && (
          <div className="text-center text-gray-400 text-xs py-2">
            No clips yet
          </div>
        )}
      </div>
    </div>
  )
}

export default ClipManager
