# DAW Studio - Digital Audio Workstation

A professional-grade Digital Audio Workstation built with React, Electron, and Web Audio API. Create, record, mix, and produce music with a modern, intuitive interface.

## 🎵 Features

### Core Features
- **Multi-track Recording**: Record audio with multiple tracks simultaneously
- **Professional Mixer**: Full-featured mixing console with volume faders, pan controls, and peak meters
- **Advanced Effects**: Built-in effects including Reverb, Delay, Distortion, Filter, and Compressor
- **Metronome**: Precise timing with customizable BPM and time signatures
- **Timeline Editor**: Visual timeline with grid snapping and zoom controls
- **Project Management**: Save, load, and export your projects

### Audio Features
- **Real-time Audio Processing**: Low-latency audio engine powered by Tone.js
- **Input Monitoring**: Monitor your microphone input while recording
- **Audio Device Selection**: Choose from available audio input devices
- **High-Quality Effects**: Professional-grade audio effects with real-time parameter control
- **Export Capabilities**: Export your projects as high-quality audio files

### User Interface
- **Dark Theme**: Professional dark interface designed for extended use
- **Responsive Layout**: Adaptable interface that works on different screen sizes
- **Keyboard Shortcuts**: Power user shortcuts for efficient workflow
- **Drag & Drop**: Intuitive file import and track management

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd daw
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run in Electron (desktop mode)**
   ```bash
   npm run electron-dev
   ```

### Building for Production

1. **Build the web version**
   ```bash
   npm run build
   ```

2. **Build desktop application**
   ```bash
   npm run dist
   ```

The built application will be available in the `dist` folder.

## 📖 Usage Guide

### Getting Started

1. **Launch the Application**
   - Open the application in your browser or as a desktop app
   - Grant microphone permissions when prompted

2. **Create a New Project**
   - Click "New Project" or use Ctrl+N
   - Set your desired BPM and time signature

3. **Add Tracks**
   - Use the sidebar to add different types of tracks
   - Choose from Audio, MIDI, Drum, or Bass tracks

4. **Start Recording**
   - Select your input device in the Recording panel
   - Click the record button to start recording
   - Use the metronome for precise timing

### Recording Audio

1. **Setup Recording**
   - Select your microphone in the Recording panel
   - Enable input monitoring if desired
   - Set your recording level

2. **Record**
   - Click the red record button to start
   - The button will pulse while recording
   - Click stop when finished

3. **Playback**
   - Use the transport controls to play/pause/stop
   - Scrub through the timeline to find specific sections

### Using Effects

1. **Apply Effects**
   - Select a track in the timeline
   - Go to the Effects panel
   - Toggle effects on/off using the switches

2. **Adjust Parameters**
   - Use the sliders to adjust effect parameters
   - Real-time preview of changes
   - Save your favorite settings

### Mixing

1. **Volume Control**
   - Use the mixer faders to adjust track volumes
   - Monitor peak levels to avoid clipping

2. **Panning**
   - Use the pan controls to position sounds in the stereo field
   - Create spatial depth in your mix

3. **Mute/Solo**
   - Use M and S buttons to mute or solo tracks
   - Focus on specific elements during mixing

## 🛠️ Technical Details

### Architecture
- **Frontend**: React 18 with Hooks and Context API
- **Styling**: Styled Components for CSS-in-JS
- **Audio Engine**: Tone.js for Web Audio API
- **Desktop**: Electron for cross-platform desktop app
- **Build Tool**: Create React App with custom Electron configuration

### Key Technologies
- **React**: Modern React with functional components and hooks
- **Tone.js**: Advanced Web Audio framework
- **Electron**: Cross-platform desktop application framework
- **Styled Components**: CSS-in-JS styling solution
- **Web Audio API**: Native browser audio capabilities

### Project Structure
```
daw/
├── public/                 # Static assets and Electron files
├── src/
│   ├── components/         # React components
│   ├── context/           # React context providers
│   ├── styles/            # Global styles and themes
│   └── utils/             # Utility functions
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🎛️ Controls Reference

### Transport Controls
- **Play/Pause**: Spacebar or click play button
- **Stop**: Click stop button
- **Record**: Click record button
- **Step Forward/Backward**: Use arrow buttons

### Timeline Controls
- **Zoom**: Use +/- buttons or mouse wheel
- **Scrub**: Click and drag on timeline
- **Snap to Grid**: Automatic grid snapping

### Keyboard Shortcuts
- `Spacebar`: Play/Pause
- `Ctrl+N`: New Project
- `Ctrl+S`: Save Project
- `Ctrl+O`: Open Project
- `Ctrl+E`: Export Audio
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo

## 🔧 Configuration

### Audio Settings
- **Sample Rate**: 44.1kHz (configurable)
- **Buffer Size**: 256 samples (adjustable for latency)
- **Input Channels**: Stereo
- **Output Channels**: Stereo

### Performance Settings
- **Real-time Processing**: Enabled by default
- **Effect Quality**: High quality with real-time preview
- **Memory Management**: Automatic cleanup of unused audio

## 🐛 Troubleshooting

### Common Issues

1. **No Audio Input**
   - Check microphone permissions
   - Verify audio device selection
   - Ensure microphone is not muted

2. **High Latency**
   - Reduce buffer size in audio settings
   - Close other audio applications
   - Use ASIO drivers (Windows)

3. **Crashes on Startup**
   - Update Node.js to latest version
   - Clear npm cache: `npm cache clean --force`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Performance Tips
- Close unnecessary browser tabs
- Use headphones to reduce feedback
- Disable unnecessary effects when recording
- Keep project files on SSD for faster loading

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Tone.js** for the excellent Web Audio framework
- **React** team for the amazing UI library
- **Electron** team for desktop app capabilities
- **Styled Components** for CSS-in-JS solution

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**DAW Studio** - Professional audio production made simple and accessible.
