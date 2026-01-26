import React, { useRef } from 'react';
import { Mic, Upload } from 'lucide-react';
import FloatingIconsBackground from '../FloatingIconsBackground';
import Button from '../Button';

const InputView = ({ onStart, onFileUpload }) => {
  const fileInputRef = useRef();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="input-view fade-in">
      <FloatingIconsBackground />
      
      <div className="hero-text text-center">
        <h1>Turn your voice notes into clear,<br/> easy-to-read summaries instantly.</h1>
        <p>
          Record a meeting, lecture, or brain dump. <br />
          We'll extract the clarity.
        </p>
      </div>

      <div className="mic-wrapper">
        <div className="mic-glow"></div>
        <button 
          onClick={onStart}
          className="mic-button"
          aria-label="Start Recording"
        >
          <Mic size={48} strokeWidth={1.5} />
        </button>
      </div>

      <div className="upload-area">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".mp3,.wav,.m4a,.ogg,.flac"
          style={{ display: 'none' }}
        />
        <Button variant="secondary" onClick={handleUploadClick}>
          <Upload size={18} />
          Upload Audio File
        </Button>
        <p className="file-hint">
          Supports .mp3, .wav, .m4a, .ogg, .flac • Max 50MB
        </p>
      </div>
    </div>
  );
};

export default InputView;





// import React from 'react';
// import { Mic, Upload } from 'lucide-react';
// import FloatingIconsBackground from '../FloatingIconsBackground';
// import Button from '../Button';

// const InputView = ({ onStart }) => {
//   return (
//     <div className="input-view fade-in">
//       <FloatingIconsBackground />
      
//       <div className="hero-text text-center">
//         <h1>Turn your voice notes into clear,<br/> easy-to-read summaries instantly.</h1>
//         <p>
//           Record a meeting, lecture, or brain dump. <br />
//           We'll extract the clarity.
//         </p>
//       </div>

//       <div className="mic-wrapper">
//         <div className="mic-glow"></div>
//         <button 
//           onClick={onStart}
//           className="mic-button"
//           aria-label="Start Recording"
//         >
//           <Mic size={48} strokeWidth={1.5} />
//         </button>
//       </div>

//       <div className="upload-area">
//         <Button variant="secondary" onClick={onStart}>
//           <Upload size={18} />
//           Upload Audio File
//         </Button>
//         <p className="file-hint">
//           Supports .mp3, .wav, .m4a
//         </p>
//       </div>
//     </div>
//   );
// };

// export default InputView;