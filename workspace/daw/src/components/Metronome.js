import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDAW } from '../context/DAWContext';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import * as Tone from 'tone';

const MetronomeContainer = styled.div`
  width: 250px;
  background: var(--bg-tertiary);
  border-right: 1px solid var(--border-color);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MetronomeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const MetronomeTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
`;

const MetronomeIcon = styled.div`
  font-size: 1.5rem;
  color: var(--primary-color);
`;

const MetronomeControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ControlLabel = styled.label`
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? 'var(--primary-color)' : 'var(--bg-elevated)'};
  color: white;
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? 'var(--primary-hover)' : 'var(--bg-secondary)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TempoDisplay = styled.div`
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  padding: 0.75rem;
  text-align: center;
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
`;

const TempoControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const TempoButton = styled.button`
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const TimeSignature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  padding: 0.5rem;
`;

const TimeSignatureInput = styled.input`
  background: transparent;
  color: var(--text-primary);
  border: none;
  width: 30px;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;

  &:focus {
    outline: none;
    background: var(--bg-tertiary);
    border-radius: 0.25rem;
  }
`;

const TimeSignatureDivider = styled.div`
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: bold;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VolumeSlider = styled.input`
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

const VolumeIcon = styled.div`
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--text-primary);
  }
`;

function Metronome() {
  const { state, actions } = useDAW();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [timeSignature, setTimeSignature] = useState({ numerator: 4, denominator: 4 });
  const [subdivision, setSubdivision] = useState(4);
  
  const metronomeRef = useRef(null);
  const clickHighRef = useRef(null);
  const clickLowRef = useRef(null);

  useEffect(() => {
    // Initialize metronome sounds
    if (state.isInitialized) {
      clickHighRef.current = new Tone.Player({
        url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
        volume: -10
      }).toDestination();
      
      clickLowRef.current = new Tone.Player({
        url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
        volume: -15
      }).toDestination();
    }
  }, [state.isInitialized]);

  useEffect(() => {
    if (state.metronome.enabled && state.isPlaying && state.isInitialized) {
      startMetronome();
    } else {
      stopMetronome();
    }
  }, [state.metronome.enabled, state.isPlaying, state.bpm, state.isInitialized]);

  const startMetronome = () => {
    if (!metronomeRef.current && clickHighRef.current && clickLowRef.current) {
      const pattern = new Tone.Pattern((time, step) => {
        const isFirstBeat = step % timeSignature.numerator === 0;
        const click = isFirstBeat ? clickHighRef.current : clickLowRef.current;
        click.volume.value = Tone.gainToDb(volume);
        click.start(time);
      }, Array.from({ length: timeSignature.numerator }, (_, i) => i));

      pattern.interval = `${60 / state.bpm}s`;
      pattern.start(0);
      metronomeRef.current = pattern;
    }
  };

  const stopMetronome = () => {
    if (metronomeRef.current) {
      metronomeRef.current.stop();
      metronomeRef.current.dispose();
      metronomeRef.current = null;
    }
  };

  const toggleMetronome = () => {
    actions.setMetronome({ enabled: !state.metronome.enabled });
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    actions.setMetronome({ volume: newVolume });
  };

  const handleTempoChange = (newTempo) => {
    actions.setBPM(newTempo);
  };

  const handleTimeSignatureChange = (field, value) => {
    const newTimeSignature = { ...timeSignature, [field]: parseInt(value) };
    setTimeSignature(newTimeSignature);
  };

  const formatTempo = (bpm) => {
    return bpm.toString().padStart(3, ' ');
  };

  return (
    <MetronomeContainer>
      <MetronomeHeader>
        <MetronomeTitle>Metronome</MetronomeTitle>
        <MetronomeIcon>🥁</MetronomeIcon>
      </MetronomeHeader>

      <MetronomeControls>
        <ControlGroup>
          <ControlLabel>Status</ControlLabel>
          <ToggleButton
            active={state.metronome.enabled}
            onClick={toggleMetronome}
            disabled={!state.isInitialized}
          >
            {state.metronome.enabled ? <FaPause /> : <FaPlay />}
            {state.metronome.enabled ? 'Stop' : 'Start'}
          </ToggleButton>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Tempo (BPM)</ControlLabel>
          <TempoDisplay>
            {formatTempo(state.bpm)}
          </TempoDisplay>
          <TempoControls>
            <TempoButton
              onClick={() => handleTempoChange(Math.max(40, state.bpm - 1))}
              disabled={!state.isInitialized}
            >
              -
            </TempoButton>
            <Slider
              type="range"
              min="40"
              max="200"
              value={state.bpm}
              onChange={(e) => handleTempoChange(parseInt(e.target.value))}
              disabled={!state.isInitialized}
            />
            <TempoButton
              onClick={() => handleTempoChange(Math.min(200, state.bpm + 1))}
              disabled={!state.isInitialized}
            >
              +
            </TempoButton>
          </TempoControls>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Time Signature</ControlLabel>
          <TimeSignature>
            <TimeSignatureInput
              type="number"
              min="1"
              max="16"
              value={timeSignature.numerator}
              onChange={(e) => handleTimeSignatureChange('numerator', e.target.value)}
            />
            <TimeSignatureDivider>/</TimeSignatureDivider>
            <TimeSignatureInput
              type="number"
              min="1"
              max="16"
              value={timeSignature.denominator}
              onChange={(e) => handleTimeSignatureChange('denominator', e.target.value)}
            />
          </TimeSignature>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Volume</ControlLabel>
          <VolumeControl>
            <VolumeIcon>
              {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
            </VolumeIcon>
            <VolumeSlider
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            />
          </VolumeControl>
        </ControlGroup>
      </MetronomeControls>
    </MetronomeContainer>
  );
}

export default Metronome;
