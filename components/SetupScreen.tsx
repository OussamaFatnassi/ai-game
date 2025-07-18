
import React, { useState } from 'react';
import type { SetupConfig } from '../types';

interface SetupScreenProps {
  onStart: (config: SetupConfig) => void;
  isLoading: boolean;
}

const genres = ['Fantasy', 'Sci-Fi', 'Mystery', 'Cyberpunk', 'Horror'];

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading }) => {
  const [genre, setGenre] = useState('Fantasy');
  const [customPrompt, setCustomPrompt] = useState('I wake up in a dimly lit tavern with a pounding headache and a mysterious note in my pocket.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onStart({ genre, customPrompt });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-xl animate-fade-in">
      <h1 className="text-4xl font-bold text-center text-[hsl(var(--primary))] mb-2">Create Your Adventure</h1>
      <p className="text-center text-[hsl(var(--muted-foreground))] mb-8">Set the stage for your unique story.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-3">
            1. Choose a Genre
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {genres.map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGenre(g)}
                className={`w-full p-3 border rounded-md transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] ${
                  genre === g
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]'
                    : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--secondary-foreground))] border-[hsl(var(--border))]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="custom-prompt" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
            2. Describe Your Starting Scene
          </label>
          <textarea
            id="custom-prompt"
            rows={4}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full p-3 bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-md transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]"
            placeholder="e.g., In a neon-drenched alley, rain sizzles on the hot asphalt..."
            required
            aria-label="Custom starting scene"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !customPrompt.trim()}
            className="w-full px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold text-lg rounded-md transition-colors hover:bg-[hsl(var(--primary))]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Start adventure"
          >
            {isLoading ? 'Summoning the world...' : 'Start Adventure'}
          </button>
        </div>
      </form>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SetupScreen;
