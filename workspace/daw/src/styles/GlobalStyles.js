import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #6366f1;
    --primary-hover: #4f46e5;
    --secondary-color: #8b5cf6;
    --accent-color: #06b6d4;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
    
    --bg-primary: #0f0f23;
    --bg-secondary: #1a1a2e;
    --bg-tertiary: #16213e;
    --bg-elevated: #242424;
    
    --text-primary: #ffffff;
    --text-secondary: #a1a1aa;
    --text-muted: #71717a;
    
    --border-color: #374151;
    --border-hover: #4b5563;
    
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    overflow: hidden;
  }

  #root {
    height: 100vh;
    width: 100vw;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--border-hover);
  }

  /* Button resets */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Input resets */
  input, textarea, select {
    border: none;
    outline: none;
    font-family: inherit;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  /* Selection */
  ::selection {
    background: var(--primary-color);
    color: white;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .w-full {
    width: 100%;
  }

  .h-full {
    height: 100%;
  }

  .text-center {
    text-align: center;
  }

  .text-sm {
    font-size: 0.875rem;
  }

  .text-lg {
    font-size: 1.125rem;
  }

  .font-bold {
    font-weight: 700;
  }

  .rounded {
    border-radius: 0.375rem;
  }

  .rounded-lg {
    border-radius: 0.5rem;
  }

  .shadow {
    box-shadow: var(--shadow-md);
  }

  .transition {
    transition: all 0.2s ease-in-out;
  }
`;
