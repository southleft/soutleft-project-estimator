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
  // Get full service details for better context
  const selectedServices = selectedServiceIds.map(id => {
    const service = services
      .flatMap(category => category.items)
      .find(item => item.id === id);
    return service ? `${service.title} - ${service.description}` : id;
  });

  const prompt = `As an experienced technical project manager and cost estimator, analyze the following project requirements and provide a detailed estimate:

Project Services:
${selectedServices.map((service, i) => `${i + 1}. ${service}`).join('\n')}

Project Context:
- Timeline Preference: ${projectContext.timeline}
- Data Volume: ${projectContext.dataVolume}
- Team Size: ${projectContext.teamSize}
- System Integration Needed: ${projectContext.systemIntegration ? 'Yes' : 'No'}
- Project Complexity (1-10): ${projectContext.complexity}
${projectContext.description ? `- Additional Details: ${projectContext.description}` : ''}

Based on the above requirements, provide a comprehensive project estimate. Consider:
1. Service complexity and interdependencies
2. Team size and composition
3. Data volume impact on architecture
4. Integration requirements
5. Timeline constraints

Respond with a JSON object containing:
{
  "timelineRange": "X-Y months",
  "investmentRange": "$XXk-$YYk",
  "complexityRating": <number between 1-10>,
  "aiInsight": "<detailed analysis of key considerations, risks, and recommendations>"
}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert technical project manager with extensive experience in software development cost estimation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
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
