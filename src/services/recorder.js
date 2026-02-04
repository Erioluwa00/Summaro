// src/services/recorder.js
import RecordRTC from 'recordrtc';

class AudioRecorder {
  constructor() {
    this.stream = null;
    this.recorder = null;
    this.isRecording = false;
    this.startTime = null;
    this.timerInterval = null;
    this.elapsedTime = 0; // Track elapsed time separately
    this.isPaused = false; // Track paused state
  }

  // Check if browser supports recording
  isSupported() {
    return navigator.mediaDevices && 
           navigator.mediaDevices.getUserMedia &&
           (navigator.mediaDevices.getDisplayMedia || 
            window.MediaRecorder);
  }

  // Request microphone permission
  async startRecording(onTimeUpdate) {
    try {
      console.log('🎤 Requesting microphone access...');
      
      // Get microphone stream
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      console.log('✅ Microphone access granted');

      // Create recorder
      this.recorder = RecordRTC(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      });

      // Start recording
      this.recorder.startRecording();
      this.isRecording = true;
      this.isPaused = false;
      this.startTime = Date.now();
      this.elapsedTime = 0;
      
      // Start timer
      this.startTimer(onTimeUpdate);

      console.log('🎙️ Recording started');
      return true;

    } catch (error) {
      console.error('❌ Recording failed:', error);
      throw new Error(`Recording failed: ${error.message}`);
    }
  }

  // Start timer
  startTimer(onTimeUpdate) {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        if (onTimeUpdate) {
          onTimeUpdate(this.elapsedTime);
        }
      }
    }, 1000);
  }

  // Pause recording
  pauseRecording() {
    if (this.recorder && this.isRecording && !this.isPaused) {
      this.recorder.pauseRecording();
      this.isPaused = true;
      console.log('⏸️ Recording paused');
    }
  }

  // Resume recording
  resumeRecording() {
    if (this.recorder && this.isRecording && this.isPaused) {
      this.recorder.resumeRecording();
      this.isPaused = false;
      this.startTime = Date.now() - (this.elapsedTime * 1000); // Adjust start time
      console.log('▶️ Recording resumed');
    }
  }

  // Stop recording and get audio blob
  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.recorder) {
        reject(new Error('No active recording'));
        return;
      }

      console.log('🛑 Stopping recording...');

      // Stop timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      this.recorder.stopRecording(async () => {
        try {
          // Get audio blob
          const audioBlob = this.recorder.getBlob();
          
          // Clean up
          this.cleanup();
          
          console.log('✅ Recording stopped, blob size:', audioBlob.size);
          
          // Create file from blob
          const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
            type: 'audio/webm',
            lastModified: Date.now(),
          });

          resolve(audioFile);

        } catch (error) {
          this.cleanup();
          reject(error);
        }
      });
    });
  }

  // Cancel recording
  cancelRecording() {
    if (this.recorder) {
      console.log('❌ Recording cancelled');
      
      // Stop timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      
      this.recorder.stopRecording(() => {
        this.cleanup();
      });
    }
  }

  // Clean up resources
  cleanup() {
    // Stop all tracks
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    // Clear intervals
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    // Reset state
    this.stream = null;
    this.recorder = null;
    this.isRecording = false;
    this.isPaused = false;
    this.startTime = null;
    this.elapsedTime = 0;
  }

  // Get recording duration
  getDuration() {
    return this.elapsedTime;
  }

  // Convert seconds to MM:SS format
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

export default new AudioRecorder();