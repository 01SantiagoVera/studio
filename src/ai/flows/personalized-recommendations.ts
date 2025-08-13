'use server';

/**
 * @fileOverview A personalized recommendation AI agent based on aptitude assessment results.
 *
 * - getPersonalizedRecommendations - A function that generates personalized recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  clarifierScore: z.number().describe('The score for the Clarifier aptitude.'),
  ideatorScore: z.number().describe('The score for the Ideator aptitude.'),
  developerScore: z.number().describe('The score for the Developer aptitude.'),
  implementerScore: z.number().describe('The score for the Implementer aptitude.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('Personalized career and development recommendations.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `Based on the following aptitude assessment scores, provide personalized career and development recommendations.

Clarifier Score: {{{clarifierScore}}}
Ideator Score: {{{ideatorScore}}}
Developer Score: {{{developerScore}}}
Implementer Score: {{{implementerScore}}}

Consider the strengths indicated by the higher scores and suggest relevant career paths, development resources, or roles that align with these strengths. Provide specific and actionable advice to help the user leverage their aptitudes for professional growth.`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
