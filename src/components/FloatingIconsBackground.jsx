import React, { useEffect, useState } from 'react';
import { Mic, Waves, Radio, Activity, FileAudio } from 'lucide-react';

const FloatingIconsBackground = () => {
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    const iconsConfig = [
      // Left side icons (0-40%)
      { Icon: Radio, left: '2%', size: 40, duration: '27s', delay: '0s' },
      { Icon: Mic, left: '8%', size: 35, duration: '25s', delay: '2s' },
      { Icon: Waves, left: '12%', size: 50, duration: '30s', delay: '5s' },
      { Icon: FileAudio, left: '18%', size: 45, duration: '28s', delay: '3s' },
      { Icon: Activity, left: '22%', size: 30, duration: '22s', delay: '1s' },
      { Icon: Radio, left: '28%', size: 55, duration: '32s', delay: '7s' },
      { Icon: Mic, left: '32%', size: 40, duration: '26s', delay: '4s' },
      { Icon: Waves, left: '38%', size: 35, duration: '29s', delay: '6s' },
      
      // Center icons (40-60%)
      { Icon: FileAudio, left: '42%', size: 60, duration: '35s', delay: '0s' },
      { Icon: Activity, left: '46%', size: 45, duration: '31s', delay: '8s' },
      { Icon: Radio, left: '50%', size: 40, duration: '27s', delay: '2s' },
      { Icon: Mic, left: '54%', size: 50, duration: '33s', delay: '5s' },
      { Icon: Waves, left: '58%', size: 35, duration: '24s', delay: '3s' },
      
      // Right side icons (60-98%)
      { Icon: FileAudio, left: '62%', size: 45, duration: '30s', delay: '1s' },
      { Icon: Activity, left: '66%', size: 55, duration: '34s', delay: '7s' },
      { Icon: Radio, left: '70%', size: 40, duration: '28s', delay: '4s' },
      { Icon: Mic, left: '74%', size: 35, duration: '26s', delay: '2s' },
      { Icon: Waves, left: '78%', size: 60, duration: '36s', delay: '9s' },
      { Icon: FileAudio, left: '82%', size: 50, duration: '32s', delay: '6s' },
      { Icon: Activity, left: '86%', size: 45, duration: '29s', delay: '3s' },
      { Icon: Radio, left: '90%', size: 40, duration: '25s', delay: '1s' },
      { Icon: Mic, left: '94%', size: 55, duration: '31s', delay: '8s' },
      { Icon: Waves, left: '98%', size: 35, duration: '23s', delay: '5s' }
    ];

    // Add random vertical starting positions to each icon
    const iconsWithRandomPositions = iconsConfig.map((icon, index) => ({
      ...icon,
      id: index,
      startY: `${Math.random() * 100}vh`, // Random starting position (0-100vh)
      // Vary opacity for depth effect - lighter for some, darker for others
      opacity: index % 3 === 0 ? 0.03 : (index % 3 === 1 ? 0.06 : 0.09)
    }));

    setIcons(iconsWithRandomPositions);
  }, []);

  return (
    <div className="animated-bg">
      {icons.map((item) => (
        <div 
          key={item.id}
          className="floating-icon"
          style={{
            left: item.left,
            top: item.startY,
            width: item.size,
            height: item.size,
            animationDuration: item.duration,
            animationDelay: item.delay,
            opacity: item.opacity,
            color: 'var(--accent)',
            position: 'absolute',
            animation: `floatUp ${item.duration} linear ${item.delay} infinite`,
            transform: `translateY(0) rotate(0deg)`
          }}
        >
          <item.Icon size={item.size} />
        </div>
      ))}
    </div>
  );
};

export default FloatingIconsBackground;