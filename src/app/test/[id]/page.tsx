'use client';

import { useState, useMemo, useEffect } from 'react';
import { questions, type Aptitude, type Question } from '@/lib/questions';
import { fetchRecommendations, saveInterviewResults, getInterview } from '@/app/actions';
import { AptitudeForm } from '@/components/aptitude-test/aptitude-form';
import { AptitudeResults } from '@/components/aptitude-test/aptitude-results';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Scores = {
  [key in Aptitude]: number;
};

export default function TestPage({ params }: { params: { id: string } }) {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [scores, setScores] = useState<Scores | null>(null);
  const [recommendations, setRecommendations] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [interview, setInterview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInterviewData = async () => {
      setIsLoading(true);
      const { interview: data, error: fetchError } = await getInterview(params.id);
      if (fetchError || !data) {
        setError("La sesión de entrevista no es válida o ha expirado.");
      } else if (data.status === 'completed') {
        setError("Esta entrevista ya ha sido completada.");
      }
      else {
        setInterview(data);
      }
      setIsLoading(false);
    };

    fetchInterviewData();
  }, [params.id]);


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
    
    let finalRecommendations = "Could not retrieve recommendations.";
    if (result.recommendations) {
        finalRecommendations = result.recommendations;
        setRecommendations(finalRecommendations);
    } else if (result.error) {
        setRecommendations(result.error);
    }

    const saveResult = await saveInterviewResults(params.id, calculatedScores, finalRecommendations);
    if(saveResult.error) {
        toast({ title: 'Error', description: 'No se pudieron guardar los resultados.', variant: 'destructive'});
    }


    setIsLoading(false);
    setShowResults(true);
  };

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
  
  if (error) {
      return (
          <main className="container mx-auto px-4 py-8 md:py-12 flex items-center justify-center h-screen">
            <div className="max-w-md mx-auto text-center">
                 <Card className="p-8">
                     <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
                     <p className="text-muted-foreground">{error}</p>
                 </Card>
            </div>
        </main>
      )
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 font-headline">Aptitude Aligner</h1>
           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bienvenido, {interview?.name}. Descubra sus aptitudes profesionales y obtenga recomendaciones personalizadas para impulsar su carrera.
          </p>
        </header>

        <Card className="overflow-hidden shadow-lg transition-all duration-500">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Cargando entrevista...</p>
            </div>
          ) : showResults ? (
            <AptitudeResults
              scoresData={chartData}
              strongestAptitude={strongestAptitude}
              recommendations={recommendations}
              isAdminView={false}
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
