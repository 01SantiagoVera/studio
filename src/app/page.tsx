'use client';

import { useState, useMemo } from 'react';
import { questions, type Aptitude, type Question } from '@/lib/questions';
import { fetchRecommendations } from '@/app/actions';
import { AptitudeForm } from '@/components/aptitude-test/aptitude-form';
import { AptitudeResults } from '@/components/aptitude-test/aptitude-results';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type Scores = {
  [key in Aptitude]: number;
};

export default function Home() {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [scores, setScores] = useState<Scores | null>(null);
  const [recommendations, setRecommendations] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value, 10) }));
  };

  const isAllAnswered = useMemo(() => {
    return questions.length === Object.keys(answers).length;
  }, [answers]);

  const handleSubmit = async () => {
    if (!isAllAnswered) return;

    setIsLoading(true);

    const calculatedScores: Scores = {
      Clarifier: 0,
      Ideator: 0,
      Developer: 0,
      Implementer: 0,
    };

    questions.forEach((q: Question) => {
      let score = answers[q.id] || 0;
      if (q.isNegative) {
        score = 6 - score;
      }
      calculatedScores[q.aptitude] += score;
    });

    setScores(calculatedScores);

    const result = await fetchRecommendations({
      clarifierScore: calculatedScores.Clarifier,
      ideatorScore: calculatedScores.Ideator,
      developerScore: calculatedScores.Developer,
      implementerScore: calculatedScores.Implementer,
    });
    
    if (result.recommendations) {
        setRecommendations(result.recommendations);
    } else {
        setRecommendations(result.error || "Could not retrieve recommendations.");
    }

    setIsLoading(false);
    setShowResults(true);
  };
  
  const handleRetakeTest = () => {
    setAnswers({});
    setScores(null);
    setRecommendations('');
    setShowResults(false);
  }

  const chartData = useMemo(() => {
    if (!scores) return [];
    return (Object.keys(scores) as Aptitude[]).map(key => ({
      name: key,
      score: scores[key],
    }));
  }, [scores]);

  const strongestAptitude = useMemo(() => {
    if (!scores) return '';
    return chartData.reduce((max, item) => item.score > max.score ? item : max, chartData[0]).name;
  }, [scores, chartData]);

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 font-headline">Aptitude Aligner</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra sus aptitudes profesionales y obtenga recomendaciones personalizadas para impulsar su carrera.
          </p>
        </header>

        <Card className="overflow-hidden shadow-lg transition-all duration-500">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Analizando sus respuestas...</p>
            </div>
          ) : showResults ? (
            <AptitudeResults
              scoresData={chartData}
              strongestAptitude={strongestAptitude}
              recommendations={recommendations}
              onRetake={handleRetakeTest}
            />
          ) : (
            <AptitudeForm
              questions={questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmit}
              isAllAnswered={isAllAnswered}
              isLoading={isLoading}
            />
          )}
        </Card>
      </div>
    </main>
  );
}
