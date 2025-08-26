import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trophy } from 'lucide-react';

interface AptitudeResultsProps {
  scoresData: { name: string; score: number }[];
  strongestAptitude: string;
  recommendations: string;
  onRetake?: () => void;
  isAdminView: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-[0.7rem] uppercase text-muted-foreground">
                Aptitud
              </span>
              <span className="font-bold text-muted-foreground">
                {label}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[0.7rem] uppercase text-muted-foreground">
                Puntaje
              </span>
              <span className="font-bold">
                {payload[0].value}
              </span>
            </div>
          </div>
        </div>
      );
    }
  
    return null;
  };

export function AptitudeResults({ scoresData, strongestAptitude, recommendations, onRetake, isAdminView }: AptitudeResultsProps) {
    const formattedRecommendations = recommendations.split('\n').map((line, index) => {
        if (line.trim() === '') return <br key={index} />;
        if (line.startsWith('* ') || line.startsWith('- ')) {
            return <li key={index} className="mb-2">{line.substring(2)}</li>
        }
        if (line.match(/^\d+\.\s/)) {
            return <li key={index} className="mb-2">{line}</li>
        }
        return <p key={index} className="mb-4">{line}</p>;
    });
  
  return (
    <>
      <CardHeader className="text-center p-6">
        <CardTitle className="text-2xl font-bold font-headline">Sus Resultados</CardTitle>
        <CardDescription>
          {isAdminView ? "Estos son los puntajes de aptitud y recomendaciones personalizadas." : "Estas son sus recomendaciones personalizadas basadas en sus respuestas."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary font-headline">
              {isAdminView ? 'Visualización de Puntajes' : 'Aptitud Principal'}
            </h3>
            {isAdminView ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoresData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--muted))'}} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                       {scoresData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.name === strongestAptitude ? 'hsl(var(--accent))' : 'hsl(var(--primary))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-secondary/30 rounded-lg">
                  <Trophy className="h-16 w-16 text-accent mb-4" />
                  <p className="text-lg">Su aptitud más destacada es:</p>
                  <p className="text-2xl font-bold text-accent">{strongestAptitude}</p>
              </div>
            )}
             <div className="flex items-center justify-center space-x-2 rounded-lg bg-accent/10 p-4 border border-accent/20">
                <CheckCircle className="h-6 w-6 text-accent" />
                <p className="text-center text-sm font-medium">
                Su aptitud más fuerte es: <strong className="text-accent">{strongestAptitude}</strong>
                </p>
            </div>
        </div>
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary font-headline">Recomendaciones Personales</h3>
            <div className="prose prose-sm max-w-none text-foreground text-opacity-90 leading-relaxed">
                <ul className="list-disc pl-5 space-y-2">
                    {formattedRecommendations}
                </ul>
            </div>
        </div>
      </CardContent>
       {isAdminView && onRetake && (
            <CardFooter className="p-6 bg-secondary/30">
                <Button onClick={onRetake} variant="outline" className="w-full text-lg py-6">
                Realizar el Test de Nuevo
                </Button>
            </CardFooter>
       )}
       {!isAdminView && (
            <CardFooter className="p-6 text-center flex-col items-center justify-center bg-secondary/30">
                <p className="font-bold text-lg">¡Gracias por completar la evaluación!</p>
                <p className="text-muted-foreground">Sus resultados han sido enviados al administrador.</p>
            </CardFooter>
       )}
    </>
  );
}
