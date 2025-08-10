# Mini DAW

A minimal web-based DAW built with React, TypeScript, Vite, Tone.js and Zustand. It supports multi-track audio clips, drag-to-move, per-track volume/pan, recording from microphone, tempo and metronome, and per-track effect packs.

## Quickstart

Prerequisites:
- Node.js 18+ and npm

Install and run the dev server:

```bash
cd /workspace/workspace/daw
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

## Usage

- Transport
  - Play/Pause/Stop
  - Tempo (BPM) and Beats per bar; enable Click for a metronome with accented downbeat and adjustable volume
  - Zoom controls (pixels per second)
- Tracks
  - + Track to add a new track
  - Rec to start/stop recording from microphone on that track
  - Vol/Pan per track
  - FX dropdown to apply an effect pack to the whole track
  - + Clip to import an audio file; drag clips horizontally to change their start time

Notes:
- Audio starts only after a user gesture; clicking Play will initialize the AudioContext (Tone.start()).
- Microphone recording requires browser permission. If blocked, allow mic access in the browser and try again.
- Supported recording formats depend on the browser. The app prefers `audio/webm;codecs=opus` when available.
- Dragging clips moves them in time; overlapping is allowed.

## Tech
- React + TypeScript (Vite)
- Tone.js for transport, scheduling, and audio graph
- Zustand for state

## Folder structure
- `src/store/useDawStore.ts`: Global state, audio engine wiring, transport, recording, tempo/metronome, effects
- `src/components/Transport.tsx`: Transport bar UI
- `src/components/Timeline.tsx`: Ruler + track lanes
- `src/components/Track.tsx`: Track header and clip lane
- `src/audio/effects.ts`: Effect pack definitions and node creation
