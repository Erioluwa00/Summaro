import React from 'react';
import { ChevronDown, ChevronUp, Copy, Share2, Save, FileAudio, Check, BarChart, Mic } from 'lucide-react';
import Button from '../Button';

const ResultsView = ({ 
  onNewNote, 
  isTranscriptExpanded, 
  toggleTranscript,
  showCopiedToast,
  onCopy,
  apiResult 
}) => {
  
  if (!apiResult) return null;

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Safely get data from response
  const getTranscript = () => {
    return apiResult.transcript || 'No transcript available';
  };

  const getSummary = () => {
    return apiResult.summary || 'No summary generated';
  };

  const getActionItems = () => {
    return apiResult.actionItems || [];
  };

  const getFileName = () => {
    return apiResult.file?.originalName || 'Audio File';
  };

  const getFileSize = () => {
    return apiResult.file?.size;
  };

  const getDuration = () => {
    return apiResult.file?.duration || apiResult.processing?.duration;
  };

  const transcript = getTranscript();
  const summary = getSummary();
  const actionItems = getActionItems();
  const fileName = getFileName();
  const fileSize = getFileSize();
  const duration = getDuration();

  return (
    <div className="results-view slide-up">
      
      {/* Success Message */}
      <div className="success-message">
        <Mic size={20} />
        <div>
          <strong>✅ Audio Successfully Processed!</strong>
          <p>Your voice note has been transcribed and summarized by AI.</p>
        </div>
      </div>

      {/* Header with file info */}
      <div className="results-header">
        <div className="meta-info">
          <FileAudio size={16} />
          <span>
            {fileName}
            {fileSize && ` • ${formatFileSize(fileSize)}`}
            {duration && ` • ${formatDuration(duration)}`}
          </span>
        </div>
        <div>
          <Button variant="icon" onClick={onNewNote} aria-label="New Note">
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>UPLOAD NEW</span>
          </Button>
        </div>
      </div>

      {/* Processing info */}
      {apiResult.processing && (
        <div className="processing-info">
          <span className="processing-badge">
            <BarChart size={12} />
            {apiResult.processing.provider || 'Deepgram'} {apiResult.processing.model || 'nova-3'}
          </span>
          {apiResult.processing.confidence && (
            <span className="processing-time">
              Confidence: {(apiResult.processing.confidence * 100).toFixed(1)}%
            </span>
          )}
        </div>
      )}

      {/* Stats card */}
      {apiResult.stats && (
        <div className="stats-card">
          <div className="stat">
            <div className="stat-value">{apiResult.stats.compression || '80%'}</div>
            <div className="stat-label">Condensed</div>
          </div>
          <div className="stat">
            <div className="stat-value">{apiResult.stats.actionItemsFound || actionItems.length}</div>
            <div className="stat-label">Action Items</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {apiResult.stats.sentencesInSummary || summary.split(/[.!?]+/).filter(s => s.trim().length > 0).length}/
              {apiResult.stats.sentencesInOriginal || transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
            </div>
            <div className="stat-label">Sentences</div>
          </div>
        </div>
      )}

      {/* Main Results Card */}
      <div className="card">
        
        {/* Summary Section */}
        <div className="section-summary">
          <div className="section-header">
            <h3 className="section-title">AI Summary</h3>
            <div className="actions-row">
              <Button variant="icon" onClick={onCopy} title="Copy Summary">
                {showCopiedToast ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
              </Button>
              <Button variant="icon" title="Save" onClick={() => {
                const blob = new Blob([summary], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `summary-${fileName.replace(/\.[^/.]+$/, "")}.txt`;
                a.click();
              }}>
                <Save size={18} />
              </Button>
              <Button variant="icon" title="Share" onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Summaro Summary',
                    text: summary,
                  });
                } else {
                  alert('Sharing is not supported in this browser');
                }
              }}>
                <Share2 size={18} />
              </Button>
            </div>
          </div>
          <p className="summary-text">
            {summary}
          </p>
        </div>

        {/* Action Items Section */}
        {actionItems.length > 0 && (
          <div className="section-actions">
            <h3 className="action-title">🎯 Key Takeaways</h3>
            <ul className="action-list">
              {actionItems.map((item, idx) => (
                <li key={idx} className="action-item">
                  <div className="dot"></div>
                  <span className="action-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transcript Section */}
        <div className="section-transcript">
          <div className="transcript-header">
            <h3 className="transcript-title">📝 Full Transcript</h3>
            <button 
              onClick={toggleTranscript}
              className="transcript-toggle-btn"
            >
              {isTranscriptExpanded ? "Hide" : "Show"} Full Transcript
              {isTranscriptExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          
          {/* Transcript Preview (always show some text) */}
          <div className="transcript-preview">
            {transcript.length > 300 ? (
              <>
                {transcript.substring(0, 300)}...
                {!isTranscriptExpanded && (
                  <button 
                    onClick={toggleTranscript}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent)',
                      cursor: 'pointer',
                      marginLeft: '0.5rem',
                      fontWeight: '500'
                    }}
                  >
                    Read more
                  </button>
                )}
              </>
            ) : (
              transcript
            )}
          </div>
          
          {/* Full Transcript (shown when expanded) */}
          {isTranscriptExpanded && transcript.length > 300 && (
            <div className="transcript-content">
              <pre>{transcript}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Note about processing */}
      {apiResult.note && (
        <div className="processing-note">
          <p>ℹ️ {apiResult.note}</p>
        </div>
      )}

      {/* Toast Notification */}
      {showCopiedToast && (
        <div className="toast slide-up">
          ✅ Copied to clipboard
        </div>
      )}
    </div>
  );
};

export default ResultsView;