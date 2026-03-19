// Re-export core game types so components can import from either location.
export type { Game, RecommendationResult, TagDictionary } from "@/types/game";

// UI-specific types
export interface ExamplePrompt {
  id: string;
  text: string;
}

// API response shape for POST /api/recommend
export interface RecommendApiResponse {
  query: string;
  detectedTags: string[];
  recommendations: import("@/types/game").RecommendationResult[];
}
