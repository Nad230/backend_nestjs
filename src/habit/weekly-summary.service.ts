// src/habit/weekly-summary.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai'; // ✅ Correct import in v4+

import { HabitService } from './habit.service';

@Injectable()
export class WeeklySummaryService {
  private openai: OpenAI;

  constructor(private readonly habitService: HabitService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateWeeklySummary(userId: string): Promise<string> {
    const habits = await this.habitService.getWeeklyHabitData(userId);

    const prompt = `
Voici les données hebdomadaires de l'utilisateur : 
${JSON.stringify(habits, null, 2)}

Génère un résumé professionnel et motivant de la semaine, et donne 2 ou 3 conseils personnalisés pour s'améliorer. Termine avec une citation entrepreneuriale motivante.
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4', // Or 'gpt-3.5-turbo' if you don’t have GPT-4 access
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
    });

    return response.choices[0].message.content || '';
  }
}
