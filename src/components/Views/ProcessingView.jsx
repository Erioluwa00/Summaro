import React from 'react';

const ProcessingView = ({ processingStep }) => {
  const messages = ["Listening...", "Understanding...", "Summarizing..."];
  
  return (
    <div className="processing-view fade-in">
      <div className="loader-ring">
        <div className="loader-ripple"></div>
        <div className="bars">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
      
      <h2 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>
        {messages[processingStep]}
      </h2>
      <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Processing audio intelligence...
      </p>
    </div>
  );
};

export default ProcessingView;