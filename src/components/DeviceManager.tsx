import React, { useState, useEffect } from 'react'
import { RefreshCw, Mic, Volume2, CheckCircle, XCircle } from 'lucide-react'

interface DeviceManagerProps {
  inputDevices: MediaDeviceInfo[]
  outputDevices: MediaDeviceInfo[]
  onRefreshDevices: () => void
}

const DeviceManager: React.FC<DeviceManagerProps> = ({
  inputDevices,
  outputDevices,
  onRefreshDevices
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefreshDevices()
    setIsRefreshing(false)
  }

  const getDeviceStatus = (device: MediaDeviceInfo) => {
    // In a real implementation, you might want to test if the device is actually available
    return device.deviceId ? 'available' : 'unavailable'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Audio Devices</h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`p-2 rounded transition-colors duration-200 ${
            isRefreshing 
              ? 'bg-daw-light-gray text-gray-500' 
              : 'bg-daw-light-gray text-gray-400 hover:text-white'
          }`}
          title="Refresh Devices"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Input Devices */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Mic className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">Input Devices</span>
          <span className="text-xs text-gray-400">({inputDevices.length})</span>
        </div>
        
        {inputDevices.length === 0 ? (
          <div className="text-xs text-gray-400 p-2 bg-daw-light-gray rounded">
            No input devices found
          </div>
        ) : (
          <div className="space-y-1">
            {inputDevices.map(device => (
              <div
                key={device.deviceId}
                className="flex items-center justify-between p-2 bg-daw-light-gray rounded text-xs"
              >
                <div className="flex items-center space-x-2">
                  {getDeviceStatus(device) === 'available' ? (
                    <CheckCircle className="w-3 h-3 text-daw-green" />
                  ) : (
                    <XCircle className="w-3 h-3 text-daw-red" />
                  )}
                  <span className="text-white truncate">
                    {device.label || `Input ${device.deviceId.slice(0, 8)}`}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {device.deviceId.slice(0, 8)}...
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Output Devices */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">Output Devices</span>
          <span className="text-xs text-gray-400">({outputDevices.length})</span>
        </div>
        
        {outputDevices.length === 0 ? (
          <div className="text-xs text-gray-400 p-2 bg-daw-light-gray rounded">
            No output devices found
          </div>
        ) : (
          <div className="space-y-1">
            {outputDevices.map(device => (
              <div
                key={device.deviceId}
                className="flex items-center justify-between p-2 bg-daw-light-gray rounded text-xs"
              >
                <div className="flex items-center space-x-2">
                  {getDeviceStatus(device) === 'available' ? (
                    <CheckCircle className="w-3 h-3 text-daw-green" />
                  ) : (
                    <XCircle className="w-3 h-3 text-daw-red" />
                  )}
                  <span className="text-white truncate">
                    {device.label || `Output ${device.deviceId.slice(0, 8)}`}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {device.deviceId.slice(0, 8)}...
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Device Info */}
      <div className="text-xs text-gray-400 space-y-1">
        <div>Total Inputs: {inputDevices.length}</div>
        <div>Total Outputs: {outputDevices.length}</div>
        <div className="pt-2 border-t border-daw-light-gray">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-daw-green" />
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <XCircle className="w-3 h-3 text-daw-red" />
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeviceManager
