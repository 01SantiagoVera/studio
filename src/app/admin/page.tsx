'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createInterview, getInterviews, updateInterviewName } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import InterviewList from '@/components/admin/interview-list';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const [editingInterview, setEditingInterview] = useState<any>(null);
  const [editingName, setEditingName] = useState('');

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
    } else if (id) {
      const interviewUrl = `${window.location.origin}/test/${id}`;
      setGeneratedUrl(interviewUrl);
      setIsAlertOpen(true);
      setNewName('');
      fetchInterviews();
    }
    setIsLoading(false);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    toast({ title: 'Copiado', description: 'Enlace copiado al portapapeles.' });
  };
  
  const handleOpenEditDialog = (interview: any) => {
    setEditingInterview(interview);
    setEditingName(interview.name);
  };

  const handleUpdateName = async () => {
    if (!editingInterview || !editingName.trim()) return;
    setIsLoading(true);
    const { success, error } = await updateInterviewName(editingInterview.id, editingName);
    if (error) {
      toast({ title: "Error", description: error, variant: 'destructive' });
    } else if (success) {
      toast({ title: 'Éxito', description: 'El nombre ha sido actualizado.' });
      setEditingInterview(null);
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
    <>
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
                {isLoading ? 'Creando...' : 'Crear Enlace'}
              </Button>
            </CardContent>
          </Card>

          <InterviewList interviews={interviews} onEdit={handleOpenEditDialog} />
        </div>
      </main>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enlace de la Entrevista Generado</AlertDialogTitle>
            <AlertDialogDescription>
              Comparte este enlace con el entrevistado. Una vez que completen la prueba, los resultados aparecerán en tu panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
            <code>{generatedUrl}</code>
          </div>
          <AlertDialogFooter>
             <Button variant="outline" onClick={() => setIsAlertOpen(false)}>
              Cerrar
            </Button>
            <AlertDialogAction onClick={handleCopyUrl}>
              Copiar Enlace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={!!editingInterview} onOpenChange={() => setEditingInterview(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Editar Nombre del Entrevistado</DialogTitle>
                <DialogDescription>
                    Actualiza el nombre para esta sesión de entrevista.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Nombre
                    </Label>
                    <Input
                        id="name"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="col-span-3"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setEditingInterview(null)}>Cancelar</Button>
                <Button onClick={handleUpdateName} disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}