// In-memory store for interviews

import { type Aptitude } from './questions';

type Scores = {
  [key in Aptitude]: number;
};

interface Interview {
    id: string;
    name: string;
    scores: Scores | null;
    recommendations: string | null;
    status: 'pending' | 'completed';
    createdAt: Date;
    completedAt?: Date;
}

// This is an in-memory store. Data will be lost on server restart.
export const interviewStore = new Map<string, Interview>();
