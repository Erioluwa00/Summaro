import React, { useState, useEffect } from 'react';
import './styles/style.css';
import Header from './components/common/Header';
import InputView from './components/views/InputView';
import ProcessingView from './components/views/ProcessingView';
import ResultsView from './components/views/ResultsView';

export default function App() {
  const [viewState, setViewState] = useState('input'); // input | processing | results
  const [processingStep, setProcessingStep] = useState(0);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Set theme on body attribute
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Simulation logic for processing state
  useEffect(() => {
    if (viewState === 'processing') {
      const steps = [
        { message: "Listening...", duration: 1500 },
        { message: "Understanding...", duration: 1500 },
        { message: "Summarizing...", duration: 1500 },
      ];

      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          setProcessingStep(currentStep);
        } else {
          clearInterval(interval);
          setViewState('results');
        }
      }, 1500);

      return () => clearInterval(interval);
    } else {
      setProcessingStep(0);
    }
  }, [viewState]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleStart = () => {
    setViewState('processing');
  };

  const handleCopy = () => {
    // This function needs to be updated with actual MOCK_RESULT import
    // or passed as prop from a parent component
    const textToCopy = `SUMMARY:\nPlaceholder\n\nACTION ITEMS:\n- Item 1\n- Item 2`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => triggerToast());
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        triggerToast();
      } catch (err) {
        console.error('Unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const triggerToast = () => {
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };

  const toggleTranscript = () => {
    setIsTranscriptExpanded(!isTranscriptExpanded);
  };

  const handleNewNote = () => {
    setViewState('input');
  };

  return (
    <div className="main-content">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="container" style={{ flex: 1, position: 'relative' }}>
        {viewState === 'input' && <InputView onStart={handleStart} />}
        {viewState === 'processing' && <ProcessingView processingStep={processingStep} />}
        {viewState === 'results' && (
          <ResultsView 
            onNewNote={handleNewNote}
            isTranscriptExpanded={isTranscriptExpanded}
            toggleTranscript={toggleTranscript}
            showCopiedToast={showCopiedToast}
            onCopy={handleCopy}
          />
        )}
      </main>
    </div>
  );
}