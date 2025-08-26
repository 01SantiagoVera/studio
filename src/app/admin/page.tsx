'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createInterview, getInterviews } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import InterviewList from '@/components/admin/interview-list';

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    } else if (user) {
      fetchInterviews();
    }
  }, [user, loading, router]);

  const fetchInterviews = async () => {
    const { interviews, error } = await getInterviews();
    if (error) {
      toast({ title: "Error", description: error, variant: 'destructive' });
    } else if (interviews) {
      setInterviews(interviews as any);
    }
  };
  
  const handleCreateInterview = async () => {
    if (!newName.trim()) {
      toast({ title: 'Error', description: 'El nombre no puede estar vacío.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const { id, error } = await createInterview(newName);
    if (error) {
      toast({ title: "Error", description: error, variant: 'destructive' });
    } else {
      toast({ title: "Éxito", description: "Entrevista creada. Copie el enlace para el entrevistado." });
      const interviewUrl = `${window.location.origin}/test/${id}`;
      navigator.clipboard.writeText(interviewUrl);
      setNewName('');
      fetchInterviews();
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading || !user) {
    return <div className="flex h-screen w-full items-center justify-center"><p>Cargando...</p></div>;
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Panel de Administrador</h1>
          <Button onClick={handleLogout} variant="outline">Cerrar Sesión</Button>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Crear Nueva Entrevista</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input
              placeholder="Nombre del Entrevistado"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button onClick={handleCreateInterview} disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear y Copiar Enlace'}
            </Button>
          </CardContent>
        </Card>

        <InterviewList interviews={interviews} />
      </div>
    </main>
  );
}
