'use server';

import { getPersonalizedRecommendations, PersonalizedRecommendationsInput } from '@/ai/flows/personalized-recommendations';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

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
    const docRef = await addDoc(collection(db, "interviews"), {
      name,
      createdAt: serverTimestamp(),
      scores: null,
      recommendations: null,
      status: 'pending'
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { error: "Failed to create interview." };
  }
}

export async function getInterviews() {
  try {
    const querySnapshot = await getDocs(collection(db, "interviews"));
    const interviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { interviews };
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return { error: "Failed to fetch interviews." };
  }
}

export async function getInterview(id: string) {
    try {
        const docRef = doc(db, "interviews", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { interview: { id: docSnap.id, ...docSnap.data() } };
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
    const docRef = doc(db, "interviews", id);
    await updateDoc(docRef, {
      scores,
      recommendations,
      status: 'completed',
      completedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating interview:", error);
    return { error: "Failed to save interview results." };
  }
}
