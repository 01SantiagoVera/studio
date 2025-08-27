'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

interface Interview {
    id: string;
    name: string;
    status: 'pending' | 'completed';
    createdAt: Date;
    completedAt?: Date;
}

interface InterviewListProps {
  interviews: Interview[];
  onEdit: (interview: Interview) => void;
}

export default function InterviewList({ interviews, onEdit }: InterviewListProps) {
  const { toast } = useToast();
  
  const sortedInterviews = [...interviews].sort((a, b) => {
    const dateA = a.createdAt || new Date(0);
    const dateB = b.createdAt || new Date(0);
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const handleCopyLink = (id: string) => {
    const interviewUrl = `${window.location.origin}/test/${id}`;
    navigator.clipboard.writeText(interviewUrl);
    toast({ title: 'Copiado', description: 'Enlace copiado al portapapeles.' });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrevistas Realizadas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedInterviews.length > 0 ? (
              sortedInterviews.map(interview => (
                <TableRow key={interview.id}>
                  <TableCell className="font-medium">{interview.name}</TableCell>
                  <TableCell>
                    <Badge variant={interview.status === 'completed' ? 'default' : 'secondary'}>
                      {interview.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {interview.createdAt ? new Date(interview.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {interview.status === 'completed' ? (
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/interview/${interview.id}`}>
                            Ver Resultados
                          </Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => handleCopyLink(interview.id)}>
                                Copiar Enlace
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onEdit(interview)}>
                                Editar
                            </Button>
                        </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No hay entrevistas aún.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}