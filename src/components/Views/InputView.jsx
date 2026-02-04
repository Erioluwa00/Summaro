import React, { useRef, useState, useEffect } from 'react';
import { Mic, Upload, Pause, Play, Trash2, Check, X } from 'lucide-react';
import FloatingIconsBackground from '../FloatingIconsBackground';
import Button from '../Button';
import recorder from '../../services/recorder';

const InputView = ({ onStart, onFileUpload }) => {
  const fileInputRef = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showRecordingControls, setShowRecordingControls] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Check browser support on mount
  useEffect(() => {
    if (!recorder.isSupported()) {
      console.warn('Recording not supported in this browser');
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Start recording
  const handleStartRecording = async () => {
    try {
      setPermissionDenied(false);
      console.log(' Starting recording...');
      
      await recorder.startRecording((time) => {
        setRecordingTime(time);
      });
      
      setIsRecording(true);
      setShowRecordingControls(true);
      
    } catch (error) {
      console.error('Recording error:', error);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        alert('Microphone access denied. Please allow microphone access in your browser settings.');
      } else {
        alert(`Recording failed: ${error.message}`);
      }
    }
  };

  // Pause/Resume recording
 const handlePauseResume = () => {
  if (isPaused) {
    recorder.resumeRecording();
    setIsPaused(false);
  } else {
    recorder.pauseRecording();
    setIsPaused(true);
  }
};

  // Stop and save recording
  const handleSaveRecording = async () => {
    try {
      console.log('Saving recording...');
      
      const audioFile = await recorder.stopRecording();
      
      // Reset UI state
      setIsRecording(false);
      setIsPaused(false);
      setShowRecordingControls(false);
      setRecordingTime(0);
      
      // Send to parent for processing
      onFileUpload(audioFile);
      
    } catch (error) {
      console.error('Failed to save recording:', error);
      alert('Failed to save recording. Please try again.');
    }
  };

  // Cancel recording
  const handleCancelRecording = () => {
    recorder.cancelRecording();
    
    // Reset UI state
    setIsRecording(false);
    setIsPaused(false);
    setShowRecordingControls(false);
    setRecordingTime(0);
  };

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="input-view fade-in">
      <FloatingIconsBackground />
      
      <div className="hero-text text-center">
        <h1>Turn your voice notes into clear,<br/> easy-to-read summaries instantly.</h1>
        <p>
          Record a meeting, lecture, or brain dump. <br />
          We'll extract the clarity.
        </p>
      </div>

      {/* Recording Controls */}
      {showRecordingControls ? (
        <div className="recording-controls">
          <div className="recording-status">
            <div className={`recording-indicator ${isRecording && !isPaused ? 'pulsing' : ''}`}>
              <div className="recording-dot"></div>
              <span>{isPaused ? 'PAUSED' : 'RECORDING'}</span>
            </div>
            <div className="recording-timer">
              {formatTime(recordingTime)}
            </div>
          </div>
          
          <div className="recording-actions">
            <Button 
              variant="icon" 
              onClick={handlePauseResume}
              className={`control-btn ${isPaused ? 'resume' : 'pause'}`}
              title={isPaused ? 'Resume Recording' : 'Pause Recording'}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </Button>
            
            <Button 
              variant="icon" 
              onClick={handleSaveRecording}
              className="control-btn save"
              title="Save and Process"
            >
              <Check size={20} />
            </Button>
            
            <Button 
              variant="icon" 
              onClick={handleCancelRecording}
              className="control-btn cancel"
              title="Cancel Recording"
            >
              <Trash2 size={20} />
            </Button>
          </div>
          
          {/* <div className="recording-hint">
            {isPaused ? 'Recording paused. Click Play to resume.' : 'Click Pause to pause, Check to save, or Trash to cancel.'}
          </div> */}
        </div>
      ) : (
        /* Default Mic Button */
        <div className="mic-wrapper">
          <div className="mic-glow"></div>
          <button 
            onClick={handleStartRecording}
            className="mic-button"
            aria-label="Start Recording"
            disabled={permissionDenied}
          >
            <Mic size={48} strokeWidth={1.5} />
          </button>
          {permissionDenied && (
            <div className="permission-warning">
               Microphone access is denied. Please allow it in browser settings.
            </div>
          )}
        </div>
      )}

      {/* Upload Section */}
      <div className="upload-area">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".mp3,.wav,.m4a,.ogg,.flac,.webm"
          style={{ display: 'none' }}
        />
        <Button 
          variant="secondary" 
          onClick={handleUploadClick}
          disabled={isRecording}
        >
          <Upload size={18} />
          Upload Audio File
        </Button>
        <p className="file-hint">
          Supports .mp3, .wav, .m4a, .ogg, .flac, .webm • Max 50MB
        </p>
        <p className="recording-hint">
          Or click the microphone to record directly
        </p>
      </div>
    </div>
  );
};

export default InputView;