import React, { useState } from 'react'
import { Settings, Plus, Trash2, Power } from 'lucide-react'

interface Effect {
  id: string
  type: 'reverb' | 'delay' | 'compressor' | 'eq' | 'distortion'
  enabled: boolean
  parameters: Record<string, number>
}

const EffectsPanel: React.FC = () => {
  const [effects, setEffects] = useState<Effect[]>([])
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null)

  const availableEffects = [
    { type: 'reverb', name: 'Reverb', icon: '🌊' },
    { type: 'delay', name: 'Delay', icon: '⏱️' },
    { type: 'compressor', name: 'Compressor', icon: '📊' },
    { type: 'eq', name: 'EQ', icon: '🎛️' },
    { type: 'distortion', name: 'Distortion', icon: '🔥' }
  ]

  const defaultParameters = {
    reverb: { decay: 0.5, wet: 0.3, roomSize: 0.8 },
    delay: { time: 0.5, feedback: 0.3, wet: 0.5 },
    compressor: { threshold: -24, ratio: 4, attack: 0.003, release: 0.25 },
    eq: { frequency: 1000, q: 1, gain: 0 },
    distortion: { amount: 0.5, oversample: 4 }
  }

  const addEffect = (type: Effect['type']) => {
    const newEffect: Effect = {
      id: Date.now().toString(),
      type,
      enabled: true,
      parameters: { ...defaultParameters[type] }
    }
    setEffects([...effects, newEffect])
    setSelectedEffect(newEffect.id)
  }

  const removeEffect = (effectId: string) => {
    setEffects(effects.filter(e => e.id !== effectId))
    if (selectedEffect === effectId) {
      setSelectedEffect(null)
    }
  }

  const toggleEffect = (effectId: string) => {
    setEffects(effects.map(e => 
      e.id === effectId ? { ...e, enabled: !e.enabled } : e
    ))
  }

  const updateParameter = (effectId: string, parameter: string, value: number) => {
    setEffects(effects.map(e => 
      e.id === effectId 
        ? { ...e, parameters: { ...e.parameters, [parameter]: value } }
        : e
    ))
  }

  const getEffectName = (type: Effect['type']) => {
    return availableEffects.find(e => e.type === type)?.name || type
  }

  const getEffectIcon = (type: Effect['type']) => {
    return availableEffects.find(e => e.type === type)?.icon || '⚙️'
  }

  const renderParameterControl = (effect: Effect, paramName: string, min: number, max: number, step: number = 0.01) => {
    const value = effect.parameters[paramName] || 0
    return (
      <div key={paramName} className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span className="capitalize">{paramName}</span>
          <span>{typeof value === 'number' ? value.toFixed(2) : value}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => updateParameter(effect.id, paramName, parseFloat(e.target.value))}
          className="daw-slider"
        />
      </div>
    )
  }

  const renderEffectControls = (effect: Effect) => {
    switch (effect.type) {
      case 'reverb':
        return (
          <div className="space-y-3">
            {renderParameterControl(effect, 'decay', 0, 1)}
            {renderParameterControl(effect, 'wet', 0, 1)}
            {renderParameterControl(effect, 'roomSize', 0, 1)}
          </div>
        )
      case 'delay':
        return (
          <div className="space-y-3">
            {renderParameterControl(effect, 'time', 0, 2)}
            {renderParameterControl(effect, 'feedback', 0, 0.9)}
            {renderParameterControl(effect, 'wet', 0, 1)}
          </div>
        )
      case 'compressor':
        return (
          <div className="space-y-3">
            {renderParameterControl(effect, 'threshold', -60, 0)}
            {renderParameterControl(effect, 'ratio', 1, 20)}
            {renderParameterControl(effect, 'attack', 0.001, 1)}
            {renderParameterControl(effect, 'release', 0.001, 1)}
          </div>
        )
      case 'eq':
        return (
          <div className="space-y-3">
            {renderParameterControl(effect, 'frequency', 20, 20000, 1)}
            {renderParameterControl(effect, 'q', 0.1, 10)}
            {renderParameterControl(effect, 'gain', -20, 20)}
          </div>
        )
      case 'distortion':
        return (
          <div className="space-y-3">
            {renderParameterControl(effect, 'amount', 0, 1)}
            {renderParameterControl(effect, 'oversample', 1, 4, 1)}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Effects</h3>
        <p className="text-sm text-gray-400">Audio processing effects</p>
      </div>

      {/* Add Effect Buttons */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Add Effect</div>
        <div className="grid grid-cols-2 gap-2">
          {availableEffects.map(effect => (
            <button
              key={effect.type}
              onClick={() => addEffect(effect.type as Effect['type'])}
              className="flex items-center space-x-2 p-2 bg-daw-light-gray hover:bg-daw-accent text-gray-400 hover:text-white rounded text-sm transition-colors duration-200"
            >
              <span>{effect.icon}</span>
              <span>{effect.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Effects List */}
      <div className="flex-1 overflow-y-auto">
        {effects.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No effects added</p>
            <p className="text-xs">Add an effect to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {effects.map(effect => (
              <div
                key={effect.id}
                className={`daw-panel transition-all duration-200 ${
                  selectedEffect === effect.id ? 'ring-2 ring-daw-accent' : ''
                }`}
              >
                {/* Effect Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleEffect(effect.id)}
                      className={`p-1 rounded ${
                        effect.enabled ? 'text-daw-green' : 'text-gray-500'
                      }`}
                      title={effect.enabled ? 'Disable' : 'Enable'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <span className="text-lg">{getEffectIcon(effect.type)}</span>
                    <span className="text-sm font-medium text-white">
                      {getEffectName(effect.type)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setSelectedEffect(selectedEffect === effect.id ? null : effect.id)}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Edit Effect"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeEffect(effect.id)}
                      className="p-1 text-gray-400 hover:text-daw-red"
                      title="Remove Effect"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Effect Controls */}
                {selectedEffect === effect.id && (
                  <div className="space-y-3 pt-3 border-t border-daw-light-gray">
                    {renderEffectControls(effect)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EffectsPanel
