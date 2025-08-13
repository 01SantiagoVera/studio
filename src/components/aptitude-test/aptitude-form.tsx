import type { Question } from '@/lib/questions';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AptitudeFormProps {
  questions: Question[];
  answers: { [key: number]: number };
  onAnswerChange: (questionId: number, value: string) => void;
  onSubmit: () => void;
  isAllAnswered: boolean;
  isLoading: boolean;
}

export function AptitudeForm({ questions, answers, onAnswerChange, onSubmit, isAllAnswered, isLoading }: AptitudeFormProps) {
  return (
    <>
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-bold font-headline">Cuestionario de Aptitudes</CardTitle>
        <CardDescription>Responda cada pregunta en una escala del 1 al 5, donde 1 es "No me parezco en nada" y 5 es "Me parezco perfectamente".</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id}>
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  {index + 1}. {question.text}
                </Label>
                <RadioGroup
                  onValueChange={(value) => onAnswerChange(question.id, value)}
                  value={answers[question.id]?.toString()}
                  className="flex justify-between items-center pt-2"
                  aria-label={question.text}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex flex-col items-center space-y-2">
                      <Label htmlFor={`q${question.id}-v${value}`} className="text-sm text-muted-foreground">{value}</Label>
                      <RadioGroupItem value={value.toString()} id={`q${question.id}-v${value}`} className="h-6 w-6" />
                    </div>
                  ))}
                </RadioGroup>
              </div>
              {index < questions.length - 1 && <Separator className="mt-6"/>}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-secondary/30">
        <Button
          onClick={onSubmit}
          disabled={!isAllAnswered || isLoading}
          className="w-full text-lg py-6"
          size="lg"
        >
          {isLoading ? 'Analizando...' : 'Calcular Mis Aptitudes'}
        </Button>
      </CardFooter>
    </>
  );
}
