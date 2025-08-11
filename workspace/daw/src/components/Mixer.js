import React, { useState } from 'react';
import styled from 'styled-components';
import { useDAW } from '../context/DAWContext';
import { FaVolumeUp, FaVolumeMute, FaMicrophone } from 'react-icons/fa';

const MixerContainer = styled.div`
  flex: 1;
  background: var(--bg-tertiary);
  border-right: 1px solid var(--border-color);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MixerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const MixerTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
`;

const MasterFader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-elevated);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
`;

const FaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 60px;
`;

const FaderLabel = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
  font-weight: 500;
`;

const FaderTrack = styled.div`
  width: 20px;
  height: 120px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const FaderHandle = styled.div`
  width: 100%;
  height: ${props => props.level}%;
  background: linear-gradient(to top, var(--primary-color), var(--primary-hover));
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: height 0.1s ease;

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: var(--border-color);
    border-radius: 12px;
    z-index: -1;
  }
`;

const VolumeDisplay = styled.div`
  font-size: 0.75rem;
  color: var(--text-primary);
  font-weight: 500;
  font-family: 'Courier New', monospace;
`;

const PanControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const PanLabel = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const PanSlider = styled.input`
  width: 60px;
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

const TrackMixer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
`;

const TrackChannel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
  padding: 0.5rem;
  background: var(--bg-elevated);
  border-radius: 0.375rem;
  border: 1px solid var(--border-color);
`;

const TrackIcon = styled.div`
  color: var(--accent-color);
  font-size: 1rem;
`;

const TrackName = styled.div`
  font-size: 0.75rem;
  color: var(--text-primary);
  text-align: center;
  font-weight: 500;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MuteButton = styled.button`
  background: ${props => props.muted ? 'var(--error-color)' : 'var(--bg-secondary)'};
  color: white;
  border: 1px solid var(--border-color);
  padding: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.muted ? 'var(--error-color)' : 'var(--bg-tertiary)'};
  }
`;

const SoloButton = styled.button`
  background: ${props => props.solo ? 'var(--warning-color)' : 'var(--bg-secondary)'};
  color: white;
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.solo ? 'var(--warning-color)' : 'var(--bg-tertiary)'};
  }
`;

const PeakMeter = styled.div`
  width: 100%;
  height: 60px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  position: relative;
  overflow: hidden;
`;

const PeakLevel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${props => props.level}%;
  background: ${props => props.level > 80 ? 'var(--error-color)' : props.level > 60 ? 'var(--warning-color)' : 'var(--success-color)'};
  transition: height 0.1s ease;
`;

function Mixer() {
  const { state, actions } = useDAW();
  const [masterVolume, setMasterVolume] = useState(80);
  const [masterPan, setMasterPan] = useState(0);

  const handleVolumeChange = (trackId, volume) => {
    actions.updateTrack(trackId, { volume: volume / 100 });
  };

  const handlePanChange = (trackId, pan) => {
    actions.updateTrack(trackId, { pan: (pan - 50) / 50 }); // Convert 0-100 to -1 to 1
  };

  const toggleMute = (trackId) => {
    const track = state.tracks.find(t => t.id === trackId);
    if (track) {
      actions.updateTrack(trackId, { muted: !track.muted });
    }
  };

  const toggleSolo = (trackId) => {
    const track = state.tracks.find(t => t.id === trackId);
    if (track) {
      actions.updateTrack(trackId, { solo: !track.solo });
    }
  };

  const getPeakLevel = () => {
    // Simulate peak level for demonstration
    return Math.random() * 100;
  };

  return (
    <MixerContainer>
      <MixerHeader>
        <MixerTitle>Mixer</MixerTitle>
      </MixerHeader>

      <MasterFader>
        <FaderContainer>
          <FaderLabel>Master</FaderLabel>
          <FaderTrack>
            <FaderHandle level={masterVolume} />
          </FaderTrack>
          <VolumeDisplay>{masterVolume}%</VolumeDisplay>
        </FaderContainer>

        <PanControl>
          <PanLabel>Pan</PanLabel>
          <PanSlider
            type="range"
            min="0"
            max="100"
            value={masterPan}
            onChange={(e) => setMasterPan(parseInt(e.target.value))}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {masterPan === 50 ? 'C' : masterPan < 50 ? 'L' : 'R'}
          </div>
        </PanControl>

        <PeakMeter>
          <PeakLevel level={getPeakLevel()} />
        </PeakMeter>
      </MasterFader>

      <TrackMixer>
        {state.tracks.map((track) => (
          <TrackChannel key={track.id}>
            <TrackIcon>
              <FaMicrophone />
            </TrackIcon>
            
            <TrackName>{track.name}</TrackName>
            
            <FaderContainer>
              <FaderTrack>
                <FaderHandle 
                  level={track.volume * 100} 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickY = e.clientY - rect.top;
                    const newLevel = Math.max(0, Math.min(100, 100 - (clickY / rect.height) * 100));
                    handleVolumeChange(track.id, newLevel);
                  }}
                />
              </FaderTrack>
              <VolumeDisplay>{Math.round(track.volume * 100)}%</VolumeDisplay>
            </FaderContainer>

            <PanControl>
              <PanSlider
                type="range"
                min="0"
                max="100"
                value={((track.pan || 0) + 1) * 50}
                onChange={(e) => handlePanChange(track.id, parseInt(e.target.value))}
              />
            </PanControl>

            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <MuteButton 
                muted={track.muted}
                onClick={() => toggleMute(track.id)}
              >
                M
              </MuteButton>
              <SoloButton 
                solo={track.solo}
                onClick={() => toggleSolo(track.id)}
              >
                S
              </SoloButton>
            </div>

            <PeakMeter>
              <PeakLevel level={getPeakLevel()} />
            </PeakMeter>
          </TrackChannel>
        ))}
      </TrackMixer>
    </MixerContainer>
  );
}

export default Mixer;
