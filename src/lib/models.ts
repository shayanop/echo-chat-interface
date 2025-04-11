
import { AIModel } from "@/types/chat";

// Default models available - you can customize this list
export const availableModels: AIModel[] = [
  {
    id: "llama3",
    name: "Llama 3",
    description: "General purpose model with strong reasoning capabilities",
    contextLength: 8192,
    tags: ["general"]
  },
  {
    id: "mistral",
    name: "Mistral",
    description: "Balanced performance for general tasks",
    contextLength: 4096,
    tags: ["general"]
  },
  {
    id: "codellama",
    name: "CodeLlama",
    description: "Specialized for coding tasks and technical questions",
    contextLength: 16384,
    tags: ["code"]
  }
];

export const getModelById = (modelId: string): AIModel | undefined => {
  return availableModels.find(model => model.id === modelId);
};

export const getDefaultModel = (): AIModel => {
  return availableModels[0];
};
