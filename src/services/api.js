// src/services/api.js
const API_BASE = '/api';

export const uploadAudio = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);

  try {
    const response = await fetch(`${API_BASE}/upload-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

export const listUploadedFiles = async () => {
  try {
    const response = await fetch(`${API_BASE}/files`);
    if (!response.ok) throw new Error('Failed to fetch files');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch files:', error);
    return { success: false, files: [] };
  }
};