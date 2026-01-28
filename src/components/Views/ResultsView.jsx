import React from 'react';
import { ChevronDown, ChevronUp, Copy, Share2, Save, FileAudio, Check, BarChart } from 'lucide-react';
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

  return (
    <div className="results-view slide-up">
      
      {/* Header with file info */}
      <div className="results-header">
        <div className="meta-info">
          <FileAudio size={16} />
          <span>
            {apiResult.file?.originalName || 'Audio file'} • 
            {apiResult.file?.size && ` ${formatFileSize(apiResult.file.size)}`}
            {apiResult.file?.duration && ` • ${formatDuration(apiResult.file.duration)}`}
          </span>
        </div>
        <div>
          <Button variant="icon" onClick={onNewNote} aria-label="New Note">
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>NEW</span>
          </Button>
        </div>
      </div>

      {/* Processing info */}
      {apiResult.deepgramResult && (
        <div className="processing-info">
          <span className="processing-badge">
            <BarChart size={12} />
            Processed with Deepgram {apiResult.deepgramResult.model}
          </span>
          <span className="processing-time">
            {formatDuration(apiResult.deepgramResult.duration)} audio
          </span>
        </div>
      )}

      {/* Stats card */}
      {apiResult.stats && (
        <div className="stats-card">
          <div className="stat">
            <div className="stat-value">{apiResult.stats.compression}</div>
            <div className="stat-label">Compression</div>
          </div>
          <div className="stat">
            <div className="stat-value">{apiResult.stats.actionItemsFound}</div>
            <div className="stat-label">Action Items</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {apiResult.stats.sentencesInSummary}/{apiResult.stats.sentencesInOriginal}
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
              <Button variant="icon" title="Save">
                <Save size={18} />
              </Button>
              <Button variant="icon" title="Share">
                <Share2 size={18} />
              </Button>
            </div>
          </div>
          <p className="summary-text">
            {apiResult.summary || 'No summary generated'}
          </p>
        </div>

        {/* Action Items Section */}
        {apiResult.actionItems && apiResult.actionItems.length > 0 && (
          <div className="section-actions">
            <h3 className="action-title">Action Items</h3>
            <ul className="action-list">
              {apiResult.actionItems.map((item, idx) => (
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
            <h3 className="transcript-title">Full Transcript</h3>
            <button 
              onClick={toggleTranscript}
              className="transcript-toggle-btn"
            >
              {isTranscriptExpanded ? "Hide" : "Show"} Transcript
              {isTranscriptExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          
          {isTranscriptExpanded && (
            <div className="transcript-content">
              <pre>{apiResult.transcript || 'No transcript available'}</pre>
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
          Copied to clipboard
        </div>
      )}
    </div>
  );
};

export default ResultsView;


// import React from 'react';
// import { ChevronDown, ChevronUp, Copy, Share2, Save, FileAudio, Check } from 'lucide-react';
// import { MOCK_RESULT } from '../../data/mockData';
// import Button from '../Button';

// const ResultsView = ({ 
//   onNewNote, 
//   isTranscriptExpanded, 
//   toggleTranscript,
//   showCopiedToast,
//   onCopy 
// }) => {
//   return (
//     <div className="results-view slide-up">
      
//       {/* Top Actions */}
//       <div className="results-header">
//         <div className="meta-info">
//           <FileAudio size={16} />
//           <span>Recorded Today, 10:42 AM</span>
//         </div>
//         <div>
//            <Button variant="icon" onClick={onNewNote} aria-label="New Note">
//              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>NEW</span>
//            </Button>
//         </div>
//       </div>

//       {/* Main Card */}
//       <div className="card">
        
//         {/* Summary Section */}
//         <div className="section-summary">
//           <div className="section-header">
//             <h3 className="section-title">Summary</h3>
//             <div className="actions-row">
//                <Button variant="icon" onClick={onCopy} title="Copy Summary">
//                  {showCopiedToast ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
//                </Button>
//                <Button variant="icon" title="Save">
//                  <Save size={18} />
//                </Button>
//                <Button variant="icon" title="Share">
//                  <Share2 size={18} />
//                </Button>
//             </div>
//           </div>
//           <p className="summary-text">
//             {MOCK_RESULT.summary}
//           </p>
//         </div>

//         {/* Action Items Section */}
//         <div className="section-actions">
//           <h3 className="action-title">Action Items</h3>
//           <ul className="action-list">
//             {MOCK_RESULT.actionItems.map((item, idx) => (
//               <li key={idx} className="action-item">
//                 <div className="dot"></div>
//                 <span className="action-text">{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Transcript Toggle */}
//       <div>
//         <button 
//           onClick={toggleTranscript}
//           className="transcript-toggle"
//         >
//           {isTranscriptExpanded ? "Hide Transcript" : "View Full Transcript"}
//           {isTranscriptExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//         </button>

//         {isTranscriptExpanded && (
//           <div className="transcript-content slide-up">
//             {MOCK_RESULT.transcript}
//           </div>
//         )}
//       </div>

//       {/* Toast Notification */}
//       {showCopiedToast && (
//         <div className="toast slide-up">
//           Copied to clipboard
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResultsView;