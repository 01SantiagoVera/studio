export type Aptitude = 'Clarifier' | 'Ideator' | 'Developer' | 'Implementer';

export interface Question {
  id: number;
  text: string;
  aptitude: Aptitude;
  isNegative: boolean;
}

const aptitudeMapping: { [key: string]: Aptitude } = {
  A: 'Clarifier',
  B: 'Ideator',
  C: 'Developer',
  D: 'Implementer',
};

// Based on user provided sequence: C A D C B A A B C C D C B A B B A D A B A C D D D D A B D C A C B B C D
const rawQuestions = [
  { text: "Me gusta probar y luego revisar mis ideas antes de generar la solución o el producto final.", code: "C" },
  { text: "Me gusta tomarme el tiempo para clarificar la naturaleza exacta del problema.", code: "A" },
  { text: "Disfruto de tomar los pasos necesarios para poner mis ideas en acción.", code: "D" },
  { text: "Me gusta separar un problema amplio en partes para examinarlo desde todos los ángulos.", code: "C" },
  { text: "Tengo dificultad en tener ideas inusuales para resolver un problema.", code: "B", isNegative: true },
  { text: "Me gusta identificar los hechos más relevantes relativos al problema.", code: "A" },
  { text: "No tengo el temperamento para tratar de aislar las causas específicas de un problema.", code: "A", isNegative: true },
  { text: "Disfruto al generar formas únicas de mirar un problema.", code: "B" },
  { text: "Me gusta generar todos los pros y los contras de una solución potencial.", code: "C" },
  { text: "Antes de implementar una solución me gusta separarla en pasos.", code: "C" },
  { text: "Transformar ideas en acción no es lo que disfruto más.", code: "D", isNegative: true },
  { text: "Me gusta superar el criterio que puede usarse para identificar la mejor opción o solución.", code: "C" },
  { text: "Disfruto de pasar tiempo profundizando el análisis inicial del problema.", code: "B" },
  { text: "Por naturaleza, no paso mucho tiempo emocionándome en definir el problema exacto a resolver.", code: "A", isNegative: true },
  { text: "Me gusta entender una situación al mirar el panorama general.", code: "B" },
  { text: "Disfruto de trabajar en problemas mal definidos y novedosos.", code: "B" },
  { text: "Cuando trabajo en un problema me gusta encontrar la mejor forma de enunciarlo.", code: "A" },
  { text: "Disfruto de hacer que las cosas se concreten.", code: "D" },
  { text: "Me gusta enfocarme en enunciar un problema en forma precisa.", code: "A" },
  { text: "Disfruto de usar mi imaginación para producir muchas ideas.", code: "B" },
  { text: "Me gusta enfocarme en la información clave de una situación desafiante.", code: "A" },
  { text: "Disfruto de tomarme el tiempo para perfeccionar una idea.", code: "C" },
  { text: "Me resulta difícil implementar mis ideas.", code: "D", isNegative: true },
  { text: "Disfruto de transformar ideas en bruto en soluciones concretas.", code: "D" },
  { text: "No paso el tiempo en todas las cosas que necesito hacer para implementar una idea.", code: "D", isNegative: true },
  { text: "Realmente disfruto de implementar una idea.", code: "D" },
  { text: "Antes de avanzar me gusta tener una clara comprensión del problema.", code: "A" },
  { text: "Me gusta trabajar con ideas únicas.", code: "B" },
  { text: "Disfruto de poner mis ideas en acción.", code: "D" },
  { text: "Me gusta explorar las fortalezas y debilidades de una solución potencial.", code: "C" },
  { text: "Disfruto de reunir información para identificar el origen de un problema en particular.", code: "A" },
  { text: "Disfruto el análisis y el esfuerzo que lleva transformar un concepto preliminar en una idea factible.", code: "C" },
  { text: "Mi tendencia natural no es generar muchas ideas para los problemas.", code: "B", isNegative: true },
  { text: "Disfruto de usar metáforas y analogías para generar nuevas ideas para los problemas.", code: "B" },
  { text: "Encuentro que tengo poca paciencia para el esfuerzo que lleva pulir o refinar una idea.", code: "C", isNegative: true },
  { text: "Tiendo a buscar una solución rápida y luego implementarla.", code: "D" },
];

export const questions: Question[] = rawQuestions.map((q, i) => ({
  id: i + 1,
  text: q.text,
  aptitude: aptitudeMapping[q.code],
  isNegative: q.isNegative || false,
}));
