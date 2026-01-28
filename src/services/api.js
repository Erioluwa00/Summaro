import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds for large files
});

// src/services/api.js

// Simple upload function
export const uploadAudio = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);

  try {
    console.log('📤 Starting upload...');
    
    const response = await fetch('http://localhost:5000/api/upload-audio', {
      method: 'POST',
      body: formData,
    });

    console.log('📥 Response status:', response.status);
    
    // Get response text first
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('📊 Parsed response:', data);
      return data;
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      console.error('Raw response:', responseText.substring(0, 200));
      throw new Error(`Server returned invalid JSON`);
    }
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

// ✅ ADD THIS: Check if backend is running
export const checkHealth = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('🏥 Backend health:', data);
    return data;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return { 
      status: 'unhealthy', 
      error: 'Backend not running',
      message: 'Make sure backend server is running on port 5000'
    };
  }
};

// ✅ Optional: Add this too for getting files
export const getFiles = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/files');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch files:', error);
    return { success: false, files: [] };
  }
};