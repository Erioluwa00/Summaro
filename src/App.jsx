import React, { useState, useEffect } from 'react';
import './styles/style.css';
import Header from './components/Common/Header';
import InputView from './components/Views/InputView';
import ProcessingView from './components/Views/ProcessingView';
import ResultsView from './components/Views/ResultsView';
import { uploadAudio, checkHealth } from './services/api';

export default function App() {
  const [viewState, setViewState] = useState('input');
  const [processingStep, setProcessingStep] = useState(0);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [theme, setTheme] = useState('light');
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const health = await checkHealth();
        setBackendStatus(health.status === 'healthy' ? 'connected' : 'disconnected');
      } catch {
        setBackendStatus('disconnected');
      }
    };
    
    checkBackend();
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Processing simulation
  useEffect(() => {
    if (viewState === 'processing') {
      const steps = [
        { message: "Uploading audio...", duration: 1000 },
        { message: "Transcribing with AI...", duration: 3000 },
        { message: "Generating summary...", duration: 2000 },
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          setProcessingStep(currentStep);
        } else {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    } else {
      setProcessingStep(0);
    }
  }, [viewState]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleFileUpload = async (audioFile) => {
    try {
      setError(null);
      setApiResult(null);
      setViewState('processing');
      
      console.log('📤 Uploading file:', audioFile.name);
      
      const result = await uploadAudio(audioFile);
      
      console.log('✅ Backend response:', result);
      
      // Check if backend returned success
      if (result.success === false) {
        throw new Error(result.error || 'Backend processing failed');
      }
      
      // Check if we have summary and transcript
      if (!result.summary || result.summary === 'No summary generated') {
        console.warn(' Summary missing from backend response');
      }
      
      if (!result.transcript || result.transcript === 'No transcript available') {
        console.warn('Transcript missing from backend response');
      }
      
      setApiResult(result);
      setViewState('results');
      
    } catch (err) {
      console.error(' Upload error:', err);
      setError(`Error: ${err.message}`);
      setViewState('input');
    }
  };

  const handleStartRecording = () => {
    setError(' coming soon! For now, please upload an audio file.');
  };

  const handleCopy = () => {
    if (!apiResult) return;
    
    const textToCopy = `SUMMARY:\n${apiResult.summary}\n\nTRANSCRIPT:\n${apiResult.transcript}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => triggerToast())
      .catch(err => console.error('Copy failed:', err));
  };

  const triggerToast = () => {
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };

  const toggleTranscript = () => {
    setIsTranscriptExpanded(!isTranscriptExpanded);
  };

  const handleNewNote = () => {
    setApiResult(null);
    setViewState('input');
    setError(null);
  };

  return (
    <div className="main-content">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      {/* Connection Status */}
      {backendStatus === 'disconnected' && (
        <div className="connection-banner error">
          ⚠️ Backend not connected. Run: <code>node index.js</code> in backend folder
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
      
      {backendStatus === 'connected' && (
        <div>
          
        </div>
      )}
      
      {error && (
        <div className="error-banner">
          ❌ {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      <main className="container" style={{ flex: 1, position: 'relative' }}>
        {viewState === 'input' && (
          <InputView 
            onStart={handleStartRecording}
            onFileUpload={handleFileUpload}
          />
        )}
        
        {viewState === 'processing' && (
          <ProcessingView processingStep={processingStep} />
        )}
        
        {viewState === 'results' && apiResult && (
          <ResultsView 
            onNewNote={handleNewNote}
            isTranscriptExpanded={isTranscriptExpanded}
            toggleTranscript={toggleTranscript}
            showCopiedToast={showCopiedToast}
            onCopy={handleCopy}
            apiResult={apiResult}
          />
        )}
      </main>
    </div>
  );
}