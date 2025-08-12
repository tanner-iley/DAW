import React from 'react'
import { Play, Pause, Square, Circle } from 'lucide-react'

interface TransportProps {
  isPlaying: boolean
  isRecording: boolean
  onPlayPause: () => void
  onRecord: () => void
  onStop: () => void
}

const Transport: React.FC<TransportProps> = ({
  isPlaying,
  isRecording,
  onPlayPause,
  onRecord,
  onStop
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Play/Pause Button */}
      <button
        onClick={onPlayPause}
        className={`p-3 rounded-full transition-all duration-200 ${
          isPlaying 
            ? 'bg-daw-yellow hover:bg-yellow-500' 
            : 'bg-daw-green hover:bg-green-500'
        }`}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-white" />
        ) : (
          <Play className="w-6 h-6 text-white ml-1" />
        )}
      </button>

      {/* Stop Button */}
      <button
        onClick={onStop}
        className="p-3 bg-daw-gray hover:bg-daw-light-gray rounded-full transition-colors duration-200"
        title="Stop"
      >
        <Square className="w-6 h-6 text-white" />
      </button>

      {/* Record Button */}
      <button
        onClick={onRecord}
        className={`p-3 rounded-full transition-all duration-200 ${
          isRecording 
            ? 'bg-daw-red animate-pulse-slow' 
            : 'bg-daw-gray hover:bg-daw-light-gray'
        }`}
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        <Circle className="w-6 h-6 text-white" />
      </button>

      {/* Status Indicators */}
      <div className="flex items-center space-x-2 ml-4">
        {isPlaying && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-daw-green rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Playing</span>
          </div>
        )}
        {isRecording && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-daw-red rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Recording</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transport
