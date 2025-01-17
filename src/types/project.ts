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
  apiIntegrations: number;
  dataVolume: 'Low' | 'Medium' | 'High';
  existingSystemIntegration: boolean;
  teamSize: 'Small' | 'Medium' | 'Large';
  description: string;
};

export type EstimateResult = {
  timelineRange: string;
  investmentRange: string;
  complexityRating: number;
  aiInsight: string;
};