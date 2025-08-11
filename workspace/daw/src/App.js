import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DAWProvider } from './context/DAWContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import Transport from './components/Transport';
import Mixer from './components/Mixer';
import EffectsPanel from './components/EffectsPanel';
import Metronome from './components/Metronome';
import RecordingPanel from './components/RecordingPanel';

const AppContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 250px 1fr 300px;
  height: 100vh;
  background: var(--bg-primary);
`;

const MainContent = styled.main`
  grid-row: 2;
  grid-column: 2;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
`;

const TimelineContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const BottomPanel = styled.div`
  grid-row: 3;
  grid-column: 1 / -1;
  height: 200px;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
  display: flex;
`;

function App() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(window.electronAPI !== undefined);
    
    // Set up Electron event listeners if available
    if (window.electronAPI) {
      window.electronAPI.onNewProject(() => {
        // Handle new project
        console.log('New project requested');
      });
      
      window.electronAPI.onOpenProject((event, filePath) => {
        // Handle open project
        console.log('Open project:', filePath);
      });
      
      window.electronAPI.onSaveProject(() => {
        // Handle save project
        console.log('Save project requested');
      });
      
      window.electronAPI.onExportAudio(() => {
        // Handle export audio
        console.log('Export audio requested');
      });
    }
  }, []);

  return (
    <DAWProvider>
      <AppContainer>
        <Header isElectron={isElectron} />
        
        <Sidebar />
        
        <MainContent>
          <TimelineContainer>
            <Timeline />
          </TimelineContainer>
        </MainContent>
        
        <EffectsPanel />
        
        <BottomPanel>
          <Transport />
          <Mixer />
          <Metronome />
          <RecordingPanel />
        </BottomPanel>
      </AppContainer>
    </DAWProvider>
  );
}

export default App;
