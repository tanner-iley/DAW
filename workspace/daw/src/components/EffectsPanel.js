import React from 'react';
import styled from 'styled-components';
import { useDAW } from '../context/DAWContext';
import { FaMagic, FaVolumeUp, FaWaveSquare } from 'react-icons/fa';

const EffectsPanelContainer = styled.div`
  grid-row: 2;
  grid-column: 3;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  width: 300px;
  overflow-y: auto;
`;

const EffectsHeader = styled.div`
  padding: 1rem;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EffectsTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
`;

const EffectsList = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EffectCard = styled.div`
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--border-hover);
    box-shadow: var(--shadow-sm);
  }
`;

const EffectHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const EffectName = styled.div`
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EffectIcon = styled.div`
  color: var(--secondary-color);
  font-size: 1rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: var(--primary-color);
  }

  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-tertiary);
  transition: 0.3s;
  border-radius: 20px;
  border: 1px solid var(--border-color);

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 1px;
    background: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const EffectControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ControlLabel = styled.label`
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Slider = styled.input`
  flex: 1;
  height: 4px;
  background: var(--bg-secondary);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const ValueDisplay = styled.div`
  font-size: 0.75rem;
  color: var(--text-primary);
  font-weight: 500;
  font-family: 'Courier New', monospace;
  min-width: 40px;
  text-align: right;
`;

const Select = styled.select`
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const effects = [
  {
    id: 'reverb',
    name: 'Reverb',
    icon: <FaMagic />,
    controls: [
      { id: 'wet', label: 'Wet', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.3 },
      { id: 'decay', label: 'Decay', type: 'slider', min: 0.1, max: 10, step: 0.1, defaultValue: 2 },
      { id: 'preDelay', label: 'Pre-delay', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.1 }
    ]
  },
  {
    id: 'delay',
    name: 'Delay',
    icon: <FaWaveSquare />,
    controls: [
      { id: 'wet', label: 'Wet', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.3 },
      { id: 'delayTime', label: 'Time', type: 'slider', min: 0.1, max: 2, step: 0.01, defaultValue: 0.5 },
      { id: 'feedback', label: 'Feedback', type: 'slider', min: 0, max: 0.9, step: 0.01, defaultValue: 0.3 }
    ]
  },
  {
    id: 'distortion',
    name: 'Distortion',
    icon: <FaVolumeUp />,
    controls: [
      { id: 'wet', label: 'Wet', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.3 },
      { id: 'distortion', label: 'Amount', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.8 }
    ]
  },
  {
    id: 'filter',
    name: 'Filter',
    icon: <FaWaveSquare />,
    controls: [
      { id: 'wet', label: 'Wet', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.3 },
      { id: 'frequency', label: 'Frequency', type: 'slider', min: 20, max: 20000, step: 1, defaultValue: 1000 },
      { id: 'type', label: 'Type', type: 'select', options: ['lowpass', 'highpass', 'bandpass'], defaultValue: 'lowpass' }
    ]
  },
  {
    id: 'compressor',
    name: 'Compressor',
    icon: <FaVolumeUp />,
    controls: [
      { id: 'wet', label: 'Wet', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.3 },
      { id: 'threshold', label: 'Threshold', type: 'slider', min: -60, max: 0, step: 1, defaultValue: -24 },
      { id: 'ratio', label: 'Ratio', type: 'slider', min: 1, max: 20, step: 0.1, defaultValue: 12 }
    ]
  }
];

function EffectsPanel() {
  const { state, actions } = useDAW();

  const handleEffectToggle = (effectId) => {
    actions.toggleEffect(effectId);
  };

  const handleEffectControlChange = (effectId, controlId, value) => {
    actions.updateEffect(effectId, { [controlId]: value });
  };

  const formatValue = (value, control) => {
    if (control.type === 'slider') {
      if (control.id === 'frequency') {
        return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
      }
      return value.toFixed(2);
    }
    return value;
  };

  return (
    <EffectsPanelContainer>
      <EffectsHeader>
        <EffectsTitle>Effects</EffectsTitle>
      </EffectsHeader>

      <EffectsList>
        {effects.map((effect) => {
          const effectState = state.effects[effect.id];
          
          return (
            <EffectCard key={effect.id}>
              <EffectHeader>
                <EffectName>
                  <EffectIcon>{effect.icon}</EffectIcon>
                  {effect.name}
                </EffectName>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={effectState.enabled}
                    onChange={() => handleEffectToggle(effect.id)}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </EffectHeader>

              <EffectControls>
                {effect.controls.map((control) => (
                  <ControlGroup key={control.id}>
                    <ControlLabel>{control.label}</ControlLabel>
                    <ControlRow>
                      {control.type === 'slider' ? (
                        <>
                          <Slider
                            type="range"
                            min={control.min}
                            max={control.max}
                            step={control.step}
                            value={effectState[control.id]}
                            onChange={(e) => handleEffectControlChange(effect.id, control.id, parseFloat(e.target.value))}
                            disabled={!effectState.enabled}
                          />
                          <ValueDisplay>
                            {formatValue(effectState[control.id], control)}
                          </ValueDisplay>
                        </>
                      ) : control.type === 'select' ? (
                        <Select
                          value={effectState[control.id]}
                          onChange={(e) => handleEffectControlChange(effect.id, control.id, e.target.value)}
                          disabled={!effectState.enabled}
                        >
                          {control.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      ) : null}
                    </ControlRow>
                  </ControlGroup>
                ))}
              </EffectControls>
            </EffectCard>
          );
        })}
      </EffectsList>
    </EffectsPanelContainer>
  );
}

export default EffectsPanel;
