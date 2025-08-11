import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDAW } from '../context/DAWContext';
import { FaMicrophone, FaStop, FaPlay, FaDownload, FaTrash } from 'react-icons/fa';

const RecordingPanelContainer = styled.div`
  width: 300px;
  background: var(--bg-tertiary);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RecordingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const RecordingTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
`;

const RecordingIcon = styled.div`
  font-size: 1.5rem;
  color: var(--error-color);
`;

const RecordingControls = styled.div`
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

const RecordButton = styled.button`
  background: ${props => props.recording ? 'var(--error-color)' : 'var(--bg-elevated)'};
  color: white;
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${props => props.recording ? 'var(--error-color)' : 'var(--bg-secondary)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.recording {
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;

const InputMeter = styled.div`
  width: 100%;
  height: 60px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  position: relative;
  overflow: hidden;
`;

const InputLevel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${props => props.level}%;
  background: ${props => props.level > 80 ? 'var(--error-color)' : props.level > 60 ? 'var(--warning-color)' : 'var(--success-color)'};
  transition: height 0.1s ease;
`;

const RecordingInfo = styled.div`
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  padding: 0.75rem;
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

const RecordingActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background: var(--bg-secondary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.play {
    background: var(--primary-color);
    color: white;

    &:hover {
      background: var(--primary-hover);
    }
  }

  &.delete {
    background: var(--error-color);
    color: white;

    &:hover {
      background: #dc2626;
    }
  }
`;

const DeviceSelect = styled.select`
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
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

function RecordingPanel() {
  const { state, actions } = useDAW();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [inputLevel, setInputLevel] = useState(0);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [monitorInput, setMonitorInput] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const inputMeterIntervalRef = useRef(null);

  useEffect(() => {
    // Get available audio devices
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const audioInputs = devices.filter(device => device.kind === 'audioinput');
          setAudioDevices(audioInputs);
          if (audioInputs.length > 0) {
            setSelectedDevice(audioInputs[0].deviceId);
          }
        })
        .catch(err => console.error('Error getting audio devices:', err));
    }
  }, []);

  useEffect(() => {
    // Update recording duration
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    // Simulate input level meter
    if (isRecording || monitorInput) {
      inputMeterIntervalRef.current = setInterval(() => {
        setInputLevel(Math.random() * 100);
      }, 100);
    } else {
      setInputLevel(0);
    }

    return () => {
      if (inputMeterIntervalRef.current) {
        clearInterval(inputMeterIntervalRef.current);
      }
    };
  }, [isRecording, monitorInput]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio({ blob: audioBlob, url: audioUrl });
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = audioChunks;
      setIsRecording(true);
      setRecordingDuration(0);
      actions.setRecordingState({ isActive: true, duration: 0 });

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      actions.setRecordingState({ isActive: false, duration: recordingDuration });
    }
  };

  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio.url);
      audio.play();
    }
  };

  const deleteRecording = () => {
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio.url);
      setRecordedAudio(null);
    }
  };

  const downloadRecording = () => {
    if (recordedAudio) {
      const link = document.createElement('a');
      link.href = recordedAudio.url;
      link.download = `recording-${Date.now()}.wav`;
      link.click();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <RecordingPanelContainer>
      <RecordingHeader>
        <RecordingTitle>Recording</RecordingTitle>
        <RecordingIcon>🎤</RecordingIcon>
      </RecordingHeader>

      <RecordingControls>
        <ControlGroup>
          <ControlLabel>Input Device</ControlLabel>
          <DeviceSelect
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            disabled={isRecording}
          >
            {audioDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </DeviceSelect>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Input Monitor</ControlLabel>
          <ControlRow>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Monitor input while recording
            </span>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={monitorInput}
                onChange={(e) => setMonitorInput(e.target.checked)}
                disabled={isRecording}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </ControlRow>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Input Level</ControlLabel>
          <InputMeter>
            <InputLevel level={inputLevel} />
          </InputMeter>
        </ControlGroup>

        <RecordButton
          recording={isRecording}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!state.isInitialized}
          className={isRecording ? 'recording' : ''}
        >
          {isRecording ? <FaStop /> : <FaMicrophone />}
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </RecordButton>

        {recordedAudio && (
          <RecordingInfo>
            <InfoRow>
              <InfoLabel>Duration:</InfoLabel>
              <InfoValue>{formatTime(recordingDuration)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Size:</InfoLabel>
              <InfoValue>{(recordedAudio.blob.size / 1024 / 1024).toFixed(2)} MB</InfoValue>
            </InfoRow>
            
            <RecordingActions>
              <ActionButton
                className="play"
                onClick={playRecording}
              >
                <FaPlay />
                Play
              </ActionButton>
              <ActionButton
                onClick={downloadRecording}
              >
                <FaDownload />
                Save
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={deleteRecording}
              >
                <FaTrash />
                Delete
              </ActionButton>
            </RecordingActions>
          </RecordingInfo>
        )}
      </RecordingControls>
    </RecordingPanelContainer>
  );
}

export default RecordingPanel;
