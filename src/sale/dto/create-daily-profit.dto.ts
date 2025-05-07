// dto/create-daily-profit.dto.ts
export class CreateDailyProfitDto {
    userId: string;
    date: Date;
    revenue: number;
    expenses: number;
    profit: number;
    timeWorked:number;
    day:string
  }
  