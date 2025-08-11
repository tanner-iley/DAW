import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as Tone from 'tone';

const DAWContext = createContext();

// Initial state
const initialState = {
  // Audio engine
  audioContext: null,
  isInitialized: false,
  
  // Transport
  isPlaying: false,
  isRecording: false,
  currentTime: 0,
  duration: 120, // 2 minutes default
  bpm: 120,
  
  // Tracks
  tracks: [],
  selectedTrackId: null,
  
  // Effects
  effects: {
    reverb: { enabled: false, wet: 0.3, decay: 2, preDelay: 0.1 },
    delay: { enabled: false, wet: 0.3, delayTime: 0.5, feedback: 0.3 },
    distortion: { enabled: false, wet: 0.3, distortion: 0.8 },
    filter: { enabled: false, wet: 0.3, frequency: 1000, type: 'lowpass' },
    compressor: { enabled: false, wet: 0.3, threshold: -24, ratio: 12 }
  },
  
  // Metronome
  metronome: {
    enabled: false,
    volume: 0.5,
    subdivision: 4 // 4/4 time
  },
  
  // Recording
  recording: {
    isActive: false,
    duration: 0,
    audioBlob: null
  },
  
  // UI state
  ui: {
    zoom: 1,
    snapToGrid: true,
    gridSize: 16, // 16th notes
    showWaveforms: true,
    showFades: true
  }
};

// Action types
const ACTIONS = {
  INIT_AUDIO: 'INIT_AUDIO',
  SET_PLAYING: 'SET_PLAYING',
  SET_RECORDING: 'SET_RECORDING',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_BPM: 'SET_BPM',
  ADD_TRACK: 'ADD_TRACK',
  REMOVE_TRACK: 'REMOVE_TRACK',
  UPDATE_TRACK: 'UPDATE_TRACK',
  SELECT_TRACK: 'SELECT_TRACK',
  UPDATE_EFFECT: 'UPDATE_EFFECT',
  TOGGLE_EFFECT: 'TOGGLE_EFFECT',
  SET_METRONOME: 'SET_METRONOME',
  SET_RECORDING_STATE: 'SET_RECORDING_STATE',
  UPDATE_UI: 'UPDATE_UI',
  RESET_PROJECT: 'RESET_PROJECT'
};

// Reducer
function dawReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT_AUDIO:
      return {
        ...state,
        audioContext: action.payload,
        isInitialized: true
      };
      
    case ACTIONS.SET_PLAYING:
      return {
        ...state,
        isPlaying: action.payload
      };
      
    case ACTIONS.SET_RECORDING:
      return {
        ...state,
        isRecording: action.payload
      };
      
    case ACTIONS.SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload
      };
      
    case ACTIONS.SET_BPM:
      return {
        ...state,
        bpm: action.payload
      };
      
    case ACTIONS.ADD_TRACK:
      return {
        ...state,
        tracks: [...state.tracks, action.payload]
      };
      
    case ACTIONS.REMOVE_TRACK:
      return {
        ...state,
        tracks: state.tracks.filter(track => track.id !== action.payload),
        selectedTrackId: state.selectedTrackId === action.payload ? null : state.selectedTrackId
      };
      
    case ACTIONS.UPDATE_TRACK:
      return {
        ...state,
        tracks: state.tracks.map(track =>
          track.id === action.payload.id ? { ...track, ...action.payload.updates } : track
        )
      };
      
    case ACTIONS.SELECT_TRACK:
      return {
        ...state,
        selectedTrackId: action.payload
      };
      
    case ACTIONS.UPDATE_EFFECT:
      return {
        ...state,
        effects: {
          ...state.effects,
          [action.payload.effect]: {
            ...state.effects[action.payload.effect],
            ...action.payload.settings
          }
        }
      };
      
    case ACTIONS.TOGGLE_EFFECT:
      return {
        ...state,
        effects: {
          ...state.effects,
          [action.payload]: {
            ...state.effects[action.payload],
            enabled: !state.effects[action.payload].enabled
          }
        }
      };
      
    case ACTIONS.SET_METRONOME:
      return {
        ...state,
        metronome: {
          ...state.metronome,
          ...action.payload
        }
      };
      
    case ACTIONS.SET_RECORDING_STATE:
      return {
        ...state,
        recording: {
          ...state.recording,
          ...action.payload
        }
      };
      
    case ACTIONS.UPDATE_UI:
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload
        }
      };
      
    case ACTIONS.RESET_PROJECT:
      return {
        ...initialState,
        audioContext: state.audioContext,
        isInitialized: state.isInitialized
      };
      
    default:
      return state;
  }
}

// Provider component
export function DAWProvider({ children }) {
  const [state, dispatch] = useReducer(dawReducer, initialState);

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Tone.start();
        Tone.Transport.bpm.value = state.bpm;
        dispatch({ type: ACTIONS.INIT_AUDIO, payload: Tone.context });
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    if (!state.isInitialized) {
      initAudio();
    }
  }, [state.isInitialized, state.bpm]);

  // Update BPM when it changes
  useEffect(() => {
    if (state.isInitialized) {
      Tone.Transport.bpm.value = state.bpm;
    }
  }, [state.bpm, state.isInitialized]);

  // Update current time
  useEffect(() => {
    if (!state.isInitialized) return;

    const interval = setInterval(() => {
      if (state.isPlaying) {
        dispatch({ type: ACTIONS.SET_CURRENT_TIME, payload: Tone.Transport.seconds });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.isInitialized]);

  // Context value
  const value = {
    state,
    dispatch,
    actions: {
      initAudio: () => dispatch({ type: ACTIONS.INIT_AUDIO }),
      setPlaying: (playing) => dispatch({ type: ACTIONS.SET_PLAYING, payload: playing }),
      setRecording: (recording) => dispatch({ type: ACTIONS.SET_RECORDING, payload: recording }),
      setCurrentTime: (time) => dispatch({ type: ACTIONS.SET_CURRENT_TIME, payload: time }),
      setBPM: (bpm) => dispatch({ type: ACTIONS.SET_BPM, payload: bpm }),
      addTrack: (track) => dispatch({ type: ACTIONS.ADD_TRACK, payload: track }),
      removeTrack: (trackId) => dispatch({ type: ACTIONS.REMOVE_TRACK, payload: trackId }),
      updateTrack: (trackId, updates) => dispatch({ 
        type: ACTIONS.UPDATE_TRACK, 
        payload: { id: trackId, updates } 
      }),
      selectTrack: (trackId) => dispatch({ type: ACTIONS.SELECT_TRACK, payload: trackId }),
      updateEffect: (effect, settings) => dispatch({ 
        type: ACTIONS.UPDATE_EFFECT, 
        payload: { effect, settings } 
      }),
      toggleEffect: (effect) => dispatch({ type: ACTIONS.TOGGLE_EFFECT, payload: effect }),
      setMetronome: (settings) => dispatch({ type: ACTIONS.SET_METRONOME, payload: settings }),
      setRecordingState: (settings) => dispatch({ 
        type: ACTIONS.SET_RECORDING_STATE, 
        payload: settings 
      }),
      updateUI: (settings) => dispatch({ type: ACTIONS.UPDATE_UI, payload: settings }),
      resetProject: () => dispatch({ type: ACTIONS.RESET_PROJECT })
    }
  };

  return (
    <DAWContext.Provider value={value}>
      {children}
    </DAWContext.Provider>
  );
}

// Custom hook to use the DAW context
export function useDAW() {
  const context = useContext(DAWContext);
  if (!context) {
    throw new Error('useDAW must be used within a DAWProvider');
  }
  return context;
}
