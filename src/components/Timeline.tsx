import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play } from 'lucide-react'
import { Track } from '../types/Track'
import { Project } from '../types/Project'

interface TimelineProps {
  project: Project
  onUpdateProject: (updates: Partial<Project>) => void
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void
  onSetRecordStartTime: () => void
}

const Timeline: React.FC<TimelineProps> = ({
  project,
  onUpdateProject,
  onUpdateTrack,
  onSetRecordStartTime
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)

  // Timeline constants
  const TRACK_HEIGHT = 60
  const TRACK_HEADER_WIDTH = 200
  const MIN_ZOOM = 10 // pixels per second
  const MAX_ZOOM = 200 // pixels per second
  const BEAT_MARKERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']

  // Calculate timeline dimensions
  const timelineWidth = Math.max(1000, project.timelineZoom * 60) // At least 60 seconds visible
  const timelineHeight = project.tracks.length * TRACK_HEIGHT + 100 // Header + tracks

  // Time calculations
  const secondsPerBeat = 60 / project.bpm
  const beatsPerMeasure = project.timeSignature.beats
  const secondsPerMeasure = secondsPerBeat * beatsPerMeasure

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatBeat = (beat: number): string => {
    const measure = Math.floor(beat / beatsPerMeasure) + 1
    const beatInMeasure = (beat % beatsPerMeasure) + 1
    return `${measure}.${beatInMeasure}`
  }

  const timeToPixels = (time: number): number => {
    return time * project.timelineZoom - project.timelineScroll
  }

  const pixelsToTime = (pixels: number): number => {
    return (pixels + project.timelineScroll) / project.timelineZoom
  }

  // Handle timeline scrolling
  const handleTimelineScroll = (deltaX: number, deltaY: number) => {
    const newScrollX = Math.max(0, project.timelineScroll - deltaX)
    const newScrollY = Math.max(0, (project.timelineScroll || 0) - deltaY)
    
    onUpdateProject({
      timelineScroll: newScrollX
    })
  }

  // Handle zoom
  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = direction === 'in' ? 1.2 : 0.8
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, project.timelineZoom * zoomFactor))
    
    onUpdateProject({
      timelineZoom: newZoom
    })
  }

  // Handle time signature change
  const handleTimeSignatureChange = (beats: number, beatType: number) => {
    onUpdateProject({
      timeSignature: { beats, beatType }
    })
  }

  // Mouse wheel handler for scrolling and zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const direction = e.deltaY < 0 ? 'in' : 'out'
      handleZoom(direction)
    } else {
      // Scroll
      handleTimelineScroll(e.deltaX, e.deltaY)
    }
  }

  // Mouse drag handler for scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsDragging(true)
      setDragStart(e.clientX)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart
      handleTimelineScroll(deltaX, 0)
      setDragStart(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Generate ruler markers
  const generateRulerMarkers = () => {
    const markers = []
    const totalMeasures = Math.ceil(timelineWidth / (secondsPerMeasure * project.timelineZoom))
    
    for (let measure = 0; measure < totalMeasures; measure++) {
      const measureTime = measure * secondsPerMeasure
      const measureX = timeToPixels(measureTime)
      
      // Measure line
      markers.push(
        <div
          key={`measure-${measure}`}
          className="absolute border-l border-white border-opacity-30"
          style={{
            left: measureX,
            height: '100%'
          }}
        >
          <div className="absolute top-0 left-1 text-xs text-white opacity-70">
            {measure + 1}
          </div>
        </div>
      )
      
      // Beat lines within measure
      for (let beat = 1; beat < beatsPerMeasure; beat++) {
        const beatTime = measureTime + (beat * secondsPerBeat)
        const beatX = timeToPixels(beatTime)
        
        markers.push(
          <div
            key={`beat-${measure}-${beat}`}
            className="absolute border-l border-white border-opacity-10"
            style={{
              left: beatX,
              height: '100%'
            }}
          />
        )
      }
    }
    
    return markers
  }

  // Generate track clips
  const generateTrackClips = (track: Track) => {
    return track.clips.map(clip => {
      const clipX = timeToPixels(clip.startTime)
      const clipWidth = clip.duration * project.timelineZoom
      
      return (
        <div
          key={clip.id}
          className="absolute bg-daw-accent rounded border border-daw-accent-hover cursor-pointer hover:bg-daw-accent-hover transition-colors"
          style={{
            left: clipX,
            width: Math.max(20, clipWidth),
            height: TRACK_HEIGHT - 8,
            top: 4
          }}
          title={`${clip.name} (${formatTime(clip.startTime)} - ${formatTime(clip.startTime + clip.duration)})`}
        >
          <div className="p-1 text-xs text-white truncate">
            {clip.name}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="h-full flex flex-col bg-daw-dark">
      {/* Timeline Header */}
      <div className="bg-daw-darker border-b border-daw-light-gray p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              BPM: {project.bpm}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Time Signature:</span>
              <select
                value={`${project.timeSignature.beats}/${project.timeSignature.beatType}`}
                onChange={(e) => {
                  const [beats, beatType] = e.target.value.split('/').map(Number)
                  handleTimeSignatureChange(beats, beatType)
                }}
                className="bg-daw-light-gray text-white text-sm rounded px-2 py-1 border border-daw-accent focus:outline-none"
              >
                <option value="4/4">4/4</option>
                <option value="3/4">3/4</option>
                <option value="6/8">6/8</option>
                <option value="2/4">2/4</option>
                <option value="5/4">5/4</option>
                <option value="7/8">7/8</option>
              </select>
            </div>
                         <span className="text-sm text-gray-400">
               {formatTime(project.currentTime)}
             </span>
             <span className="text-sm text-gray-400">
               Record Start: {formatTime(project.recordStartTime)}
             </span>
             <button
               onClick={onSetRecordStartTime}
               className="px-2 py-1 bg-daw-accent hover:bg-daw-accent-hover text-white text-xs rounded"
               title="Set Record Start Time"
             >
               Set Start
             </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleZoom('out')}
              className="p-1 bg-daw-light-gray hover:bg-daw-accent text-gray-400 hover:text-white rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400">
              {Math.round(project.timelineZoom)}px/s
            </span>
            <button
              onClick={() => handleZoom('in')}
              className="p-1 bg-daw-light-gray hover:bg-daw-accent text-gray-400 hover:text-white rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={timelineRef}
          className="h-full overflow-auto"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Timeline Grid */}
          <div
            className="relative"
            style={{
              width: timelineWidth,
              height: timelineHeight
            }}
          >
            {/* Ruler */}
            <div
              ref={rulerRef}
              className="absolute top-0 left-0 right-0 h-20 bg-daw-gray border-b border-daw-light-gray"
              style={{ width: timelineWidth }}
            >
              <div className="relative h-full">
                {generateRulerMarkers()}
              </div>
            </div>

            {/* Track Headers */}
            <div className="absolute top-20 left-0 w-48 bg-daw-gray border-r border-daw-light-gray">
              {project.tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2 border-b border-daw-light-gray"
                  style={{ height: TRACK_HEIGHT }}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      track.type === 'audio' ? 'bg-daw-accent' : 'bg-daw-yellow'
                    }`} />
                    <span className="text-sm font-medium text-white truncate">
                      {track.name}
                    </span>
                    {track.isRecording && (
                      <div className="w-2 h-2 bg-daw-red rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Track Lanes */}
            <div className="absolute top-20 left-48">
              {project.tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="relative border-b border-daw-light-gray bg-daw-gray bg-opacity-50"
                  style={{
                    width: timelineWidth - TRACK_HEADER_WIDTH,
                    height: TRACK_HEIGHT
                  }}
                >
                  {/* Track background grid */}
                  <div className="absolute inset-0 opacity-10">
                    {generateRulerMarkers()}
                  </div>
                  
                  {/* Track clips */}
                  {generateTrackClips(track)}
                  
                  {/* Track recording indicator */}
                  {track.isRecording && (
                    <div className="absolute inset-0 bg-daw-red bg-opacity-10 border-l-4 border-daw-red"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Playhead */}
            {project.isPlaying && (
              <div
                className="absolute top-20 w-0.5 bg-daw-green z-10"
                style={{
                  left: TRACK_HEADER_WIDTH + timeToPixels(project.currentTime),
                  height: timelineHeight - 80
                }}
              >
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-daw-green rounded-full flex items-center justify-center">
                  <Play className="w-2 h-2 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeline
