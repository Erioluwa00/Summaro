import React from 'react';
import { Moon, Sun } from 'lucide-react';
import Button from '../Button';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="app-header">
      <nav className="nav-bar">
        <div className="logo">
          <div className="logo-icon">
            <div className="logo-dot"></div>
          </div>
          <span>Summaro</span>
        </div>
        
        <Button variant="icon" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
      </nav>
    </header>
  );
};

export default Header;