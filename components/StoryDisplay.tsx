import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface StoryDisplayProps {
  description: string;
  imageUrl: string | null;
  isImageLoading?: boolean;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ description, imageUrl, isImageLoading = false }) => {
  return (
    <div className="flex flex-col h-full bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))] rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video w-full bg-[hsl(var(--muted))] flex items-center justify-center relative">
        {imageUrl && !isImageLoading ? (
          <img
            src={imageUrl}
            alt="A dynamically generated image representing the current game scene."
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[hsl(var(--muted-foreground))]">
            <LoadingSpinner />
            <span>Generating visuals...</span>
          </div>
        )}
      </div>
      <div className="p-6 flex-grow overflow-y-auto">
        <p className="text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-wrap">{description}</p>
      </div>
    </div>
  );
};

export default StoryDisplay;
