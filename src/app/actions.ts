'use server';

import { getPersonalizedRecommendations, PersonalizedRecommendationsInput } from '@/ai/flows/personalized-recommendations';
import { interviewStore } from '@/lib/store';

export async function fetchRecommendations(scores: PersonalizedRecommendationsInput) {
  try {
    const result = await getPersonalizedRecommendations(scores);
    return { recommendations: result.recommendations };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { error: 'Failed to generate recommendations. Please try again later.' };
  }
}

export async function createInterview(name: string) {
  try {
    const newInterview = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      status: 'pending' as const,
      scores: null,
      recommendations: null,
    };
    interviewStore.set(newInterview.id, newInterview);
    return { id: newInterview.id };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { error: "Failed to create interview." };
  }
}

export async function getInterviews() {
  try {
    const interviews = Array.from(interviewStore.values());
    return { interviews };
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return { error: "Failed to fetch interviews." };
  }
}

export async function getInterview(id: string) {
    try {
        const interview = interviewStore.get(id);
        if (interview) {
            return { interview };
        } else {
            return { error: "No such interview!" };
        }
    } catch (error) {
        console.error("Error getting interview:", error);
        return { error: "Failed to get interview." };
    }
}

export async function saveInterviewResults(id: string, scores: PersonalizedRecommendationsInput, recommendations: string) {
  try {
    const interview = interviewStore.get(id);
    if (interview) {
      const updatedInterview = {
        ...interview,
        scores,
        recommendations,
        status: 'completed' as const,
        completedAt: new Date()
      };
      interviewStore.set(id, updatedInterview);
      return { success: true };
    }
    return { error: "Interview not found." };
  } catch (error) {
    console.error("Error updating interview:", error);
    return { error: "Failed to save interview results." };
  }
}
