import OpenAI from 'openai';
import { ProjectContext } from '../types/project';
import { services } from '../data/services';

// Declare global window property
declare global {
  interface Window {
    ProjectEstimatorConfig?: {
      apiKey: string;
    };
  }
}

// Get API key from environment variable or window object
const getApiKey = () => {
  try {
    // First check WordPress config
    if (typeof window !== 'undefined' && window.ProjectEstimatorConfig?.apiKey) {
      return window.ProjectEstimatorConfig.apiKey;
    }

    // Fallback to environment variable if available
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      return import.meta.env.VITE_OPENAI_API_KEY;
    }

    console.error('OpenAI API key not found in configuration');
    return ''; // Return empty string instead of throwing
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return ''; // Return empty string on error
  }
};

const openai = new OpenAI({
  apiKey: getApiKey() || 'MISSING_API_KEY', // Provide a default to prevent undefined
  dangerouslyAllowBrowser: true
});

export async function generateEstimate(
  selectedServiceIds: string[],
  projectContext: ProjectContext
) {
  const selectedServices = selectedServiceIds.map(id => {
    const service = services
      .flatMap(category => category.items)
      .find(item => item.id === id);
    return service ? `${service.title}` : id;
  });

  const prompt = `Generate a software project estimate using these specific guidelines:

Project Scope:
${selectedServices.join(', ')}

Timeline Impact:
- Base: 1-2 months per service
- Urgent: +25% to total cost (rush fee)
- Normal: No adjustment
- Flexible: -15% from total cost (allows for better planning and discovery)

Data Processing Volume Impact:
- Low: Base cost (minimal data processing requirements)
- Medium: +25% to total cost (moderate data processing and storage needs)
- High: +45% to total cost (significant data processing, storage, and optimization requirements)

API Integration Costs:
- First integration: +$15,000
- Each additional: +$8,000 (reduced cost due to existing integration infrastructure)

System Integration Impact:
- If required: +20% to total cost (accounts for additional complexity and testing)

Team Size Impact on Costs:
- Small (1-3): Base cost
- Medium (4-7): +30% (coordination overhead)
- Large (8+): +50% (significant coordination and communication overhead)

Complexity Calculation (should align with UI display):
- User Input: ${projectContext.complexity}/10 (weighted 40%)
- Data Volume: ${projectContext.dataVolume} (Low: 1-3, Medium: 4-6, High: 7-10)
- Integration Complexity: ${projectContext.systemIntegration ? 'Yes (+2)' : 'No'}
- API Count: ${projectContext.apiIntegrations} (+1 per API up to +3)
- Service Count: ${selectedServices.length} (+1 per 2 services)
Final complexity should be reflected in both the rating and cost adjustments.

Additional Context:
${projectContext.description || 'No additional details provided.'}

Respond with a JSON object containing:
{
  "timelineRange": "X-Y months",
  "investmentRange": "$XXk-$YYk",
  "complexityRating": <1-10>,
  "aiInsight": "<key considerations and recommendations focusing on timeline and cost factors>"
}

The investment range should reflect all the above factors cumulatively, with the complexity rating directly influencing the final cost.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a technical project estimator specializing in software development costs. Use the provided calculation factors to generate consistent and realistic estimates."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error('No response from OpenAI');

    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating estimate:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate estimate: ${error.message}`);
    }
    throw new Error('Failed to generate estimate');
  }
}
