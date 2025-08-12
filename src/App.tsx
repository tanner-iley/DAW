import React, { useState, useEffect } from 'react'
import Transport from './components/Transport'
import TrackList from './components/TrackList'
import Mixer from './components/Mixer'
import Metronome from './components/Metronome'
import EffectsPanel from './components/EffectsPanel'
import { AudioEngine } from './audio/AudioEngine'
import { Track } from './types/Track'
import { Project } from './types/Project'

function App() {
  const [audioEngine] = useState(() => new AudioEngine())
  const [project, setProject] = useState<Project>({
    name: 'Untitled Project',
    bpm: 120,
    tracks: [],
    currentTime: 0,
    isPlaying: false,
    isRecording: false
  })

  useEffect(() => {
    // Initialize audio engine
    audioEngine.initialize()
    
    // Cleanup on unmount
    return () => {
      audioEngine.cleanup()
    }
  }, [audioEngine])

  const addTrack = () => {
    const newTrack: Track = {
      id: Date.now().toString(),
      name: `Track ${project.tracks.length + 1}`,
      type: 'audio',
      volume: 1,
      pan: 0,
      muted: false,
      solo: false,
      clips: [],
      effects: []
    }
    
    setProject(prev => ({
      ...prev,
      tracks: [...prev.tracks, newTrack]
    }))
  }

  const updateTrack = (trackId: string, updates: Partial<Track>) => {
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.map(track => 
        track.id === trackId ? { ...track, ...updates } : track
      )
    }))
  }

  const deleteTrack = (trackId: string) => {
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.filter(track => track.id !== trackId)
    }))
  }

  const togglePlayback = () => {
    if (project.isPlaying) {
      audioEngine.stop()
      setProject(prev => ({ ...prev, isPlaying: false }))
    } else {
      audioEngine.play(project.bpm)
      setProject(prev => ({ ...prev, isPlaying: true }))
    }
  }

  const toggleRecording = () => {
    if (project.isRecording) {
      audioEngine.stopRecording()
      setProject(prev => ({ ...prev, isRecording: false }))
    } else {
      audioEngine.startRecording()
      setProject(prev => ({ ...prev, isRecording: true }))
    }
  }

  return (
    <div className="h-screen flex flex-col bg-daw-dark">
      {/* Header */}
      <header className="bg-daw-darker border-b border-daw-light-gray p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Web DAW</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">BPM: {project.bpm}</span>
            <button 
              className="daw-button daw-button-primary"
              onClick={addTrack}
            >
              Add Track
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Track List */}
        <div className="w-80 bg-daw-gray border-r border-daw-light-gray">
          <TrackList 
            tracks={project.tracks}
            onUpdateTrack={updateTrack}
            onDeleteTrack={deleteTrack}
          />
        </div>

        {/* Center - Timeline and Transport */}
        <div className="flex-1 flex flex-col">
          {/* Transport Controls */}
          <div className="bg-daw-darker border-b border-daw-light-gray p-4">
            <Transport 
              isPlaying={project.isPlaying}
              isRecording={project.isRecording}
              onPlayPause={togglePlayback}
              onRecord={toggleRecording}
              onStop={() => {
                audioEngine.stop()
                setProject(prev => ({ 
                  ...prev, 
                  isPlaying: false, 
                  isRecording: false 
                }))
              }}
            />
          </div>

          {/* Timeline Area */}
          <div className="flex-1 bg-daw-dark p-4">
            <div className="h-full bg-daw-gray rounded-lg border border-daw-light-gray">
              {/* Timeline content will go here */}
              <div className="p-4 text-center text-gray-400">
                Timeline View - Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Mixer and Effects */}
        <div className="w-96 bg-daw-gray border-l border-daw-light-gray">
          <div className="h-full flex flex-col">
            {/* Metronome */}
            <div className="p-4 border-b border-daw-light-gray">
              <Metronome 
                bpm={project.bpm}
                onBpmChange={(bpm) => setProject(prev => ({ ...prev, bpm }))}
                audioEngine={audioEngine}
              />
            </div>

            {/* Mixer */}
            <div className="flex-1 p-4 border-b border-daw-light-gray">
              <Mixer 
                tracks={project.tracks}
                onUpdateTrack={updateTrack}
              />
            </div>

            {/* Effects Panel */}
            <div className="flex-1 p-4">
              <EffectsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
