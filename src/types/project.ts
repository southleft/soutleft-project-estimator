export type Service = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
};

export type ProjectContext = {
  complexity: number;
  timeline: 'Urgent' | 'Normal' | 'Flexible';
  dataVolume: 'Low' | 'Medium' | 'High';
  teamSize: 'Small' | 'Medium' | 'Large';
  systemIntegration: boolean;
  apiIntegrations: number;
  description: string;
};

export type EstimateResult = {
  timelineRange: string;
  investmentRange: string;
  complexityRating: number;
  aiInsight: string;
};
