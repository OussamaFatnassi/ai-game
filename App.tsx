
import React, { useState, useCallback } from 'react';
import { GameState, SceneData, SetupConfig } from './types';
import { generateInitialScene, generateNextScene, generateImage } from './services/geminiService';
import Header from './components/Header';
import StoryDisplay from './components/StoryDisplay';
import ActionButtons from './components/ActionButtons';
import Inventory from './components/Inventory';
import LoadingSpinner from './components/LoadingSpinner';
import SetupScreen from './components/SetupScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    storyLog: [],
    currentScene: null,
    inventory: [],
    imageUrl: null,
    genre: null,
  });
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartGame = useCallback(async (config: SetupConfig) => {
    setIsLoading(true);
    setError(null);
    setIsGameStarted(true);
    try {
      const initialSceneData: SceneData = await generateInitialScene(config);
      const imageUrl = await generateImage(initialSceneData.imagePrompt);

      setGameState({
        storyLog: [initialSceneData.description],
        currentScene: {
          description: initialSceneData.description,
          actions: initialSceneData.actions,
          imagePrompt: initialSceneData.imagePrompt
        },
        inventory: initialSceneData.newInventoryItems,
        imageUrl: imageUrl,
        genre: config.genre,
      });
    } catch (e) {
      console.error(e);
      setError('Failed to start the adventure. Please check your API key and try again.');
      setIsGameStarted(false); // Go back to setup on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAction = async (action: string) => {
    if (!gameState.currentScene || !gameState.genre) return;

    setIsLoading(true);
    setError(null);

    const newStoryLog = [...gameState.storyLog, `> ${action}`, ''];
    setGameState(prev => ({...prev, currentScene: {...prev.currentScene!, actions: []}})); // Disable buttons immediately

    try {
        const nextSceneData: SceneData = await generateNextScene(
            gameState.genre,
            gameState.storyLog,
            gameState.inventory,
            action
        );

        // Start image generation but don't wait for it to update text
        generateImage(nextSceneData.imagePrompt).then(newImageUrl => {
            setGameState(prev => ({ ...prev, imageUrl: newImageUrl }));
        }).catch(e => {
            console.error("Image generation failed for next scene:", e);
        });

        const newInventory = [...new Set([...gameState.inventory, ...nextSceneData.newInventoryItems])];
        newStoryLog[newStoryLog.length - 1] = nextSceneData.description;

        setGameState(prev => ({
            ...prev,
            storyLog: newStoryLog,
            currentScene: {
                description: nextSceneData.description,
                actions: nextSceneData.actions,
                imagePrompt: nextSceneData.imagePrompt
            },
            inventory: newInventory,
            imageUrl: prev.imageUrl, // keep old image until new one loads
        }));
    } catch (e) {
        console.error(e);
        setError('The story could not continue. An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setError(null);
    setIsGameStarted(false);
    setGameState({
      storyLog: [],
      currentScene: null,
      inventory: [],
      imageUrl: null,
      genre: null,
    });
  };

  const renderContent = () => {
    if (!isGameStarted && !isLoading) {
      return <SetupScreen onStart={handleStartGame} isLoading={isLoading} />;
    }

    if (error) {
      return (
        <div className="w-full max-w-lg text-center p-6 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] rounded-lg border border-red-800/50">
          <h2 className="text-2xl font-bold mb-4">An Error Occurred</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] font-bold rounded-md transition-colors"
          >
            Create New Adventure
          </button>
        </div>
      );
    }

    if (isLoading && !gameState.currentScene) {
      return (
          <div className="flex flex-col items-center justify-center gap-4">
              <LoadingSpinner />
              <p className="text-xl text-[hsl(var(--muted-foreground))]">Summoning the world...</p>
          </div>
      );
    }

    if (!gameState.currentScene) {
      return (
        <div className="text-center">
            <p className="mb-4">Could not load the scene.</p>
            <button
                onClick={handleRestart}
                className="px-6 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold rounded-md transition-colors hover:bg-[hsl(var(--primary))]/90"
            >
              Start Over
            </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full w-full">
        <div className="lg:col-span-3 h-full">
            <StoryDisplay description={gameState.currentScene.description} imageUrl={gameState.imageUrl} />
        </div>
        <div className="lg:col-span-2 flex flex-col justify-between h-full gap-8">
            <Inventory items={gameState.inventory} />
            <ActionButtons actions={gameState.currentScene.actions} onAction={handleAction} isLoading={isLoading} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] p-4 sm:p-6 lg:p-8 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto mt-8 flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;