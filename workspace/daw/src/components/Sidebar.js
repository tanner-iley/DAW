import React, { useState } from 'react';
import styled from 'styled-components';
import { useDAW } from '../context/DAWContext';
import { 
  FaPlus, 
  FaTrash, 
  FaMusic, 
  FaMicrophone, 
  FaDrum, 
  FaGuitar,
  FaVolumeUp,
  FaVolumeMute,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const SidebarContainer = styled.aside`
  grid-row: 2;
  grid-column: 1;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Section = styled.div`
  border-bottom: 1px solid var(--border-color);
`;

const SectionHeader = styled.div`
  padding: 1rem;
  background: var(--bg-tertiary);
  font-weight: bold;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionContent = styled.div`
  padding: 1rem;
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const TrackItem = styled.div`
  background: ${props => props.selected ? 'var(--primary-color)' : 'var(--bg-elevated)'};
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 0.375rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.selected ? 'var(--primary-hover)' : 'var(--bg-tertiary)'};
  }
`;

const TrackIcon = styled.div`
  color: ${props => props.type === 'audio' ? 'var(--accent-color)' : 'var(--secondary-color)'};
  font-size: 1rem;
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TrackName = styled.div`
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackType = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const TrackControls = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ControlButton = styled.button`
  background: transparent;
  color: var(--text-secondary);
  border: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  &.muted {
    color: var(--error-color);
  }
`;

const Button = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: var(--primary-hover);
  }
`;

const InstrumentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const InstrumentButton = styled.button`
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-tertiary);
    border-color: var(--border-hover);
  }
`;

const InstrumentIcon = styled.div`
  font-size: 1.5rem;
  color: var(--secondary-color);
`;

function Sidebar() {
  const { state, actions } = useDAW();
  const [showInstruments, setShowInstruments] = useState(false);

  const addTrack = (type) => {
    const newTrack = {
      id: `track-${Date.now()}`,
      name: `${type} Track ${state.tracks.length + 1}`,
      type: type,
      volume: 0.8,
      muted: false,
      solo: false,
      visible: true,
      clips: []
    };
    actions.addTrack(newTrack);
    actions.selectTrack(newTrack.id);
  };

  const removeTrack = (trackId) => {
    actions.removeTrack(trackId);
  };

  const toggleTrackMute = (trackId) => {
    const track = state.tracks.find(t => t.id === trackId);
    if (track) {
      actions.updateTrack(trackId, { muted: !track.muted });
    }
  };

  const toggleTrackSolo = (trackId) => {
    const track = state.tracks.find(t => t.id === trackId);
    if (track) {
      actions.updateTrack(trackId, { solo: !track.solo });
    }
  };

  const toggleTrackVisibility = (trackId) => {
    const track = state.tracks.find(t => t.id === trackId);
    if (track) {
      actions.updateTrack(trackId, { visible: !track.visible });
    }
  };

  const getTrackIcon = (type) => {
    switch (type) {
      case 'audio':
        return <FaMicrophone />;
      case 'midi':
        return <FaMusic />;
      case 'drum':
        return <FaDrum />;
      case 'bass':
        return <FaGuitar />;
      default:
        return <FaMusic />;
    }
  };

  const instruments = [
    { name: 'Piano', icon: '🎹', type: 'midi' },
    { name: 'Guitar', icon: '🎸', type: 'midi' },
    { name: 'Drums', icon: '🥁', type: 'drum' },
    { name: 'Bass', icon: '🎸', type: 'bass' },
    { name: 'Synth', icon: '🎛️', type: 'midi' },
    { name: 'Strings', icon: '🎻', type: 'midi' }
  ];

  return (
    <SidebarContainer>
      <Section>
        <SectionHeader>
          Tracks
          <Button onClick={() => setShowInstruments(!showInstruments)}>
            <FaPlus />
            Add Track
          </Button>
        </SectionHeader>
        
        {showInstruments && (
          <SectionContent>
            <InstrumentGrid>
              {instruments.map((instrument) => (
                <InstrumentButton
                  key={instrument.name}
                  onClick={() => {
                    addTrack(instrument.type);
                    setShowInstruments(false);
                  }}
                >
                  <InstrumentIcon>{instrument.icon}</InstrumentIcon>
                  {instrument.name}
                </InstrumentButton>
              ))}
            </InstrumentGrid>
          </SectionContent>
        )}
        
        <SectionContent>
          <TrackList>
            {state.tracks.map((track) => (
              <TrackItem
                key={track.id}
                selected={state.selectedTrackId === track.id}
                onClick={() => actions.selectTrack(track.id)}
              >
                <TrackIcon type={track.type}>
                  {getTrackIcon(track.type)}
                </TrackIcon>
                
                <TrackInfo>
                  <TrackName>{track.name}</TrackName>
                  <TrackType>{track.type}</TrackType>
                </TrackInfo>
                
                <TrackControls>
                  <ControlButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTrackVisibility(track.id);
                    }}
                    className={!track.visible ? 'muted' : ''}
                  >
                    {track.visible ? <FaEye /> : <FaEyeSlash />}
                  </ControlButton>
                  
                  <ControlButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTrackSolo(track.id);
                    }}
                    className={track.solo ? 'muted' : ''}
                  >
                    S
                  </ControlButton>
                  
                  <ControlButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTrackMute(track.id);
                    }}
                    className={track.muted ? 'muted' : ''}
                  >
                    {track.muted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </ControlButton>
                  
                  <ControlButton
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrack(track.id);
                    }}
                  >
                    <FaTrash />
                  </ControlButton>
                </TrackControls>
              </TrackItem>
            ))}
          </TrackList>
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>
          Project Browser
        </SectionHeader>
        <SectionContent>
          <div style={{ color: var(--text-muted), fontSize: '0.875rem' }}>
            No files imported yet.
            <br />
            Drag and drop audio files here or use the import button.
          </div>
        </SectionContent>
      </Section>
    </SidebarContainer>
  );
}

export default Sidebar;
