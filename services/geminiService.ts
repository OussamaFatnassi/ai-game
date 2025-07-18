
import { GoogleGenAI, Type } from "@google/genai";
import { SetupConfig } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sceneSchema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "A detailed, atmospheric description of the current scene and the outcome of the player's last action. Should be 2-4 sentences. Be creative and engaging."
    },
    actions: {
      type: Type.ARRAY,
      description: "A list of 3-4 concise, compelling actions the player can take next. Each action should be a short string.",
      items: { type: Type.STRING }
    },
    newInventoryItems: {
        type: Type.ARRAY,
        description: "A list of any new items the player has acquired in this scene. Can be an empty array if nothing is found.",
        items: { type: Type.STRING }
    },
    imagePrompt: {
        type: Type.STRING,
        description: "A detailed, artistic, and dramatic prompt for an image generator to create a visual representation of the scene. Focus on mood, lighting, and key elements in a fantasy art style. Example: 'Epic fantasy art, a lone adventurer stands before a colossal, moss-covered stone gate in a dense, misty jungle, glowing runes pulse with faint blue light on the door, cinematic lighting.'"
    }
  },
  required: ["description", "actions", "newInventoryItems", "imagePrompt"]
};

export const generateInitialScene = async (setup: SetupConfig) => {
  const systemInstruction = `You are a master storyteller and game master for a dynamic text-based adventure game. Your goal is to create immersive, engaging, and coherent scenarios in a ${setup.genre} setting. The player is an adventurer. For each turn, you must provide a scene description, a list of possible actions, any new inventory items they find, and a descriptive prompt for an image generation model to visualize the scene. Respond ONLY in the requested JSON format. Keep the story moving and introduce challenges, mysteries, and interesting characters.`;
  
  const userPrompt = `Start a new ${setup.genre} adventure for the player based on the following premise: "${setup.customPrompt}"`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: sceneSchema,
    }
  });

  const json = JSON.parse(result.text);
  return json;
};

export const generateNextScene = async (genre: string, storyLog: string[], inventory: string[], chosenAction: string) => {
    const systemInstruction = `You are a master storyteller and game master for a dynamic text-based adventure game. Your goal is to create immersive, engaging, and coherent scenarios in a ${genre} setting. The player is an adventurer. For each turn, you must provide a scene description, a list of possible actions, any new inventory items they find, and a descriptive prompt for an image generation model to visualize the scene. Respond ONLY in the requested JSON format. Keep the story moving and introduce challenges, mysteries,and interesting characters.`;
    
    const context = `
        STORY SO FAR (most recent events first):
        ${storyLog.slice(-5).reverse().join("\n---\n")}

        PLAYER INVENTORY:
        [${inventory.join(", ")}]

        PLAYER'S CHOSEN ACTION:
        "${chosenAction}"

        Generate the next scene based on this context, continuing the ${genre} adventure.
    `;
    
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: context,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: sceneSchema,
        }
    });
    
    const json = JSON.parse(result.text);
    return json;
};

export const generateImage = async (prompt: string) => {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `${prompt}, cinematic, ultra detailed, atmospheric lighting`,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    
    throw new Error("Image generation failed.");
};