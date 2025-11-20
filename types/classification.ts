// Classification method types
export type ClassificationMethod = 'KEYWORD' | 'LLM';

// LLM-based classification for Competitor/Own Page posts
export interface CompetitorPageClassificationLLM {
  products: string[];      // Product categories (e.g., ["หลังคา", "กระเบื้อง"])
  models: string[];        // Specific models (e.g., ["CASA Spain 760", "Wave 760"])
  valueProps: string[];    // Value propositions (e.g., ["หรูหรา ดูดี มีระดับ"])
  contentType: string;     // Content type (e.g., "Product Information", "Promotion")
}

// LLM-based classification for General Group posts
export interface GeneralGroupClassificationLLM {
  primaryIntent: string | null;     // Main intent (ASK_ADVICE, ASK_PRICE, etc.)
  intents: string[];                // All intents
  houseZones: string[];             // House zones mentioned
  painPoints: string[];             // Problems/concerns
  materialCategories: string[];     // Materials mentioned
  journeyStages: string[];          // Journey stage
  personas: string[];               // Persona type
}

// Default values for when classification cannot be determined
export const DEFAULT_COMPETITOR_CLASSIFICATION: CompetitorPageClassificationLLM = {
  products: ['Unspecified'],
  models: ['Unspecified'],
  valueProps: ['Unspecified'],
  contentType: 'Unspecified',
};

export const DEFAULT_GENERAL_CLASSIFICATION: GeneralGroupClassificationLLM = {
  primaryIntent: null,
  intents: [],
  houseZones: [],
  painPoints: [],
  materialCategories: [],
  journeyStages: [],
  personas: [],
};
