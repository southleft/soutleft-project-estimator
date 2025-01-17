import { EstimateResult, ProjectContext } from '../types/project';

const insights = [
  (teamSize: string, complexity: number) => 
    `Based on your selections, Southleft recommends a ${
      teamSize === 'Small' ? 'focused agile team' : 'scaled agile approach'
    }.`,
  (_, complexity: number) =>
    `This project's complexity suggests ${
      complexity > 7 ? 'a phased delivery approach' : 'an iterative development cycle'
    } would be optimal.`,
  () => 
    `With the current scope, Southleft's team can deliver impactful results within the estimated timeline.`,
];

export function calculateEstimate(
  selectedServices: string[],
  context: ProjectContext
): EstimateResult {
  const baseTimePerService = 2;
  const totalServices = selectedServices.length;
  
  const timelineMultiplier = {
    'Urgent': 0.8,
    'Normal': 1,
    'Flexible': 1.2
  }[context.timeline];
  
  const baseTime = totalServices * baseTimePerService;
  const minWeeks = Math.max(4, Math.round(baseTime * timelineMultiplier * 0.8));
  const maxWeeks = Math.round(baseTime * timelineMultiplier * 1.2);
  
  const baseRate = 15000;
  const investmentMultiplier = 1 + (context.complexity - 5) * 0.1;
  const minInvestment = Math.round((baseRate * totalServices * investmentMultiplier * 0.9) / 1000) * 1000;
  const maxInvestment = Math.round((baseRate * totalServices * investmentMultiplier * 1.1) / 1000) * 1000;
  
  const complexityRating = Math.min(
    10,
    Math.round(
      (context.complexity +
        totalServices +
        context.apiIntegrations * 0.5 +
        (context.dataVolume === 'High' ? 2 : context.dataVolume === 'Medium' ? 1 : 0) +
        (context.existingSystemIntegration ? 1 : 0)) /
        2
    )
  );

  const randomInsight = insights[Math.floor(Math.random() * insights.length)];

  return {
    timelineRange: `${minWeeks}-${maxWeeks} weeks`,
    investmentRange: `$${(minInvestment / 1000).toFixed(0)}k-${(maxInvestment / 1000).toFixed(0)}k`,
    complexityRating,
    aiInsight: randomInsight(context.teamSize, complexityRating),
  };
}