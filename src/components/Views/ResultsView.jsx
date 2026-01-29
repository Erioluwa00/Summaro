import React from 'react';
import { ChevronDown, ChevronUp, Copy, Share2, Save, FileAudio, Check, BarChart, Mic } from 'lucide-react';
import Button from '../Button';

// In ResultsView.jsx, add Deepgram info
const ResultsView = ({ 
  onNewNote, 
  isTranscriptExpanded, 
  toggleTranscript,
  showCopiedToast,
  onCopy,
  apiResult 
}) => {
  
  if (!apiResult) return null;

  return (
    <div className="results-view slide-up">
      
      {/* Deepgram Processing Badge */}
      {/* {apiResult.deepgramResult && (
        <div className="deepgram-badge">
          <div className="deepgram-icon">🤖</div>
          <div className="deepgram-info">
            <span className="deepgram-model">Deepgram {apiResult.deepgramResult.model}</span>
            <span className="deepgram-confidence">
              {apiResult.deepgramResult.confidence || apiResult.stats?.confidence || 'High'} confidence
            </span>
          </div>
        </div>
      )} */}
      
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
        
        {/* AI Summary Section */}
        <div className="section-summary">
          <div className="section-header">
            <div className="section-title-row">
              <h3 className="section-title">AI Summary</h3>
              {apiResult.deepgramResult?.summaryType && (
                <span className="summary-badge">
                  Deepgram {apiResult.deepgramResult.summaryType}
                </span>
              )}
            </div>
            <div className="actions-row">
              <Button variant="icon" onClick={onCopy} title="Copy Summary">
                {showCopiedToast ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
              </Button>
            </div>
          </div>
          <div className="ai-summary-content">
            <p className="summary-text">
              {apiResult.summary}
            </p>
            {apiResult.deepgramResult?.hasActionItems && (
              <div className="ai-disclaimer">
                <span>AI-generated summary with action items</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Items from Deepgram */}
        {apiResult.actionItems && apiResult.actionItems.length > 0 && (
          <div className="section-actions">
            <div className="section-header">
              <h3 className="action-title">Action Items</h3>
              <span className="action-count">{apiResult.actionItems.length} items</span>
            </div>
            <ul className="action-list">
              {apiResult.actionItems.map((item, idx) => (
                <li key={idx} className="action-item">
                  <div className="action-number">{idx + 1}</div>
                  <span className="action-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transcript */}
        <div className="section-transcript">
          <button 
            onClick={toggleTranscript}
            className="transcript-toggle-btn"
          >
            {isTranscriptExpanded ? "Hide Full Transcript" : "Show AI Transcript"}
            {isTranscriptExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isTranscriptExpanded && (
            <div className="transcript-content">
              <div className="transcript-header-row">
                <span className="transcript-source">Deepgram AI Transcription</span>
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