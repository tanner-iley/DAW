import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDAW } from '../context/DAWContext';
import { FaPlay, FaPause } from 'react-icons/fa';

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-secondary);
  position: relative;
`;

const TimelineHeader = styled.div`
  height: 60px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 1rem;
  position: relative;
`;

const TimeRuler = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary);
`;

const TimeMarkers = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
`;

const TimeMarker = styled.div`
  position: absolute;
  left: ${props => props.position}px;
  width: 1px;
  height: 100%;
  background: var(--border-color);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const Playhead = styled.div`
  position: absolute;
  left: ${props => props.position}px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--error-color);
  z-index: 10;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -4px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 8px solid var(--error-color);
  }
`;

const TimelineContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const TrackHeaders = styled.div`
  width: 200px;
  background: var(--bg-tertiary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
`;

const TrackHeader = styled.div`
  height: 80px;
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${props => props.selected ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.selected ? 'white' : 'var(--text-primary)'};
`;

const TrackName = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const TrackControls = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ControlButton = styled.button`
  background: transparent;
  color: inherit;
  border: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TrackLanes = styled.div`
  flex: 1;
  position: relative;
  overflow: auto;
  background: var(--bg-secondary);
`;

const TrackLane = styled.div`
  height: 80px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  background: ${props => props.selected ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
`;

const Grid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const GridLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: ${props => props.major ? 'var(--border-color)' : 'rgba(55, 65, 81, 0.3)'};
`;

const Clip = styled.div`
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: ${props => props.start}px;
  width: ${props => props.duration}px;
  background: ${props => props.color || 'var(--primary-color)'};
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: white;
  font-weight: 500;
  box-shadow: var(--shadow-sm);

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const ZoomControls = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 5;
`;

const ZoomButton = styled.button`
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;

  &:hover {
    background: var(--bg-tertiary);
  }
`;

function Timeline() {
  const { state, actions } = useDAW();
  const [zoom, setZoom] = useState(1);
  const [scrollX, setScrollX] = useState(0);
  const timelineRef = useRef(null);

  const pixelsPerSecond = 50 * zoom;
  const pixelsPerBeat = (pixelsPerSecond * 60) / state.bpm;

  // Generate time markers
  const timeMarkers = [];
  const totalSeconds = state.duration;
  const markerInterval = zoom < 0.5 ? 10 : zoom < 1 ? 5 : 1; // Adjust marker frequency based on zoom

  for (let i = 0; i <= totalSeconds; i += markerInterval) {
    timeMarkers.push({
      time: i,
      position: i * pixelsPerSecond - scrollX
    });
  }

  // Generate grid lines
  const gridLines = [];
  const beatsPerBar = 4;
  const totalBeats = (totalSeconds * state.bpm) / 60;
  
  for (let beat = 0; beat <= totalBeats; beat++) {
    const isMajor = beat % beatsPerBar === 0;
    const position = (beat * pixelsPerBeat) - scrollX;
    gridLines.push({ position, major: isMajor });
  }

  // Calculate playhead position
  const playheadPosition = (state.currentTime * pixelsPerSecond) - scrollX;

  // Sample clips for demonstration
  const sampleClips = [
    { id: 1, trackId: 'track-1', start: 10, duration: 20, name: 'Guitar Solo', color: '#8b5cf6' },
    { id: 2, trackId: 'track-2', start: 5, duration: 15, name: 'Bass Line', color: '#06b6d4' },
    { id: 3, trackId: 'track-3', start: 0, duration: 30, name: 'Drums', color: '#f59e0b' }
  ];

  const handleTimelineClick = (e) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left + scrollX;
      const newTime = clickX / pixelsPerSecond;
      actions.setCurrentTime(Math.max(0, newTime));
    }
  };

  const handleScroll = (e) => {
    setScrollX(e.target.scrollLeft);
  };

  const zoomIn = () => setZoom(prev => Math.min(prev * 1.5, 4));
  const zoomOut = () => setZoom(prev => Math.max(prev / 1.5, 0.1));

  return (
    <TimelineContainer>
      <TimelineHeader>
        <TimeRuler>
          <TimeMarkers>
            {timeMarkers.map((marker) => (
              <TimeMarker key={marker.time} position={marker.position}>
                {Math.floor(marker.time / 60)}:{(marker.time % 60).toString().padStart(2, '0')}
              </TimeMarker>
            ))}
            <Playhead position={playheadPosition} />
          </TimeMarkers>
        </TimeRuler>
        
        <ZoomControls>
          <ZoomButton onClick={zoomOut}>-</ZoomButton>
          <ZoomButton onClick={zoomIn}>+</ZoomButton>
        </ZoomControls>
      </TimelineHeader>

      <TimelineContent>
        <TrackHeaders>
          {state.tracks.map((track) => (
            <TrackHeader key={track.id} selected={state.selectedTrackId === track.id}>
              <TrackName>{track.name}</TrackName>
              <TrackControls>
                <ControlButton>M</ControlButton>
                <ControlButton>S</ControlButton>
                <ControlButton>R</ControlButton>
              </TrackControls>
            </TrackHeader>
          ))}
        </TrackHeaders>

        <TrackLanes
          ref={timelineRef}
          onScroll={handleScroll}
          onClick={handleTimelineClick}
        >
          <Grid>
            {gridLines.map((line, index) => (
              <GridLine key={index} position={line.position} major={line.major} />
            ))}
          </Grid>

          {state.tracks.map((track) => (
            <TrackLane key={track.id} selected={state.selectedTrackId === track.id}>
              {sampleClips
                .filter(clip => clip.trackId === track.id)
                .map(clip => (
                  <Clip
                    key={clip.id}
                    start={clip.start * pixelsPerSecond}
                    duration={clip.duration * pixelsPerSecond}
                    color={clip.color}
                  >
                    {clip.name}
                  </Clip>
                ))}
            </TrackLane>
          ))}

          <Playhead position={playheadPosition} />
        </TrackLanes>
      </TimelineContent>
    </TimelineContainer>
  );
}

export default Timeline;
