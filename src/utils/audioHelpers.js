// src/utils/audioHelpers.js
export const validateAudioFile = (file) => {
  const allowedTypes = ['.mp3', '.wav', '.m4a', '.ogg', '.flac'];
  const maxSize = 50 * 1024 * 1024; // 50MB

  // Get file extension
  const fileName = file.name.toLowerCase();
  const fileExtension = '.' + fileName.split('.').pop();
  
  // Check file type
  if (!allowedTypes.includes(fileExtension)) {
    throw new Error(
      `Unsupported file type. Allowed types: ${allowedTypes.join(', ')}`
    );
  }

  // Check file size
  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(`File too large (${fileSizeMB}MB). Maximum size is 50MB.`);
  }

  return true;
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};