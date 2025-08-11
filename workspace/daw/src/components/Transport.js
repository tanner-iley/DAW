import React from 'react';
import styled from 'styled-components';
import { useDAW } from '../context/DAWContext';
import { FaPlay, FaPause, FaStop, FaStepForward, FaStepBackward } from 'react-icons/fa';

const TransportContainer = styled.div`
  width: 300px;
  background: var(--bg-tertiary);
  border-right: 1px solid var(--border-color);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TransportControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const TransportButton = styled.button`
  background: ${props => props.variant === 'primary' ? 'var(--primary-color)' : 'var(--bg-elevated)'};
  color: white;
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s ease;
  min-width: 48px;
  height: 48px;

  &:hover {
    background: ${props => props.variant === 'primary' ? 'var(--primary-hover)' : 'var(--bg-secondary)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const TransportInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`;

const InfoLabel = styled.span`
  color: var(--text-secondary);
`;

const InfoValue = styled.span`
  color: var(--text-primary);
  font-weight: 500;
  font-family: 'Courier New', monospace;
`;

const LoopControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoopButton = styled.button`
  background: ${props => props.active ? 'var(--primary-color)' : 'var(--bg-elevated)'};
  color: white;
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? 'var(--primary-hover)' : 'var(--bg-secondary)'};
  }
`;

const LoopRange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const LoopInput = styled.input`
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  width: 60px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

function Transport() {
  const { state, actions } = useDAW();

  const handlePlayPause = () => {
    if (state.isPlaying) {
      actions.setPlaying(false);
    } else {
      actions.setPlaying(true);
    }
  };

  const handleStop = () => {
    actions.setPlaying(false);
    actions.setCurrentTime(0);
  };

  const handleStepForward = () => {
    const newTime = Math.min(state.currentTime + 1, state.duration);
    actions.setCurrentTime(newTime);
  };

  const handleStepBackward = () => {
    const newTime = Math.max(state.currentTime - 1, 0);
    actions.setCurrentTime(newTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatBeat = (time) => {
    const beats = Math.floor((time * state.bpm) / 60);
    const bars = Math.floor(beats / 4) + 1;
    const beatInBar = (beats % 4) + 1;
    return `${bars}.${beatInBar}`;
  };

  return (
    <TransportContainer>
      <TransportControls>
        <TransportButton onClick={handleStepBackward}>
          <FaStepBackward />
        </TransportButton>
        
        <TransportButton 
          variant="primary" 
          onClick={handlePlayPause}
        >
          {state.isPlaying ? <FaPause /> : <FaPlay />}
        </TransportButton>
        
        <TransportButton onClick={handleStop}>
          <FaStop />
        </TransportButton>
        
        <TransportButton onClick={handleStepForward}>
          <FaStepForward />
        </TransportButton>
      </TransportControls>

      <TransportInfo>
        <InfoRow>
          <InfoLabel>Position:</InfoLabel>
          <InfoValue>{formatTime(state.currentTime)}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Beat:</InfoLabel>
          <InfoValue>{formatBeat(state.currentTime)}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>BPM:</InfoLabel>
          <InfoValue>{state.bpm}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Duration:</InfoLabel>
          <InfoValue>{formatTime(state.duration)}</InfoValue>
        </InfoRow>
      </TransportInfo>

      <LoopControls>
        <LoopButton active={false}>
          Loop
        </LoopButton>
        
        <LoopRange>
          <LoopInput 
            type="text" 
            placeholder="0:00" 
            defaultValue="0:00"
          />
          <span>to</span>
          <LoopInput 
            type="text" 
            placeholder="2:00" 
            defaultValue="2:00"
          />
        </LoopRange>
      </LoopControls>
    </TransportContainer>
  );
}

export default Transport;
