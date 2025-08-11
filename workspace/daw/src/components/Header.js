import React, { useState } from 'react';
import styled from 'styled-components';
import { useDAW } from '../context/DAWContext';
import { 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaRecordVinyl, 
  FaSave, 
  FaFolderOpen,
  FaCog,
  FaQuestionCircle
} from 'react-icons/fa';

const HeaderContainer = styled.header`
  grid-row: 1;
  grid-column: 1 / -1;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-color);
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TransportControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' ? 'var(--primary-color)' : 'var(--bg-secondary)'};
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
    background: ${props => props.variant === 'primary' ? 'var(--primary-hover)' : 'var(--bg-tertiary)'};
    border-color: var(--border-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.recording {
    background: var(--error-color);
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;

const BPMDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border-color);
`;

const BPMInput = styled.input`
  background: transparent;
  color: var(--text-primary);
  border: none;
  width: 60px;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;

  &:focus {
    outline: none;
    background: var(--bg-tertiary);
    border-radius: 0.25rem;
  }
`;

const TimeDisplay = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: var(--text-secondary);
  min-width: 100px;
  text-align: center;
`;

const ProjectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

function Header({ isElectron }) {
  const { state, actions } = useDAW();
  const [bpmInput, setBpmInput] = useState(state.bpm.toString());

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const handleRecord = () => {
    actions.setRecording(!state.isRecording);
  };

  const handleBPMChange = (e) => {
    const newBpm = parseInt(e.target.value);
    if (newBpm >= 40 && newBpm <= 200) {
      actions.setBPM(newBpm);
    }
  };

  const handleBPMBlur = () => {
    setBpmInput(state.bpm.toString());
  };

  return (
    <HeaderContainer>
      <Logo>
        🎵 DAW Studio
      </Logo>

      <Controls>
        <TransportControls>
          <Button onClick={handlePlayPause}>
            {state.isPlaying ? <FaPause /> : <FaPlay />}
            {state.isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button onClick={handleStop}>
            <FaStop />
            Stop
          </Button>
          
          <Button 
            onClick={handleRecord}
            className={state.isRecording ? 'recording' : ''}
          >
            <FaRecordVinyl />
            Record
          </Button>
        </TransportControls>

        <BPMDisplay>
          <span>BPM:</span>
          <BPMInput
            type="number"
            value={bpmInput}
            onChange={(e) => setBpmInput(e.target.value)}
            onBlur={handleBPMBlur}
            onKeyPress={(e) => e.key === 'Enter' && handleBPMChange(e)}
            min="40"
            max="200"
          />
        </BPMDisplay>

        <TimeDisplay>
          {formatTime(state.currentTime)} / {formatTime(state.duration)}
        </TimeDisplay>
      </Controls>

      <ProjectInfo>
        {isElectron && (
          <>
            <Button onClick={() => console.log('Save project')}>
              <FaSave />
              Save
            </Button>
            <Button onClick={() => console.log('Open project')}>
              <FaFolderOpen />
              Open
            </Button>
          </>
        )}
        <Button>
          <FaCog />
          Settings
        </Button>
        <Button>
          <FaQuestionCircle />
          Help
        </Button>
      </ProjectInfo>
    </HeaderContainer>
  );
}

export default Header;
