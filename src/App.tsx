import React, { useState, useEffect } from 'react'
import Transport from './components/Transport'
import TrackList from './components/TrackList'
import Mixer from './components/Mixer'
import Metronome from './components/Metronome'
import EffectsPanel from './components/EffectsPanel'
import DeviceManager from './components/DeviceManager'
import Timeline from './components/Timeline'
import { AudioEngine } from './audio/AudioEngine'
import { Track } from './types/Track'
import { Project } from './types/Project'

function App() {
  const [audioEngine] = useState(() => new AudioEngine())
  const [project, setProject] = useState<Project>({
    name: 'Untitled Project',
    bpm: 120,
    timeSignature: { beats: 4, beatType: 4 },
    tracks: [],
    currentTime: 0,
    isPlaying: false,
    isRecording: false,
    timelineZoom: 50,
    timelineScroll: 0,
    recordStartTime: 0,
    recordArmedTracks: []
  })
  const [showDeviceManager, setShowDeviceManager] = useState(false)

  useEffect(() => {
    // Initialize audio engine
    audioEngine.initialize()
    
    // Set up recording complete callback
    audioEngine.setRecordingCompleteCallback((trackId: string, audioBuffer: AudioBuffer) => {
      // Create a new clip from the recorded audio
      const newClip = {
        id: `clip-${Date.now()}`,
        name: `Recording ${new Date().toLocaleTimeString()}`,
        startTime: project.recordStartTime,
        duration: audioBuffer.duration,
        audioData: audioBuffer,
        file: undefined
      }
      
      // Add the clip to the track
      updateTrack(trackId, {
        clips: [...project.tracks.find((t: Track) => t.id === trackId)?.clips || [], newClip]
      })
      
      console.log(`Added recorded clip to track ${trackId}:`, newClip)
    })
    
    // Cleanup on unmount
    return () => {
      audioEngine.cleanup()
    }
  }, [audioEngine, project.recordStartTime, project.tracks])

  // Update current time when playing
  useEffect(() => {
    let interval: number | null = null
    
    if (project.isPlaying) {
      interval = window.setInterval(() => {
        setProject((prev: Project) => ({
          ...prev,
          currentTime: prev.currentTime + 0.1
        }))
      }, 100)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [project.isPlaying])

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
      effects: [],
      isRecording: false,
      recordArmed: false
    }
    
    setProject((prev: Project) => ({
      ...prev,
      tracks: [...prev.tracks, newTrack]
    }))
  }

  const updateTrack = (trackId: string, updates: Partial<Track>) => {
    setProject((prev: Project) => ({
      ...prev,
      tracks: prev.tracks.map((track: Track) => 
        track.id === trackId ? { ...track, ...updates } : track
      )
    }))
  }

  const updateProject = (updates: Partial<Project>) => {
    setProject((prev: Project) => ({
      ...prev,
      ...updates
    }))
  }

  const deleteTrack = (trackId: string) => {
    // Stop recording if this track is recording
    if (audioEngine.isTrackRecording(trackId)) {
      audioEngine.stopRecording(trackId)
    }
    
    setProject((prev: Project) => ({
      ...prev,
      tracks: prev.tracks.filter((track: Track) => track.id !== trackId)
    }))
  }

  const togglePlayback = () => {
    if (project.isPlaying) {
      audioEngine.stop()
      setProject((prev: Project) => ({ ...prev, isPlaying: false }))
    } else {
      audioEngine.play(project.bpm)
      setProject((prev: Project) => ({ ...prev, isPlaying: true }))
    }
  }

  // Toggle record arm for a track
  const toggleRecordArm = (trackId: string) => {
    const track = project.tracks.find((t: Track) => t.id === trackId)
    if (!track) return

    const newRecordArmed = !track.recordArmed
    updateTrack(trackId, { recordArmed: newRecordArmed })

    // Update project's record armed tracks list
    setProject((prev: Project) => ({
      ...prev,
              recordArmedTracks: newRecordArmed
          ? [...prev.recordArmedTracks, trackId]
          : prev.recordArmedTracks.filter((id: string) => id !== trackId)
    }))
  }

  // Set record start time to current timeline position
  const setRecordStartTime = () => {
    setProject((prev: Project) => ({
      ...prev,
      recordStartTime: prev.currentTime
    }))
  }

  // Start recording from the set start time
  const startRecording = async () => {
    if (project.recordArmedTracks.length === 0) {
      console.warn('No tracks armed for recording')
      return
    }

    // Set current time to record start time
    setProject((prev: Project) => ({
      ...prev,
      currentTime: prev.recordStartTime,
      isRecording: true
    }))

    // Start recording on all armed tracks
    for (const trackId of project.recordArmedTracks) {
      const track = project.tracks.find((t: Track) => t.id === trackId)
      if (track) {
        try {
          await audioEngine.startRecording(trackId, track.inputDeviceId)
          updateTrack(trackId, { isRecording: true })
        } catch (error) {
          console.error(`Failed to start recording on track ${trackId}:`, error)
        }
      }
    }

    // Start playback
    audioEngine.play(project.bpm)
    setProject((prev: Project) => ({ ...prev, isPlaying: true }))
  }

  // Stop recording
  const stopRecording = async () => {
    // Stop recording on all tracks
    for (const track of project.tracks) {
      if (track.isRecording) {
        await audioEngine.stopRecording(track.id)
        updateTrack(track.id, { isRecording: false })
      }
    }

    // Stop playback
    audioEngine.stop()
    setProject((prev: Project) => ({
      ...prev,
      isPlaying: false,
      isRecording: false
    }))
  }

  const stopAllRecording = async () => {
    // Stop recording on all tracks
    for (const track of project.tracks) {
      if (track.isRecording) {
        await audioEngine.stopRecording(track.id)
        updateTrack(track.id, { isRecording: false })
      }
    }
    setProject((prev: Project) => ({ ...prev, isRecording: false }))
  }

  const getInputDevices = () => {
    return audioEngine.getInputDevices()
  }

  const getOutputDevices = () => {
    return audioEngine.getOutputDevices()
  }

  const refreshDevices = async () => {
    await audioEngine.refreshDevices()
  }

  return (
    <div className="h-screen flex flex-col bg-daw-dark">
      {/* Header */}
      <header className="bg-daw-darker border-b border-daw-light-gray p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Web DAW</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">BPM: {project.bpm}</span>
            <span className="text-sm text-gray-400">
              {project.timeSignature.beats}/{project.timeSignature.beatType}
            </span>
            <button 
              className="daw-button daw-button-primary"
              onClick={addTrack}
            >
              Add Track
            </button>
            <button 
              className="daw-button"
              onClick={() => setShowDeviceManager(!showDeviceManager)}
              title="Audio Devices"
            >
              🎛️ Devices
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
            onToggleRecordArm={toggleRecordArm}
            inputDevices={getInputDevices()}
            outputDevices={getOutputDevices()}
          />
        </div>

        {/* Center - Timeline and Transport */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Transport Controls */}
          <div className="bg-daw-darker border-b border-daw-light-gray p-4">
            <Transport 
              isPlaying={project.isPlaying}
              isRecording={project.isRecording}
              onPlayPause={togglePlayback}
              onRecord={startRecording}
              onStop={stopRecording}
            />
          </div>

          {/* Timeline Area */}
          <div className="flex-1 bg-daw-dark min-h-0">
                         <Timeline 
               project={project}
               onUpdateProject={updateProject}
               onUpdateTrack={updateTrack}
               onSetRecordStartTime={setRecordStartTime}
             />
          </div>
        </div>

        {/* Right Panel - Mixer and Effects */}
        <div className="w-80 bg-daw-gray border-l border-daw-light-gray flex-shrink-0">
          <div className="h-full flex flex-col">
            {/* Device Manager (when shown) */}
            {showDeviceManager && (
              <div className="p-4 border-b border-daw-light-gray">
                <DeviceManager 
                  inputDevices={getInputDevices()}
                  outputDevices={getOutputDevices()}
                  onRefreshDevices={refreshDevices}
                />
              </div>
            )}

            {/* Metronome */}
            <div className="p-4 border-b border-daw-light-gray">
              <Metronome 
                bpm={project.bpm}
                onBpmChange={(bpm: number) => setProject((prev: Project) => ({ ...prev, bpm }))}
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
