export interface MccSettings {
  time?: string;
  temp?: string;
  speed?: string;
  accessory?: string; // e.g., "Mariposa/Mezclador", "Cesta", "Varoma"
  reverse?: boolean; // Marcha atrás
}

export interface RecipeStep {
  instruction: string;
  settings?: MccSettings;
}

export interface Recipe {
  title: string;
  description: string;
  prepTime: string;
  totalTime: string;
  servings: number;
  ingredients: string[];
  steps: RecipeStep[];
}

export interface ConversionState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  recipe?: Recipe;
}