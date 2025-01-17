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

  const prompt = `Generate a software project estimate for:

Services: ${selectedServices.join(', ')}
Timeline: ${projectContext.timeline}
Data Volume: ${projectContext.dataVolume}
Team Size: ${projectContext.teamSize}
Integration: ${projectContext.systemIntegration ? 'Required' : 'Not Required'}
API Integrations: ${projectContext.apiIntegrations}
Complexity: ${projectContext.complexity}/10
${projectContext.description ? `Details: ${projectContext.description}` : ''}

Respond with a JSON object:
{
  "timelineRange": "X-Y months",
  "investmentRange": "$XXk-$YYk",
  "complexityRating": <1-10>,
  "aiInsight": "<key considerations and recommendations>"
}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a technical project estimator. Be concise but insightful."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
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
