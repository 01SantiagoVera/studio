'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getInterview } from '@/app/actions';
import { AptitudeResults } from '@/components/aptitude-test/aptitude-results';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { type Aptitude } from '@/lib/questions';

type Scores = {
  [key in Aptitude]: number;
};

interface Interview {
    id: string;
    name: string;
    scores: Scores;
    recommendations: string;
    status: 'pending' | 'completed';
    createdAt: Date;
    completedAt?: Date;
}


export default function InterviewDetailsPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user && params.id) {
        const fetchInterview = async () => {
            setIsLoading(true);
            const { interview: data, error } = await getInterview(params.id);
            if (error) {
                console.error(error);
                // Handle error
            } else {
                setInterview(data as Interview);
            }
            setIsLoading(false);
        };
        fetchInterview();
    }
  }, [user, params.id]);

  const chartData = useMemo(() => {
    if (!interview?.scores) return [];
    return (Object.keys(interview.scores) as Aptitude[]).map(key => ({
      name: key,
      score: interview.scores[key],
    }));
  }, [interview]);

  const strongestAptitude = useMemo(() => {
    if (!chartData.length) return '';
    return chartData.reduce((max, item) => item.score > max.score ? item : max, chartData[0]).name;
  }, [chartData]);


  if (loading || isLoading || !user) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  if (!interview) {
      return <div className="text-center py-12">Entrevista no encontrada.</div>
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <Button asChild variant="outline">
                    <Link href="/admin">
                        &larr; Volver a la lista
                    </Link>
                </Button>
                <div className="text-center mt-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Resultados de {interview.name}</h1>
                    <p className="text-lg text-muted-foreground">
                        {interview.status === 'completed' && interview.completedAt ? `Completado el ${new Date(interview.completedAt).toLocaleString()}` : 'Pendiente'}
                    </p>
                </div>
            </header>

            <Card className="overflow-hidden shadow-lg">
                {interview.status === 'completed' && interview.scores && interview.recommendations ? (
                    <AptitudeResults
                        scoresData={chartData}
                        strongestAptitude={strongestAptitude}
                        recommendations={interview.recommendations}
                        isAdminView={true}
                    />
                ) : (
                    <CardContent className="p-16 text-center">
                        <p className="text-muted-foreground">El entrevistado aún no ha completado la prueba o los datos no están disponibles.</p>
                    </CardContent>
                )}
            </Card>
        </div>
    </main>
  );
}
