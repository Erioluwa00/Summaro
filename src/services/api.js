import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 30000, // 30 seconds for large files
});

// src/services/api.js

// src/services/api.js

export const uploadAudio = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);

  try {
    console.log('📤 Starting upload to backend...');
    
    const response = await fetch('http://localhost:5000/api/upload-audio', {
      method: 'POST',
      body: formData,
    });

    console.log('📥 Response status:', response.status);
    
    // Get response text first
    const responseText = await response.text();
    console.log('📥 Raw response received');
    
    try {
      const data = JSON.parse(responseText);
      console.log('✅ Parsed JSON response');
      
      // Log important fields
      if (data.success) {
        console.log('🎉 Success!');
        console.log('📝 Has transcript?', !!data.transcript);
        console.log('🧠 Has summary?', !!data.summary);
        console.log('📋 Has action items?', data.actionItems?.length || 0);
      } else {
        console.error('❌ Backend returned error:', data.error);
      }
      
      return data;
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      console.error('Raw response (first 500 chars):', responseText.substring(0, 500));
      throw new Error('Server returned invalid response');
    }
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/files`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch files:', error);
    return { success: false, files: [] };
  }
};