'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';

interface Interview {
    id: string;
    name: string;
    status: 'pending' | 'completed';
    createdAt: any;
    completedAt?: any;
}

interface InterviewListProps {
  interviews: Interview[];
}

export default function InterviewList({ interviews }: InterviewListProps) {
  const sortedInterviews = [...interviews].sort((a, b) => {
    const dateA = a.createdAt?.toDate() || new Date(0);
    const dateB = b.createdAt?.toDate() || new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

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
              <TableHead>Acciones</TableHead>
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
                    {interview.createdAt ? new Date(interview.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm" disabled={interview.status !== 'completed'}>
                      <Link href={`/admin/interview/${interview.id}`}>
                        Ver Resultados
                      </Link>
                    </Button>
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
