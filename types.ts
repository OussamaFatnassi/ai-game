
export interface SetupConfig {
  genre: string;
  customPrompt: string;
}

export interface Scene {
  description: string;
  actions: string[];
  imagePrompt: string;
}

export interface SceneData extends Scene {
    newInventoryItems: string[];
}

export interface GameState {
  storyLog: string[];
  currentScene: Scene | null;
  inventory: string[];
  imageUrl: string | null;
  genre: string | null;
}