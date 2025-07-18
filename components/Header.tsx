
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center border-b border-[hsl(var(--border))] pb-4">
      <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--primary))] tracking-wider">
        Gemini Adventure
      </h1>
      <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">Your story awaits...</p>
    </header>
  );
};

export default Header;