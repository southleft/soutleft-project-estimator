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

Base Cost Guidelines:
- Design Systems Development: $40k-60k base (complex component libraries and documentation)
- UX, UI Design and Prototyping: $15k-25k base (comprehensive design and validation)
- AI Product Development and Integration: $5k-10k base (initial AI implementation)
- Headless CMS Architectures: $25k-35k base (complex system architecture)
- CMS Theme Development: $20k-30k base (custom theme development)
- Mobile-First Responsive Web Design: $20k-30k base (responsive implementation)
- AI Development Consulting: $5k-15k base (strategic guidance)
- Tech Stack Strategy: $5k-15k base (technology planning)
Note: These are starting points - final estimates consider all factors below.

Timeline Impact:
- Urgent: +35% to total cost (rush fee and resource allocation)
- Normal: No adjustment
- Flexible: -15% from total cost (optimal resource planning)

Data Processing Volume Impact:
- N/A: No impact on cost
- Low: No adjustment
- Medium: +15% to base cost
- High: +30% to base cost

API Integration Costs (only if API integrations > 0):
- First integration: +$15,000
- Each additional: +$8,000 (reduced cost due to existing infrastructure)

System Integration Impact (only if system integration is required):
- If checked: +30% to total cost (complexity of integration)

Team Size Impact:
- Small (1-3): Base cost (efficient communication)
- Medium (4-7): +25% (coordination overhead)
- Large (8+): +45% (significant coordination overhead)

Level of Effort Calculation (1-10 scale):
- User's Complexity Input: ${projectContext.complexity}/10 (weighted 40%)
- Data Volume: ${projectContext.dataVolume} (N/A: 0, Low: 2, Medium: 5, High: 8)
- Integration Complexity: ${projectContext.systemIntegration ? 'Yes (+2)' : 'No'}
- API Count: ${projectContext.apiIntegrations} (+1 per API up to +3)
- Service Count: ${selectedServices.length} (+1 per service)

Additional Context:
${projectContext.description || 'No additional details provided.'}

Selected Configuration Summary:
- Services Selected: ${selectedServices.length} (${selectedServices.join(', ')})
- Timeline Priority: ${projectContext.timeline}
- Data Volume: ${projectContext.dataVolume}
- API Integrations: ${projectContext.apiIntegrations}
- System Integration Required: ${projectContext.systemIntegration ? 'Yes' : 'No'}
- Team Size: ${projectContext.teamSize}
- Complexity Rating: ${projectContext.complexity}/10

Respond with a JSON object containing:
{
  "timelineRange": "<number>-<number> months",
  "investmentRange": "$<number>k-$<number>k",
  "levelOfEffort": <1-10>,
  "aiInsight": "Provide detailed insights in this format:

1. PRICING BREAKDOWN:
   - Start with the base cost range for each selected service
   - Explain specific adjustments based on the user's inputs (timeline priority, team size, etc.)
   - Detail any additional costs (API integrations, system integration) if applicable
   - Show how these factors led to the final investment range

2. TIMELINE ANALYSIS:
   - Explain the base timeline for the selected services
   - Detail how the chosen ${projectContext.timeline} priority affects the schedule
   - Describe how the selected team size (${projectContext.teamSize}) impacts delivery
   - Note any complexity factors that influence the timeline

3. OPTIMIZATION RECOMMENDATIONS:
   - Provide specific suggestions based on the current configuration
   - If complexity is high (${projectContext.complexity}/10), suggest ways to manage it
   - If using integrations, recommend efficient implementation approaches
   - Offer relevant tips for the selected service type

Format each point as complete sentences, maintaining a professional tone. Reference specific numbers and percentages when explaining adjustments.

IMPORTANT RULES:
1. Only reference services that were actually selected
2. Never go below the base cost for any service
3. Every insight must directly reference the user's specific inputs
4. Never mention services or integrations that weren't selected
5. Explain how each factor contributed to the final estimate
6. Use concrete numbers and percentages when explaining adjustments
7. Keep insights factual and directly tied to the estimation model
8. Maintain a professional, consultative tone

Examples of good insights:
- "Your Design Systems Development project starts at a $40k base cost. With your selected small team size and normal timeline priority, we maintain the base cost while ensuring efficient delivery."
- "The timeline of 3-4 months reflects the comprehensive nature of design systems work, with your chosen normal priority timeline allowing for proper documentation and testing phases."
- "To optimize within your $40-60k budget, we recommend focusing initial development on core components, considering your complexity rating of 7/10."
}

IMPORTANT RULES:
1. Only reference services that were actually selected
2. Never go below the base cost for any service
3. Every insight must directly reference the user's specific inputs
4. Never mention services or integrations that weren't selected
5. Explain how each factor contributed to the final estimate
6. Use concrete numbers and percentages when explaining adjustments
7. Keep insights factual and directly tied to the estimation model
8. Maintain a professional, consultative tone

Examples:
- Design Systems Development alone: "3-4 months", "$40k-$60k"
- Mobile-First Web Design: "2-3 months", "$20k-$30k"
- UX/UI Design and Prototyping: "1-2 months", "$15k-$25k"
- AI Development Consulting: "1-2 months", "$5k-$15k"`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a senior technical project estimator. Focus ONLY on the actually selected services and configurations. Never mention services or features that weren't selected. Keep insights specific and relevant to the user's exact selections."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.1,
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
