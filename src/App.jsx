import React, { useState, useEffect } from 'react';
import './styles/style.css';
import Header from './components/common/Header';
import InputView from './components/views/InputView';
import ProcessingView from './components/views/ProcessingView';
import ResultsView from './components/views/ResultsView';
import { uploadAudio, checkBackendHealth } from './services/api';
import { validateAudioFile } from './utils/audioHelpers';

export default function App() {
  const [viewState, setViewState] = useState('input');
  const [processingStep, setProcessingStep] = useState(0);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [theme, setTheme] = useState('light');
  const [apiResult, setApiResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [error, setError] = useState(null);

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isHealthy = await checkBackendHealth();
        setBackendStatus(isHealthy ? 'connected' : 'disconnected');
        
        if (!isHealthy) {
          setError('Backend server is not running. Please start the backend on port 5000.');
        }
      } catch {
        setBackendStatus('disconnected');
        setError('Cannot connect to backend server.');
      }
    };
    
    checkConnection();
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Processing simulation
  useEffect(() => {
    if (viewState === 'processing') {
      const steps = [
        { message: "Uploading audio...", duration: 1000 },
        { message: "Processing audio...", duration: 2000 },
        { message: "Generating summary...", duration: 1000 },
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          setProcessingStep(currentStep);
        } else {
          clearInterval(interval);
          // After processing simulation, show results
          if (apiResult) {
            setViewState('results');
          }
        }
      }, 1500);

      return () => clearInterval(interval);
    } else {
      setProcessingStep(0);
    }
  }, [viewState, apiResult]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleFileUpload = async (audioFile) => {
    try {
      // Validate file
      validateAudioFile(audioFile);
      
      setError(null);
      setViewState('processing');
      
      // Upload to backend
      const result = await uploadAudio(audioFile);
      
      if (result.success) {
        setApiResult(result);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      setError(err.message);
      setViewState('input');
      console.error('Upload error:', err);
    }
  };

  const handleStartRecording = () => {
    // For now, simulate file selection
    // You'll implement actual recording later
    setError('Recording feature coming soon! For now, please upload an audio file.');
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
      
      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {backendStatus === 'disconnected' && (
        <div className="warning-banner">
          ⚠️ Backend not connected. Make sure you're running: 
          <code>node index.js</code> in your backend folder.
        </div>
      )}
      
      <main className="container" style={{ flex: 1, position: 'relative' }}>
        {viewState === 'input' && (
          <InputView 
            onStart={handleStartRecording}
            onFileUpload={handleFileUpload}
          />
        )}
        {viewState === 'processing' && <ProcessingView processingStep={processingStep} />}
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










// import React, { useState, useEffect } from 'react';
// import './styles/style.css';
// import Header from './components/common/Header';
// import InputView from './components/views/InputView';
// import ProcessingView from './components/views/ProcessingView';
// import ResultsView from './components/views/ResultsView';

// export default function App() {
//   const [viewState, setViewState] = useState('input'); // input | processing | results
//   const [processingStep, setProcessingStep] = useState(0);
//   const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
//   const [showCopiedToast, setShowCopiedToast] = useState(false);
//   const [theme, setTheme] = useState('light');

//   useEffect(() => {
//     // Set theme on body attribute
//     document.body.setAttribute('data-theme', theme);
//   }, [theme]);

//   // Simulation logic for processing state
//   useEffect(() => {
//     if (viewState === 'processing') {
//       const steps = [
//         { message: "Listening...", duration: 1500 },
//         { message: "Understanding...", duration: 1500 },
//         { message: "Summarizing...", duration: 1500 },
//       ];

//       let currentStep = 0;
      
//       const interval = setInterval(() => {
//         currentStep++;
//         if (currentStep < steps.length) {
//           setProcessingStep(currentStep);
//         } else {
//           clearInterval(interval);
//           setViewState('results');
//         }
//       }, 1500);

//       return () => clearInterval(interval);
//     } else {
//       setProcessingStep(0);
//     }
//   }, [viewState]);

//   const toggleTheme = () => {
//     setTheme(prev => prev === 'light' ? 'dark' : 'light');
//   };

//   const handleStart = () => {
//     setViewState('processing');
//   };

//   const handleCopy = () => {
//     // This function needs to be updated with actual MOCK_RESULT import
//     // or passed as prop from a parent component
//     const textToCopy = `SUMMARY:\nPlaceholder\n\nACTION ITEMS:\n- Item 1\n- Item 2`;
    
//     if (navigator.clipboard && navigator.clipboard.writeText) {
//       navigator.clipboard.writeText(textToCopy).then(() => triggerToast());
//     } else {
//       const textArea = document.createElement("textarea");
//       textArea.value = textToCopy;
//       document.body.appendChild(textArea);
//       textArea.select();
//       try {
//         document.execCommand('copy');
//         triggerToast();
//       } catch (err) {
//         console.error('Unable to copy', err);
//       }
//       document.body.removeChild(textArea);
//     }
//   };

//   const triggerToast = () => {
//     setShowCopiedToast(true);
//     setTimeout(() => setShowCopiedToast(false), 2000);
//   };

//   const toggleTranscript = () => {
//     setIsTranscriptExpanded(!isTranscriptExpanded);
//   };

//   const handleNewNote = () => {
//     setViewState('input');
//   };

//   return (
//     <div className="main-content">
//       <Header theme={theme} toggleTheme={toggleTheme} />
      
//       <main className="container" style={{ flex: 1, position: 'relative' }}>
//         {viewState === 'input' && <InputView onStart={handleStart} />}
//         {viewState === 'processing' && <ProcessingView processingStep={processingStep} />}
//         {viewState === 'results' && (
//           <ResultsView 
//             onNewNote={handleNewNote}
//             isTranscriptExpanded={isTranscriptExpanded}
//             toggleTranscript={toggleTranscript}
//             showCopiedToast={showCopiedToast}
//             onCopy={handleCopy}
//           />
//         )}
//       </main>
//     </div>
//   );
// }