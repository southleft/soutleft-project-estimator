import OpenAI from 'openai';
import { ProjectContext } from '../types/project';
import { services } from '../data/services';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
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

Timeline Calculation Factors:
- Base: 1-2 months per service
- Timeline Priority: ${projectContext.timeline} (Urgent: -20%, Normal: +0%, Flexible: +20%)
- Team Size: ${projectContext.teamSize} (Small: +20%, Medium: +0%, Large: -20%)
- Data Volume: ${projectContext.dataVolume} (Low: -10%, Medium: +0%, High: +20%)

Investment Calculation Factors:
- Base: $20-30k per service
- Complexity Multiplier: ${projectContext.complexity}/10 (+10% per point above 5)
- API Integrations: ${projectContext.apiIntegrations} (+$15k per integration)
- System Integration: ${projectContext.systemIntegration ? '+25% total cost' : 'No additional cost'}
- Team Size Impact: ${projectContext.teamSize} (Small: -10%, Medium: +0%, Large: +20%)

Complexity Rating Factors (1-10 scale):
- User Input: ${projectContext.complexity}/10 (weighted 40%)
- Data Volume: ${projectContext.dataVolume} (Low: 1-3, Medium: 4-6, High: 7-10)
- Integration Complexity: ${projectContext.systemIntegration ? 'Yes' : 'No'} (+2 if yes)
- API Count: ${projectContext.apiIntegrations} (+1 per API up to +3)
- Service Count: ${selectedServices.length} (+1 per 2 services)

Additional Context:
${projectContext.description || 'No additional details provided.'}

Respond with a JSON object:
{
  "timelineRange": "X-Y months",
  "investmentRange": "$XXk-$YYk",
  "complexityRating": <1-10>,
  "aiInsight": "<key considerations and recommendations focusing on the most impactful factors>"
}`;

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
