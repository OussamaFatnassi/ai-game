import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ActionButtonsProps {
  actions: string[];
  onAction: (action: string) => void;
  isLoading: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ actions, onAction, isLoading }) => {
  const [customAction, setCustomAction] = useState('');

  const handleSuggestionClick = (action: string) => {
    if (!isLoading) {
      onAction(action);
      setCustomAction('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim() && !isLoading) {
      onAction(customAction.trim());
      setCustomAction('');
    }
  };

  return (
    <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))] p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-4">What do you do?</h3>
      {isLoading && actions.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-8 text-[hsl(var(--muted-foreground))]">
            <LoadingSpinner />
            <span>The world shifts...</span>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(action)}
                disabled={isLoading}
                className="w-full text-left p-3 bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--secondary-foreground))] border border-[hsl(var(--border))] rounded-md transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]"
              >
                <span>{action}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center my-4 text-xs text-[hsl(var(--muted-foreground))]">
            <span className="flex-grow border-t border-[hsl(var(--border))]"></span>
            <span className="px-2 uppercase">Or</span>
            <span className="flex-grow border-t border-[hsl(var(--border))]"></span>
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="Type your action..."
              disabled={isLoading}
              className="flex-grow p-3 bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-md transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:opacity-50"
              aria-label="Custom action input"
            />
            <button
              type="submit"
              disabled={isLoading || !customAction.trim()}
              className="px-6 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold rounded-md transition-colors hover:bg-[hsl(var(--primary))]/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]"
              aria-label="Submit custom action"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
