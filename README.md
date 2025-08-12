# Web DAW - Digital Audio Workstation

A modern, web-based Digital Audio Workstation built with React, TypeScript, and Web Audio API. Create, record, mix, and master your music directly in the browser.

## Features

### 🎵 Core DAW Features
- **Multi-track Recording**: Record audio directly from your microphone
- **Track Management**: Add, delete, and organize audio tracks
- **Real-time Mixing**: Adjust volume, pan, mute, and solo for each track
- **Professional Transport Controls**: Play, pause, stop, and record functionality

### 🎛️ Mixing & Effects
- **Visual Mixer**: Professional-style mixing board with faders and meters
- **Audio Effects**: Built-in effects including:
  - **Reverb**: Add space and depth to your tracks
  - **Delay**: Create echo and time-based effects
  - **Compressor**: Control dynamics and add punch
  - **EQ**: Shape your sound with parametric equalization
  - **Distortion**: Add warmth and character

### ⏱️ Metronome
- **Adjustable BPM**: Set tempo from 40-200 BPM
- **Visual Feedback**: Real-time metronome with visual indicators
- **Tempo Presets**: Quick access to common tempos
- **Volume Control**: Adjustable click volume

### 🎚️ Professional Interface
- **Dark Theme**: Easy on the eyes for long sessions
- **Responsive Design**: Works on desktop and tablet
- **Real-time Meters**: Visual feedback for audio levels
- **Intuitive Controls**: Professional DAW-style interface

## Getting Started

### Prerequisites
- Node.js 16+ 
- Modern web browser with Web Audio API support
- Microphone for recording (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DAW
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Usage Guide

### Creating Your First Project

1. **Add Tracks**: Click "Add Track" to create new audio tracks
2. **Set Tempo**: Use the metronome panel to set your project BPM
3. **Start Recording**: Click the red record button to begin recording
4. **Play Back**: Use the transport controls to play your recordings

### Recording Audio

1. **Enable Microphone**: Allow microphone access when prompted
2. **Select Track**: Choose which track to record to
3. **Start Recording**: Click the record button (red circle)
4. **Stop Recording**: Click the record button again to stop

### Mixing Your Tracks

1. **Volume Control**: Use the faders in the mixer panel
2. **Pan Control**: Adjust stereo positioning for each track
3. **Mute/Solo**: Use the M and S buttons for track isolation
4. **Effects**: Add effects from the effects panel

### Using Effects

1. **Add Effect**: Click an effect button in the effects panel
2. **Adjust Parameters**: Use the sliders to fine-tune the effect
3. **Enable/Disable**: Toggle effects on/off with the power button
4. **Remove Effect**: Click the trash icon to remove effects

### Metronome

1. **Set BPM**: Use the slider or preset buttons
2. **Start Click**: Click "Start Click" to begin metronome
3. **Adjust Volume**: Control click volume independently
4. **Stop**: Click "Stop Click" to end metronome

## Technical Details

### Built With
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Web Audio API**: Native browser audio processing
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool and dev server
- **Lucide React**: Beautiful icons

### Audio Engine
The DAW uses the Web Audio API for:
- Real-time audio processing
- Multi-track mixing
- Effect processing
- Metronome generation
- Audio recording and playback

### Browser Compatibility
- Chrome 66+
- Firefox 60+
- Safari 14+
- Edge 79+

## Project Structure

```
src/
├── audio/
│   └── AudioEngine.ts      # Web Audio API wrapper
├── components/
│   ├── Transport.tsx       # Playback controls
│   ├── TrackList.tsx       # Track management
│   ├── Mixer.tsx          # Mixing interface
│   ├── Metronome.tsx      # Metronome controls
│   └── EffectsPanel.tsx   # Audio effects
├── types/
│   ├── Track.ts           # Track type definitions
│   └── Project.ts         # Project type definitions
├── App.tsx                # Main application
└── main.tsx              # Entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Planned Features
- [ ] MIDI support
- [ ] Virtual instruments
- [ ] Audio file import/export
- [ ] Project save/load
- [ ] Timeline view with clips
- [ ] Automation
- [ ] More effects (chorus, flanger, etc.)
- [ ] Collaboration features
- [ ] Cloud storage integration

### Known Limitations
- Audio recording requires HTTPS in production
- Limited to browser audio capabilities
- No offline functionality yet
- File size limitations for audio processing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Web Audio API specification
- React and TypeScript communities
- Professional DAW software for inspiration
- Open source audio processing libraries

---

**Note**: This is a web-based DAW and requires a modern browser with Web Audio API support. For professional audio production, consider using dedicated DAW software.
