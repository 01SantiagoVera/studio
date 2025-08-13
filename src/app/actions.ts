'use server';

import { getPersonalizedRecommendations, PersonalizedRecommendationsInput } from '@/ai/flows/personalized-recommendations';

export async function fetchRecommendations(scores: PersonalizedRecommendationsInput) {
  try {
    const result = await getPersonalizedRecommendations(scores);
    return { recommendations: result.recommendations };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { error: 'Failed to generate recommendations. Please try again later.' };
  }
}
