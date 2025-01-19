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
  contentMigration: boolean;
  contentVolume: 'N/A' | 'Small' | 'Medium' | 'Large';
  teamSize: 'Small' | 'Medium' | 'Large';
  systemIntegration: boolean;
  apiIntegrations: number;
  description: string;
};

export type EstimateResult = {
  timelineRange: string;
  investmentRange: string;
  levelOfEffort: number;
  aiInsight: string;
};

export type ProjectSubmission = {
  selectedServices: Service[];
  projectContext: ProjectContext;
  estimateResult: EstimateResult;
  submittedAt: string;
  contactInfo: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
  };
};
