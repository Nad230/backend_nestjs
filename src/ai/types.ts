import { BudgetRange, FundingSource, ProjectStatus, ProjectType, RevenueModel, Timeline, Visibility } from "@prisma/client";

export interface AIDetails {
    Type: ProjectType;
    Vision: string;
    RevenueModel: RevenueModel;
    Budget: { Range: BudgetRange; FundingSource?: FundingSource }; // ✅ FundingSource is now an enum
    Timeline: { ExpectedDuration: Timeline }; // ✅ Timeline is now an object
    Team: { Size: string };
    Visibility: Visibility;
    Location: string;
    Status: ProjectStatus;
    aiInsights: JSON;
    Milestones: { Name: string; Status: string }[];
    impact:String;
}
