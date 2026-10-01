export interface ShoppingLink {
  platform: string;
  name: string;
  url: string;
  icon?: string;
  color?: string;
}

export interface RecommendationItem {
  id?: string;
  name: string;
  description: string;
  estimated_price: number;
  quantity?: number;
  search_terms: string;
  shopping_links: Record<string, string>;
  category?: string;
  style?: string;
  item_type?: string;
}

export interface BudgetCategoryBreakdown {
  category: string;
  allocation: number;
  items: RecommendationItem[];
}

export interface CalculationTableRow {
  category: string;
  items_count: number;
  total_cost: number;
  percentage_of_budget: number;
}

export interface VenueSuggestion {
  name: string;
  type: string;
  capacity?: number;
  estimated_cost: number;
  search_terms: string;
  search_links?: Record<string, string>;
  location?: string;
}

export interface OutfitAnalysis {
  colors: string[];
  style: string;
  formality: string;
  detected_garment?: string;
  key_notes?: string;
}

export interface HomePlanResult {
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  budget_breakdown: BudgetCategoryBreakdown[];
  calculation_table: CalculationTableRow[];
  additional_suggestions: string[];
}

export interface PartyPlanResult {
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  budget_breakdown: BudgetCategoryBreakdown[];
  calculation_table: CalculationTableRow[];
  venue_suggestions: VenueSuggestion[];
  additional_suggestions: string[];
}

export interface JewelryPlanResult {
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  outfit_analysis?: OutfitAnalysis;
  jewelry_recommendations: RecommendationItem[];
  styling_tips: string[];
  additional_suggestions?: string[];
}

export interface HomeBudgetInput {
  total_budget: number;
  num_lights: number;
  num_fans: number;
  num_furniture: number;
  num_dining_tables: number;
  rooms: {
    living_room: boolean;
    kitchen: boolean;
    bedroom: boolean;
    balcony?: boolean;
    bathroom?: boolean;
  };
  additional_requirements?: string;
  currency?: string;
}

export interface PartyBudgetInput {
  total_budget: number;
  num_guests: number;
  party_type: string;
  venue_type: string;
  needs_catering: boolean;
  needs_decoration: boolean;
  needs_entertainment: boolean;
  needs_photography?: boolean;
  additional_requirements?: string;
  currency?: string;
}

export interface JewelryBudgetInput {
  total_budget: number;
  occasion: string;
  preferences?: string;
  image_base64?: string;
  image_name?: string;
  currency?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  type: 'home' | 'party' | 'jewelry';
  title: string;
  total_budget: number;
  remaining_budget: number;
  currency: string;
  input_summary: Record<string, any>;
  result_summary: string;
  full_result: HomePlanResult | PartyPlanResult | JewelryPlanResult;
}

export interface User {
  username: string;
  email: string;
  full_name?: string;
}

export interface SessionInfo {
  username: string;
  login_time: string;
  last_activity: string;
  session_duration_minutes: number;
  user_data: Record<string, any>;
}
