import React from 'react';
import { ChevronDown, ChevronUp, Copy, Share2, Save, FileAudio, Check, Zap, BarChart } from 'lucide-react';
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

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="results-view slide-up">
      
      {/* Top Actions */}
      <div className="results-header">
        <div className="meta-info">
          <FileAudio size={16} />
          <span>{apiResult.file.originalName} • {formatFileSize(apiResult.file.size)} • {formatDate()}</span>
        </div>
        <div>
          <Button variant="icon" onClick={onNewNote} aria-label="New Note">
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>NEW</span>
          </Button>
        </div>
      </div>

      {/* Note about processing */}
      {apiResult.note && (
        <div className="info-notice" style={{ marginBottom: '1rem' }}>
          <div className="info-icon">ℹ️</div>
          <div className="info-content">
            <strong>Note:</strong> {apiResult.note}
          </div>
        </div>
      )}

      {/* Algorithm Info & Stats */}
      {(apiResult.algorithm || apiResult.stats) && (
        <div className="algorithm-stats-card">
          <div className="algorithm-header">
            <Zap size={18} />
            <h4>Smart Summarization</h4>
            {apiResult.algorithm && (
              <span className="algorithm-badge">{apiResult.algorithm.name}</span>
            )}
          </div>
          
          {apiResult.stats && (
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Compression</div>
                <div className="stat-value">{apiResult.stats.compression || 'N/A'}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Original</div>
                <div className="stat-value">{apiResult.stats.originalLength || 0} chars</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Summary</div>
                <div className="stat-value">{apiResult.stats.summaryLength || 0} chars</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Action Items</div>
                <div className="stat-value">{apiResult.actionItems ? apiResult.actionItems.length : 0}</div>
              </div>
            </div>
          )}
          
          {apiResult.algorithm && apiResult.algorithm.features && (
            <div className="algorithm-features">
              <div className="features-label">Features:</div>
              <div className="features-tags">
                {apiResult.algorithm.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Card */}
      <div className="card">
        
        {/* Summary Section */}
        <div className="section-summary">
          <div className="section-header">
            <h3 className="section-title">Summary</h3>
            <div className="actions-row">
              <Button variant="icon" onClick={() => onCopy('summary')} title="Copy Summary">
                {showCopiedToast === 'summary' ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
              </Button>
              <Button variant="icon" title="Save Summary" onClick={() => {
                const blob = new Blob([apiResult.summary], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `summary-${apiResult.file.originalName.replace(/\.[^/.]+$/, "")}.txt`;
                a.click();
              }}>
                <Save size={18} />
              </Button>
              <Button variant="icon" title="Share Summary" onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Summaro Summary',
                    text: apiResult.summary,
                  });
                }
              }}>
                <Share2 size={18} />
              </Button>
            </div>
          </div>
          <p className="summary-text">
            {apiResult.summary}
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
            <div className="action-actions">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  const text = apiResult.actionItems.map(item => `• ${item}`).join('\n');
                  navigator.clipboard.writeText(text);
                }}
              >
                <Copy size={14} /> Copy Actions
              </Button>
            </div>
          </div>
        )}

        {/* Transcript Section */}
        <div className="section-transcript">
          <div className="transcript-header">
            <h3 className="transcript-title">Full Transcript</h3>
            <div className="transcript-actions">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(apiResult.transcript);
                }}
              >
                <Copy size={14} /> Copy
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  const blob = new Blob([apiResult.transcript], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `transcript-${apiResult.file.originalName.replace(/\.[^/.]+$/, "")}.txt`;
                  a.click();
                }}
              >
                <Save size={14} /> Save
              </Button>
            </div>
          </div>
          
          <div className="transcript-toggle-area">
            <button 
              onClick={toggleTranscript}
              className="transcript-toggle"
            >
              {isTranscriptExpanded ? "Hide Full Transcript" : "Show Full Transcript"}
              {isTranscriptExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {isTranscriptExpanded && (
            <div className="transcript-content slide-up">
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                {apiResult.transcript}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* File Details */}
      <div className="file-details">
        <h4>📁 File Details</h4>
        <div className="details-grid">
          <div className="detail">
            <span className="detail-label">Original Name:</span>
            <span className="detail-value">{apiResult.file.originalName}</span>
          </div>
          <div className="detail">
            <span className="detail-label">File Size:</span>
            <span className="detail-value">{formatFileSize(apiResult.file.size)}</span>
          </div>
          {apiResult.processingMode && (
            <div className="detail">
              <span className="detail-label">Processing Mode:</span>
              <span className="detail-value mode-badge">{apiResult.processingMode}</span>
            </div>
          )}
          {apiResult.freeMinutesUsed && (
            <div className="detail">
              <span className="detail-label">Free Minutes Used:</span>
              <span className="detail-value">{apiResult.freeMinutesUsed.toFixed(2)} min</span>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showCopiedToast && (
        <div className={`toast slide-up ${showCopiedToast}`}>
          {showCopiedToast === 'summary' ? 'Summary copied!' : 
           showCopiedToast === 'transcript' ? 'Transcript copied!' : 
           showCopiedToast === 'actions' ? 'Actions copied!' : 
           'Copied to clipboard'}
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