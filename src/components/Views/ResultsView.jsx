import React from 'react';
import { ChevronDown, ChevronUp, Copy, Share2, Save, FileAudio, Check, BarChart, Mic } from 'lucide-react';
import Button from '../Button';

// In ResultsView.jsx, add Deepgram info
// In ResultsView.jsx, update the rendering
const ResultsView = ({ 
  onNewNote, 
  isTranscriptExpanded, 
  toggleTranscript,
  showCopiedToast,
  onCopy,
  apiResult 
}) => {
  
  if (!apiResult) return null;

  // Use formatted output if available
  const displaySummary = apiResult.formattedOutput?.summary || apiResult.summary;
  const displayActionItems = apiResult.formattedOutput?.actionItems || 
    (apiResult.actionItems && Array.isArray(apiResult.actionItems) 
      ? apiResult.actionItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
      : '');

  return (
    <div className="results-view slide-up">
      
      {/* File Info */}
      <div className="results-header">
        <div className="meta-info">
          <FileAudio size={16} />
          <span>
            {apiResult.file?.originalName || 'Audio file'} • 
            {apiResult.file?.duration && ` ${Math.round(apiResult.file.duration)}s`}
          </span>
        </div>
        <div>
          <Button variant="icon" onClick={onNewNote} aria-label="New Note">
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>NEW</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      {apiResult.stats && (
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{apiResult.stats.compression}</div>
            <div className="stat-label">Compressed</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{apiResult.stats.actionItemsCount}</div>
            <div className="stat-label">Action Items</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{apiResult.stats.confidence}</div>
            <div className="stat-label">Confidence</div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="card">
        
        {/* Summary Section */}
        <div className="section-summary">
          <div className="section-header">
            <div className="section-title-row">
              <h3 className="section-title">Summary</h3>
            </div>
            <div className="actions-row">
              <Button variant="icon" onClick={onCopy} title="Copy Summary">
                {showCopiedToast ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
              </Button>
            </div>
          </div>
          <div className="ai-summary-content">
            <div className="summary-sentences">
              {displaySummary.split('\n').map((sentence, idx) => (
                <div key={idx} className="sentence-item">
                  <span className="sentence-text">{sentence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Items Section */}
        {displayActionItems && (
          <div className="section-actions">
            <div className="section-header">
              <h3 className="action-title">Action Items</h3>
            </div>
            <div className="action-items-list">
              {displayActionItems.split('\n').map((item, idx) => (
                <div key={idx} className="action-item-row">
                  <div className="action-number">{idx + 1}</div>
                  <div className="action-text">{item.replace(/^\d+\.\s*/, '')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript */}
        <div className="section-transcript">
          <button 
            onClick={toggleTranscript}
            className="transcript-toggle-btn"
          >
            {isTranscriptExpanded ? "Hide Full Transcript" : "Show Transcript"}
            {isTranscriptExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isTranscriptExpanded && (
            <div className="transcript-content">
              <div className="transcript-header-row">
                <span className="transcript-source">Full Transcript</span>
                <span className="word-count">
                  {apiResult.stats?.wordCount || 0} words
                </span>
              </div>
              <pre>{apiResult.transcript}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {showCopiedToast && (
        <div className="toast slide-up">
          Copied to clipboard
        </div>
      )}
    </div>
  );
};

export default ResultsView;