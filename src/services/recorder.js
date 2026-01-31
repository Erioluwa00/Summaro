// src/services/recorder.js
import RecordRTC from 'recordrtc';

class AudioRecorder {
  constructor() {
    this.stream = null;
    this.recorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.startTime = null;
    this.timerInterval = null;
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
        timeSlice: 1000, // Update every second
        ondataavailable: (blob) => {
          this.audioChunks.push(blob);
        }
      });

      // Start recording
      this.recorder.startRecording();
      this.isRecording = true;
      this.startTime = Date.now();
      
      // Start timer
      this.timerInterval = setInterval(() => {
        if (onTimeUpdate) {
          const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
          onTimeUpdate(elapsed);
        }
      }, 1000);

      console.log('🎙️ Recording started');
      return true;

    } catch (error) {
      console.error('❌ Recording failed:', error);
      throw new Error(`Recording failed: ${error.message}`);
    }
  }

  // Pause recording
  pauseRecording() {
    if (this.recorder && this.isRecording) {
      this.recorder.pauseRecording();
      this.isRecording = false;
      console.log('⏸️ Recording paused');
    }
  }

  // Resume recording
  resumeRecording() {
    if (this.recorder && !this.isRecording) {
      this.recorder.resumeRecording();
      this.isRecording = true;
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
    this.audioChunks = [];
    this.isRecording = false;
    this.startTime = null;
  }

  // Get recording duration
  getDuration() {
    if (!this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  // Convert seconds to MM:SS format
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

export default new AudioRecorder();