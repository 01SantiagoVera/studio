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
  prompt: `Basado en los siguientes puntajes de evaluación de aptitudes, proporciona recomendaciones personalizadas de carrera y desarrollo en español.

Puntaje de Clarificador: {{{clarifierScore}}}
Puntaje de Ideador: {{{ideatorScore}}}
Puntaje de Desarrollador: {{{developerScore}}}
Puntaje de Implementador: {{{implementerScore}}}

Considera las fortalezas indicadas por los puntajes más altos y sugiere trayectorias profesionales relevantes, recursos de desarrollo o roles que se alineen con estas fortalezas. Proporciona consejos específicos y procesables para ayudar al usuario a aprovechar sus aptitudes para el crecimiento profesional. La respuesta debe estar completamente en español. No menciones los puntajes numéricos en tu respuesta.`,
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
