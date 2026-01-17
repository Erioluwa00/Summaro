import React from 'react';
import { ChevronDown, ChevronUp, Copy, Share2, Save, FileAudio, Check } from 'lucide-react';
import { MOCK_RESULT } from '../../data/mockData';
import Button from '../Button';

const ResultsView = ({ 
  onNewNote, 
  isTranscriptExpanded, 
  toggleTranscript,
  showCopiedToast,
  onCopy 
}) => {
  return (
    <div className="results-view slide-up">
      
      {/* Top Actions */}
      <div className="results-header">
        <div className="meta-info">
          <FileAudio size={16} />
          <span>Recorded Today, 10:42 AM</span>
        </div>
        <div>
           <Button variant="icon" onClick={onNewNote} aria-label="New Note">
             <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>NEW</span>
           </Button>
        </div>
      </div>

      {/* Main Card */}
      <div className="card">
        
        {/* Summary Section */}
        <div className="section-summary">
          <div className="section-header">
            <h3 className="section-title">Summary</h3>
            <div className="actions-row">
               <Button variant="icon" onClick={onCopy} title="Copy Summary">
                 {showCopiedToast ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
               </Button>
               <Button variant="icon" title="Save">
                 <Save size={18} />
               </Button>
               <Button variant="icon" title="Share">
                 <Share2 size={18} />
               </Button>
            </div>
          </div>
          <p className="summary-text">
            {MOCK_RESULT.summary}
          </p>
        </div>

        {/* Action Items Section */}
        <div className="section-actions">
          <h3 className="action-title">Action Items</h3>
          <ul className="action-list">
            {MOCK_RESULT.actionItems.map((item, idx) => (
              <li key={idx} className="action-item">
                <div className="dot"></div>
                <span className="action-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transcript Toggle */}
      <div>
        <button 
          onClick={toggleTranscript}
          className="transcript-toggle"
        >
          {isTranscriptExpanded ? "Hide Transcript" : "View Full Transcript"}
          {isTranscriptExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isTranscriptExpanded && (
          <div className="transcript-content slide-up">
            {MOCK_RESULT.transcript}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showCopiedToast && (
        <div className="toast slide-up">
          Copied to clipboard
        </div>
      )}
    </div>
  );
};

export default ResultsView;