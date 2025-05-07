export class CreateBusinessPlanDto {
    UserLocationId: string;   // match schema exactly
    title: string;
    description: string;
    whyItFits: string;
    bonusTip: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timeToProfit: string;       // e.g. “6‑9 months”
    estimatedCost?: number;     // optional in the request
    status?: string;            // optional (“DRAFT”, “ACTIVE”, etc.)
  }
  