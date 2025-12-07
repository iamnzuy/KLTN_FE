export interface ChatbotRequest {
  message: string;
  user_id: string;
  k?: number;
}

export interface ProductSpecs {
  os?: string;
  ram?: string;
  sim?: string;
  card?: string;
  camera?: string;
  battery?: string;
  display?: string;
  processor?: string;
  [key: string]: string | undefined;
}

export interface TopProduct {
  id: string;
  title: string;
  price: number;
  average_rating: number;
  specs: string | ProductSpecs;
  raw_metadata: {
    id: string;
    title: string;
    price: number;
    average_rating: number;
    specs: string | ProductSpecs;
  };
  vector_score?: number;
  lexical_score?: number;
  price_filter_relaxed?: boolean;
  score?: number;
  price_alignment?: string;
}

export interface ChatbotResponse {
  reply: string;
  product_ids: string[];
  top_products: TopProduct[];
  follow_up: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: TopProduct[];
  timestamp: Date;
}

