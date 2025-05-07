import { Injectable } from '@nestjs/common';
import { ExpensesService } from 'src/expenses/expenses.service';
import { SaleService } from 'src/sale/sale.service';
import axios from 'axios';
import * as dayjs from 'dayjs';
import { UserlocationService } from 'src/userlocation/userlocation.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BusinessPlanService } from 'src/business-plan/business-plan.service';
import { AiPlanTask } from '@prisma/client';

@Injectable()
export class ProjectOfflineAiService {
    constructor(
        private readonly saleService: SaleService,
        private readonly expenseService: ExpensesService,
        private readonly userLocationService: UserlocationService,
        private readonly authService: AuthService,
        private readonly businessPlanService: BusinessPlanService,


        private readonly prisma: PrismaService




      ) {}


      async getAiAdvice(
        projectName: string,
        location: string,
        businessType: string,
        userId: string,
        startHour: number,
        endHour: number
      ) {
        const sales = await this.saleService.getTodayTotal(userId);
        const expenses = await this.expenseService.getTodayTotalExpense(userId);
        const profit = sales - expenses;
      
        const now = dayjs();
        const timeNow = now.format('HH:mm');
        const currentHour = now.hour();
        const hoursPassed = currentHour - startHour;
        const hoursLeft = endHour - currentHour;
      
        // Determine mood and context based on performance and time
        const timeStage =
          hoursPassed <= 1
            ? "very early"
            : hoursLeft <= 1
            ? "closing soon"
            : "midday";
      
        const performance =
          profit < 0
            ? "a loss so far"
            : profit < 50
            ? "a slow day"
            : "a decent performance";
      
        const moodOpenings = [
          "Here's what you can try today 👇",
          "Let’s turn this day into a win 💡",
          "Some smart moves you can make now:",
          "Time to step things up 🚀",
          "Make the most of the moment 👇",
        ];
        const selectedOpening = moodOpenings[Math.floor(Math.random() * moodOpenings.length)];
      
        const prompt = `
      Business Name: ${projectName}
      Location: ${location}
      Type: ${businessType}
      
      🕒 It's currently ${timeNow}. The business started at ${startHour}:00 and will close at ${endHour}:00.
      📊 Sales so far: ${sales} TND
      💸 Expenses so far: ${expenses} TND
      💰 Current profit: ${profit} TND
      ⏳ ${hoursPassed} hours have passed (${timeStage}), and there are ${hoursLeft} hours left in the day.
      📈 Performance summary: ${performance}
      
      ${selectedOpening}
      
      Please give creative, short, and very specific advice that a real human coach would give at this moment — tailored to the business type, performance, and time of day.
      
      You can use light humor, encouragement, or constructive suggestions. Avoid repeating the same old advice like "use social media" unless there's a fresh twist to it. Mention performance, remaining hours, or time of day where helpful.
      `;
      
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: "mistralai/mixtral-8x7b-instruct",
            messages: [
              {
                role: 'system',
                content: `You are a smart and creative business coach. You give short, practical, and creative advice tailored to the business's live performance and time of day. Always respond as if you were coaching a real person.`
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY2}`,
              'Content-Type': 'application/json',
            }
          }
        );
      
        const message = response.data?.choices?.[0]?.message?.content?.trim();
        return message || "No advice received.";
      }


      async getCountryInsights(country: string) {
        const prompt = `
      City: ${country}
      
      Please provide a friendly and clear summary for someone planning to start a small business in this country. Answer the following:
      
      1. 💰 What currency is used?
      2. 🗣️ What languages are commonly spoken?
      3. 👷 What are the most popular or in-demand jobs?
      4. ⏰ What is the common daily work schedule (when do people usually start and finish)?
      5. 🌍 What countries are nearby?
      6. 📱 Describe the digital ecosystem: Is e-commerce common? Are delivery apps or mobile money used?
      7. 🧠 Mention any relevant cultural or business habits/trends.
      
      Make the answer warm and practical, as if you’re guiding an entrepreneur new to the region. Use light emojis and short paragraphs for clarity.
        `;
      
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: "mistralai/mixtral-8x7b-instruct",
            messages: [
              {
                role: 'system',
                content: `You are a friendly and practical local business expert. You give useful summaries to entrepreneurs who are exploring a new city. Your tone is warm and informative, and you write in bullet points or short sections for clarity.`
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY2}`,
              'Content-Type': 'application/json',
            }
          }
        );
      
        const message = response.data?.choices?.[0]?.message?.content?.trim();
        return message || "No insights received.";
      }













      async getCityBusinessInsights(city: string, country: string) {
        const prompt = `
      City: ${city}
      Country: ${country}
      
      Please provide a friendly and clear summary for someone planning to start a small business in this city. Answer the following questions based on this **specific city**, not just the country:
      
      1. 🌍 Number of tourists (per year or per season)?
      2. 🏪 Common types of small businesses (cafés, clothing shops, barbershops, etc.)?
      3. 💸 Average cost of rent for a small commercial space (give a rough range in USD)?
      4. 🚦 Are there traffic or commercial zones that affect business activity?
      5. 📍 What are some well-known landmarks that attract people?
      6. 🛍️ What do locals commonly enjoy doing or buying?
      
      Make it easy to read — like a local expert giving business tips. Use light emojis, bullet points, and short paragraphs for clarity. Keep it friendly and practical.
        `;
      
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: "mistralai/mixtral-8x7b-instruct",
            messages: [
              {
                role: 'system',
                content: `You are a friendly and practical local business expert. You give helpful summaries focused on a specific **city**, with insights tailored to someone who wants to start a small business there.`
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY2}`,
              'Content-Type': 'application/json',
            }
          }
        );
      
        const message = response.data?.choices?.[0]?.message?.content?.trim();
        return message || "No insights received.";
      }
     


      async getSmartBusinessSuggestion(userId: string, count: number = 1) {
        const cityObj = await this.userLocationService.getUserCityByUserId(userId);
        const countryObj = await this.userLocationService.getUserCountryByUserId(userId);
      
        const city = cityObj?.city;
        const country = countryObj?.country;
      
        const estimatedBudget = await this.userLocationService.getUserBudgetRangeByUserId(userId);
      
        if (!city || !country) {
          throw new Error("User location not found.");
        }
      
        const [places, cityInsights, countryInsights] = await Promise.all([
          this.userLocationService.getPlaces(userId),
          this.getCityBusinessInsights(city, country),
          this.getCountryInsights(country),
        ]);
      
        const summarizedPlaces = Object.entries(places).map(([category, entries]) => {
          return `• ${category}: ${entries.length} nearby`;
        }).join('\n');
      
        const singlePrompt = `
📍 City: ${city}, ${country}
💰 Estimated Budget: $${estimatedBudget}

🏙️ City Insights:
${cityInsights}

🌍 Country Insights:
${countryInsights}

📌 Nearby Businesses:
${summarizedPlaces}

Now, based on:
- The local economy and culture
- The city’s business environment
- The user’s estimated budget
- The nearby competition and available services

👉 Give me **one** small‑business idea to start *right now*.

Return **exactly** this JSON format (no extra keys, no markdown):

{
  "title": "",
  "description": "",
  "whyItFits": "",
  "bonusTip": "",
  "difficulty": "",          // Easy | Medium | Hard
  "timeToProfit": ""         // e.g. "6‑9 months"
}

Be specific, friendly, and realistic!
`;

const multiplePrompt = `
📍 City: ${city}, ${country}
💰 Estimated Budget: $${estimatedBudget}

🏙️ City Insights:
${cityInsights}

🌍 Country Insights:
${countryInsights}

📌 Nearby Businesses:
${summarizedPlaces}

Now, based on the factors above, suggest the **top ${count}** small‑business ideas to start *right now*.

Return **exactly** this JSON array (no markdown):

[
  {
    "title": "",
    "description": "",
    "whyItFits": "",
    "bonusTip": "",
    "difficulty": "",       // Easy | Medium | Hard
    "timeToProfit": ""      // e.g. "3‑5 months"
  }
]

Number the ideas inside the array from most to least suitable in the order you output them. Be specific, friendly, and realistic!
`;

        const prompt = count === 1 ? singlePrompt : multiplePrompt;
      
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: "mistralai/mixtral-8x7b-instruct",
            messages: [
              {
                role: 'system',
                content: `You are a smart and realistic local business strategist. You help people start the right business for their city, budget, and surroundings. Be specific and helpful, like a mentor who knows the area.`
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY2}`,
              'Content-Type': 'application/json',
            }
          }
        );
      
        const suggestion = response.data?.choices?.[0]?.message?.content?.trim();
        return suggestion || "No suggestion received.";
      }
      

   


      /*async saveAiPlan({
        jobId,
        userId,
        parsed,
        budget
      }: {
        jobId: string;
        userId: string;
        parsed: ReturnType<typeof this.parseActionPlan>;
        budget: number;
      }) {
        return this.prisma.$transaction(tx =>
          tx.startupPlan.create({
            data: {
              jobId,
              userId,
              title: 'Generated Plan',
              budget,
              // 1) Persist all extracted tips
              tips: {
                create: parsed.tips.map(t => ({ title: t.title, content: t.content }))
              },
              // 2) Persist risks
              risks: {
                create: parsed.risks
              },
              // 3) Persist calendar weeks
              calendarWeeks: {
                create: parsed.calendarWeeks
              },
              // 4) Persist AI tasks
              AiPlanTask: {
                create: parsed.stepTasks
              },
              // 5) Persist budget items
              budgetItems: {
                create: parsed.budgetItems
              },
              // 6) Persist minimum budget expenses
              UserExpense: {
                create: parsed.minimumExpenses.map(e => ({
                  title: e.title,
                  amount: e.amount,
                  notes: e.notes,
                  date: new Date()
                }))
              }
            }
          })
        );
      }
*/

    
      

      async extractSections(text: string): Promise<Record<string, string>> {
        const regex = /(?:^|\n)(\d\.\s|[\d]?\.\s?[^\n]*?)(?:\*{0,2}|🛠️|💡|🗓️|⚠️|🎯|💵)[^\n]*\n([\s\S]*?)(?=\n\d\.\s|\n\*{0,2}\d\.\s|$)/g;
        const sections: Record<string, string> = {};
        let match;
      
        while ((match = regex.exec(text)) !== null) {
          const title = match[1].trim();
          const content = match[2].trim();
          sections[title] = content;
        }
      
        return sections;
      }
      
      async normalizeBullets(text: string): Promise<string[]> {
        return text
          .split('\n')
          .map(line => line.trim().replace(/^[-*•]\s*/, '')) // remove bullet characters
          .filter(line => line.length > 0); // remove empty lines
      }
      
      async formatStepByStep(raw: string): Promise<
      {
        dayNumber: string;
        title: string;
        description: string;
      }[]
    > {
      const lines = raw.split('\n').map(line => line.trim()).filter(Boolean);
      const headerPattern = /^(\*{0,2})?Day\s*(\d+)(?:\s*[-–to]+\s*(\d+))?:?\s*(.*?)(\*{0,2})?$/i;
    
      const tasks: {
        dayNumber: string;
        title: string;
        description: string;
      }[] = [];
    
      let currentDayNumber = '';
      let currentTitle = '';
      let currentDescription: string[] = [];
    
      for (const line of lines) {
        const match = line.match(headerPattern);
    
        if (match) {
          // Save the previous task before starting a new one
          if (currentDayNumber || currentDescription.length) {
            tasks.push({
              dayNumber: currentDayNumber,
              title: currentTitle,
              description: currentDescription.join('\n').trim()
            });
          }
    
          const [, , startDay, endDay, titleRaw] = match;
          currentDayNumber = endDay ? `${startDay}–${endDay}` : startDay;
          currentTitle = titleRaw?.trim() || '';
          currentDescription = [];
        } else {
          currentDescription.push(line);
        }
      }
    
      // Push the last section
      if (currentDayNumber || currentDescription.length) {
        tasks.push({
          dayNumber: currentDayNumber,
          title: currentTitle,
          description: currentDescription.join('\n').trim()
        });
      }
    
      return tasks;
    }
    
      
    async formatBudgetStrategy(raw: string): Promise<{ name: string; suggestedCost: number; notes?: string }[]> {
      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
      const items: { name: string; suggestedCost: number; notes?: string }[] = [];
    
      let i = 0;
      let counter = 1;
    
      while (i < lines.length) {
        const line = lines[i];
    
        // Case 1: Two-line format (e.g., title + number line)
        const titleMatch = line.match(/^\*{1,3}-?\s*(.+?)\*{1,3}$/);
        if (titleMatch) {
          const name = titleMatch[1].trim();
          const nextLine = lines[i + 1] || '';
          const numberMatch = nextLine.replace(/[^0-9.]/g, '');
          const suggestedCost = parseFloat(numberMatch);
    
          if (!isNaN(suggestedCost)) {
            items.push({ name, suggestedCost });
            i += 2;
            continue;
          }
        }
    
        // Case 2: Single-line with cost embedded
        const inlineMatch = line.match(/\$?(\d+(?:\.\d+)?)/);
        if (inlineMatch) {
          const suggestedCost = parseFloat(inlineMatch[1]);
          if (!isNaN(suggestedCost)) {
            items.push({
              name: `Item ${counter++}`,
              suggestedCost,
              notes: line
            });
          }
        }
    
        i++;
      }
    
      return items;
    }
    async formatLaunchCalendar(raw: string): Promise<{ weekNumber: number; summary: string }[]> {
      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
      const weeks: { weekNumber: number; summary: string }[] = [];
    
      let currentWeek: number | null = null;
      let currentSummary: string[] = [];
    
      for (const line of lines) {
        // Match lines like "**Week 1:**", "Week 1 -", "*Week 1*", etc.
        const match = line.match(/(?:\*+)?\s*Week\s*(\d+)\s*[:\-–]?\s*(.*)/i);
        
        if (match) {
          // Save previous week if exists
          if (currentWeek !== null) {
            weeks.push({
              weekNumber: currentWeek,
              summary: currentSummary.join(' ')
            });
          }
    
          currentWeek = parseInt(match[1], 10);
          const summaryStart = match[2]?.trim();
          currentSummary = summaryStart ? [summaryStart] : [];
        } else if (currentWeek !== null) {
          currentSummary.push(line);
        }
      }
    
      // Push last week
      if (currentWeek !== null) {
        weeks.push({
          weekNumber: currentWeek,
          summary: currentSummary.join(' ')
        });
      }
    
      return weeks;
    }
    
      
      
      
    async formatRisks(raw: string): Promise<
  {
    risk: string;
    mitigation: string;
  }[]
> {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);

  const risks: {
    risk: string;
    mitigation: string;
  }[] = [];

  for (const line of lines) {
    const match = line.match(/^(.+?):\s*(.+)$/); // Match everything before ":" as risk, after as mitigation
    if (match) {
      const [, risk, mitigation] = match;
      risks.push({
        risk: risk.trim(),
        mitigation: mitigation.trim()
      });
    }
  }

  return risks;
}

      
      
      
async formatTips(raw: string): Promise<{ content: string }[]> {
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      // Remove leading "- " if present
      const cleaned = line.replace(/^[-•]\s*/, '');
      return { content: cleaned };
    });
}

      
      async formatMinimumBudget(raw: string): Promise<string> {
        return raw.trim();
      }
      

     
      


      async formatActionPlan(rawPlan: string, userId: string, startupPlanId: string) {
        const sections = {
          stepByStep: '',
          budgetStrategy: '',
          launchCalendar: '',
          risks: '',
          bonusTip: '',
          minimumBudget: ''
        };
      
        const cityObj = await this.userLocationService.getUserCityByUserId(userId);
      
        const sectionRegex = /\*\*([0-9]+)\. (.*?)\*\*\n([\s\S]*?)(?=(\*\*[0-9]+\.)|$)/g;
      
        let match;
        while ((match = sectionRegex.exec(rawPlan)) !== null) {
          const [, , title, content] = match;
          const trimmedTitle = title.trim();
      
          if (trimmedTitle === '🛠️ Step-by-step Action Plan for Launch/Growth') {
            sections.stepByStep = content.trim();
            const cleanTasks = await this.formatStepByStep(sections.stepByStep);
            console.log('Parsed tasks:', cleanTasks);
          
            // Optional: Save to database
            for (const task of cleanTasks) {
              await this.prisma.aiPlanTask.create({
                data: {
                  startupPlanId,
                  dayNumber: task.dayNumber,
                  title: task.title,
                  description: task.description,
                  completed: false
                }
              });
            }
      
          } else if (trimmedTitle === '💡 Smart Budget Strategy') {
            sections.budgetStrategy = content.trim();
          
            const cleanBudgetItems = await this.formatBudgetStrategy(sections.budgetStrategy);
            console.log('Parsed budget items:', cleanBudgetItems);
          
            for (const item of cleanBudgetItems) {
              await this.prisma.budgetItem.create({
                data: {
                  startupPlanId,
                  name: item.name,
                  suggestedCost: item.suggestedCost,
                  actualCost: null,
                  notes: item.notes ?? null
                }
              });
            }
            
                    
          }  else if (trimmedTitle === '🗓️ 30-Day Launch Calendar') {
            sections.launchCalendar = content.trim();
          
            const cleanCalendar = await this.formatLaunchCalendar(sections.launchCalendar);
            console.log('Parsed calendar weeks:', cleanCalendar);
          
            for (const week of cleanCalendar) {
              await this.prisma.calendarWeek.create({
                data: {
                  startupPlanId,
                  weekNumber: week.weekNumber,
                  summary: week.summary
                }
              });
            }
                    
      
          } else if (trimmedTitle === '⚠️ Main Risks and How to Avoid Them') {
            sections.risks = content.trim();
            const riskList = await this.formatRisks(sections.risks);
            console.log('Parsed risks:', riskList);
          
            for (const r of riskList) {
              await this.prisma.risk.create({
                data: {
                  startupPlanId,
                  risk: r.risk,
                  mitigation: r.mitigation
                }
              });}
      
          } else if (trimmedTitle.startsWith('🎯 Bonus Tip')) {
            sections.bonusTip = content.trim();
            const cleanTips = await this.formatTips(sections.bonusTip);
            console.log('Parsed tips:', cleanTips);
            
            for (const tip of cleanTips) {
              await this.prisma.tip.create({
                data: {
                  startupPlanId,
                  content: tip.content,
                }
              });
            }
            
          } else if (trimmedTitle === '💵 Minimum Budget Estimation') {
            sections.minimumBudget = content.trim();
            const cleanTextMin = this.formatMinimumBudget(sections.minimumBudget);
            console.log('hahi emchi min', cleanTextMin);
          }
        }
      
        return sections;
      }
      
     
      
      
      
      




      async generateBusinessActionPlan(userId: string,budget:number,BusinessesId?: string) {
        const cityObj = await this.userLocationService.getUserCityByUserId(userId);
        const countryObj = await this.userLocationService.getUserCountryByUserId(userId);
        const nearbyPlaces= await     this.userLocationService.getPlaces(userId);
        if (!BusinessesId) {
          throw new Error("Business ID is required.");
        }
        
        const selectedIdea = await this.businessPlanService.getByBusinessId(BusinessesId);
        

if (!selectedIdea) {
  throw new Error("No business idea found with this ID.");
}

if (!selectedIdea.title || !selectedIdea.description || !selectedIdea.difficulty) {
  throw new Error("Selected business idea is incomplete.");
}


              
        const city = cityObj?.city;
        const country = countryObj?.country;
      
        if (!city || !country) {
          throw new Error("User location not found.");
        }
        if (!budget || budget <= 0) {
          throw new Error("User budget is missing or zero. Please set your available budget first.");
        }
      
        let nearbyPlacesFormatted = '';

        if (nearbyPlaces && Object.keys(nearbyPlaces).length > 0) {
          // Flatten the nearby places
          const flatPlaces = Object.entries(nearbyPlaces)
            .flatMap(([category, places]) => 
              places.map(place => ({
                name: place.name,
                type: category,
                address: place.address,
              }))
            );
        
          const nearbyList = flatPlaces
            .slice(0, 10) // Limit to 10 entries for the prompt
            .map(place => `- ${place.name} (${place.type})`)
            .join('\n');
        
          nearbyPlacesFormatted = `
        🔎 Nearby Similar Businesses:
        ${nearbyList}
        
        Please advise the user to physically visit these locations during busy times (weekends, afternoons).
        - Check foot traffic.
        - Observe competitor quality.
        - Confirm if businesses are still active.
        - Check general customer interest.
          `;
        }
        
        const prompt = `
📍 City: ${city}, ${country}
💰 Available Budget: $${budget}
🚀 Selected Business Idea: ${selectedIdea.title}
📖 Description: ${selectedIdea.description}
⚡ Difficulty Level: ${selectedIdea.difficulty}

Now, based on the user's idea, available budget, and city:

You are an expert business mentor helping beginners start from scratch and make their first income as fast as possible.

Please create an ultra-practical, detailed action plan.

Organize your response into clear sections:

1. 🛠️ Step-by-step Action Plan for Launch/Growth
   - Organize the steps using day-by-day format (e.g., Day 1, Day 2–3, etc.).
   - Break it into small, realistic steps.
   - Mention tools, websites, or apps to use.
   - Suggest first actions to get first income or improvement.
   - Give examples when possible (like what to say to a business owner).

2. 💡 Smart Budget Strategy
   - Detailed budget breakdown (where each dollar goes).
   - Prioritize free or cheap options first.
   - How to spend wisely, free or cheap options first.

3. 🗓️ 30-Day Launch Calendar

   - Week-by-week what the user should do.
   -Summarize the user’s tasks week by week (e.g., Week 1 Summary, Week 2 Summary, etc.), showing what they should focus on.

4. ⚠️ Main Risks and How to Avoid Them

5. 🎯 Bonus Tip for Extra Success in ${city}

6. 💵 Minimum Budget Estimation
   - Estimate the realistic minimum startup cost needed for this business idea in ${city}.
   - If the user's available budget is enough, proceed normally.
   - If not, explain how much more money is needed, and suggest either:
     - A minimalist cheaper version.
     - Or saving options and realistic timeline.

Tone: Friendly, motivating, realistic.
Format: Clear bullet points and short paragraphs.

Important:
- Be friendly, motivating, realistic.
- Assume the user has no experience but is highly motivated.
- Focus on fast execution, real-world actions, and cash flow generation.
`;

        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: "mistralai/mixtral-8x7b-instruct",
            messages: [
              {
                role: 'system',
                content: `You are an expert business mentor. You help people create realistic action plans to launch and grow small businesses, adapted to their city, budget, and idea.`
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY2}`,
              'Content-Type': 'application/json',
            }
          }
        );
      
        const actionPlan = response.data?.choices?.[0]?.message?.content?.trim();
        console.log(actionPlan)

        if (!actionPlan) {
          throw new Error("No action plan generated by AI.");
        }
        const startupPlan = await this.prisma.startupPlan.create({
          data: {
            userId,
            title: selectedIdea.title,
            jobId: selectedIdea.id,
            budget,
          },
        });
        
        const startupPlanId = startupPlan.id;
        


      
        const sections = await this.formatActionPlan(actionPlan,userId,startupPlanId);

       
        console.log(sections)
        
      
        return actionPlan || "No action plan generated.";
      
      }
      

   
      


     /* async getNearbyPlaces({ lat, lng }: { lat: number; lng: number }) {
        const llParam = `@${lat},${lng},14z`;
        const params = {
          engine: 'google_maps',
          type: 'search',
          q: 'businesses',
          ll: llParam,
          hl: 'en',
          api_key: process.env.SERP_API_KEY,
        };
      
        try {
          const response = await axios.get('https://serpapi.com/search', { params });
          const formatted = this.formatNearbyPlaces(response.data);
          return formatted;
        } catch (err: any) {
          console.error('Failed to fetch places:', err.response?.data || err.message);
          return [];
        }
      }
      async formatNearbyPlaces(data: any) {
        if (!data || !data.local_results) return [];
      
        return data.local_results.map((biz: any) => ({
          name: biz.title || '',
          types: biz.types || [],
          rating: biz.rating || 0,
          reviews: biz.reviews || 0,
          address: biz.address || '',
          phone: biz.phone || '',
          website: biz.website || '',
          isOpenNow: biz.open_state || 'Unknown',
          hours: biz.hours || '',
          operatingHours: biz.operating_hours || {},
          location: biz.gps_coordinates || { latitude: null, longitude: null },
          image: biz.thumbnail || '',
        }));
      }
      */
      
      


      async  getLinkedInSearchQuery(skills: string[], city: string, country: string, experienceLevel: string) {
        const prompt = `
The user is looking for jobs on LinkedIn.

Here is their data:
- Skills: ${skills.join(', ')}
- Location: ${city}, ${country}
- Experience Level: ${experienceLevel}

Your task:
1. Suggest 3 real-world job titles this user should search for.
2. For each title, generate a working LinkedIn search URL (use title, location, and experience).
3. Recommend any useful filters (like Entry Level, Remote, etc.).
4. Format like this:

- 💼 Job Title: ...
- 🔗 LinkedIn Link: ...
- 🧰 Filters: ...

Keep it short, and make sure links work.
`;

        try {
          console.log("🧠 Prompt sent to OpenRouter:\n", prompt);
      
          const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
              model: "openai/gpt-3.5-turbo",
              messages: [
                {
                  role: 'system',
                  content: `You are a helpful job search assistant focused on LinkedIn. You help users build effective search queries and filter combinations.`
                },
                {
                  role: 'user',
                  content: prompt
                }
              ]
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY2}`,
                'Content-Type': 'application/json',
              }
            }
          );
      
          console.log("✅ Response from OpenRouter:\n", JSON.stringify(response.data, null, 2));
      
          const result = response.data?.choices?.[0]?.message?.content?.trim();
          return result || "No search query generated.";
        } catch (error) {
          console.error("❌ Error from OpenRouter:", error?.response?.data || error.message);
          return "Failed to fetch LinkedIn search query.";
        }
      }


      async  getJobListingsFromSerpApi(
        skills: string,
        location: string,
        experienceLevel: string
      ): Promise<any[]> {
        const apiKey = process.env.SERP_API_KEY;
      
        const skillList = skills.split(',').map(s => s.trim()).join(' ');
        const query = `${skillList} ${experienceLevel} developer`;
      
        console.log('Sending query:', query, 'at location:', location);
      
        const params = {
          engine: "google_jobs",
          q: query,
          location,
          api_key: apiKey,
        };
      
        try {
          const response = await axios.get("https://serpapi.com/search", { params });
          const jobs = response.data.jobs_results || [];
      
          return jobs.slice(0, 5).map(job => ({
            title: job.title,
            company: job.company_name,
            location: job.location,
            description: job.description,
            link: job.related_links?.[0]?.link || '',
          }));
        } catch (error) {
          console.error("Error fetching job listings:", error.message);
          return [];
        }
      }




      async getJobsBySkill(skill: string, country: string, continent: string, userId: string) {
        const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(skill)}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          const jobs = data.jobs;
    
          const countryLower = country?.toLowerCase() || "";
          const continentLower = continent?.toLowerCase() || "";
    
          const filteredJobs = jobs.filter((job) => {
            const location = job.candidate_required_location?.toLowerCase() || "";
    
            return (
              location.includes("worldwide") ||
              location.includes(countryLower) ||
              location.includes(continentLower)
            );
          });
          const stripHtml = (html: string) => {
            return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          };
          
    
          for (const job of filteredJobs) {
            const existing = await this.prisma.aiJob.findUnique({
              where: { url: job.url },
            });
    
            if (!existing) {
              const plainDescription = stripHtml(job.description || "");
          
              await this.prisma.aiJob.create({
                data: {
                  userId,
                  url: job.url,
                  title: job.title,
                  companyName: job.company_name,
                  companyLogo: job.company_logo || null,
                  category: job.category || null,
                  tags: job.tags || [],
                  jobType: job.job_type || null,
                  publicationDate: new Date(job.publication_date),
                  candidateRequiredLocation: job.candidate_required_location || null,
                  salary: job.salary || null,
                  description: plainDescription,
                },
              });
            }
          }
    
          return filteredJobs;
        } catch (error) {
          console.error("Error fetching jobs by skill:", error);
          return [];
        }
      }



      async getAiJobsByUser(userId: string) {
        try {
          const jobs = await this.prisma.aiJob.findMany({
            where: { userId },
            orderBy: { publicationDate: 'desc' },
          });
      
          return jobs;
        } catch (error) {
          console.error("Error retrieving AI jobs:", error);
          return [];
        }
      }

      async getAiJobById(jobId: string) {
        try {
          const job = await this.prisma.aiJob.findUnique({
            where: { id: jobId },
          });
      
          return job;
        } catch (error) {
          console.error("Error retrieving AI job by ID:", error);
          return null;
        }
      }
      

      async getChosedAiJobsByUser(userId: string) {
        try {
          const jobs = await this.prisma.aiJob.findMany({
            where: {
              userId,
              chosed: true,
            },
            orderBy: {
              publicationDate: 'desc',
            },
          });
      
          return jobs;
        } catch (error) {
          console.error("Error retrieving chosed AI jobs:", error);
          return [];
        }
      }
      
      

      async getRemoteOkJobs(skill: string, country: string, continent: string) {
  const url = `https://remoteok.com/api`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0', 
      },
    });

    const data = await response.json();

    const jobs = data.slice(1);

    const skillLower = skill.toLowerCase();
    const countryLower = country?.toLowerCase() || "";
    const continentLower = continent?.toLowerCase() || "";

    const filteredJobs = jobs.filter((job) => {
      const position = job.position?.toLowerCase() || job.title?.toLowerCase() || "";
      const location = job.location?.toLowerCase() || "";

      const matchesSkill = position.includes(skillLower);
      const matchesLocation =
        location.includes("worldwide") ||
        location.includes(countryLower) ||
        location.includes(continentLower);

      return matchesSkill && matchesLocation;
    });

    // Normalize the result to match Remotive format (optional)
    const normalizedJobs = filteredJobs.map((job) => ({
      id: job.id,
      url: job.url,
      title: job.position || job.title,
      company_name: job.company || "Unknown",
      company_logo: job.logo || "",
      category: job.tags?.[0] || "",
      tags: job.tags || [],
      job_type: job.type || "Full-time",
      publication_date: job.date || new Date().toISOString(),
      candidate_required_location: job.location || "",
      salary: job.salary || "",
      description: job.description || "",
    }));

    return normalizedJobs;
  } catch (error) {
    console.error("Error fetching jobs from Remote OK:", error);
    return [];
  }
}





async updateAiJobStatusAndChosed(aiJobId: string, status: string, chosed: boolean) {
  try {
    const updatedAiJob = await this.prisma.aiJob.update({
      where: { id: aiJobId },
      data: {
        status,
        chosed,
      },
    });
    return updatedAiJob;
  } catch (error) {
    console.error('Error updating aiJob:', error);
    throw new Error('Failed to update aiJob.');
  }
}


      
      
async generateInterviewQuestions(description: string, tags: string[]) {
  try {
    const prompt = `
You are an expert technical recruiter coaching a candidate right before an interview.

Given the following information:
- 📄 Job Description: ${description}
- 🏷️ Relevant Tags/Skills: ${tags.join(', ')}

👉 Please generate the most likely interview questions the candidate will be asked.

For each question:
- Provide **three practical steps** coaching how the candidate should answer it. (e.g., "Start by...", "Mention...", "Finish by...")
- Also give an **example phrase** the candidate can use to **start their answer confidently**.
- Focus on **concrete**, **motivational**, and **interviewer-impressing** advice.
- Pretend you are speaking directly to the candidate, seconds before they enter the interview.

Format the result strictly as a JSON array like:
[
  {
    "question": "The interview question?",
    "answerAdvice": {
      "steps": [
        "First advice step",
        "Second advice step",
        "Third advice step"
      ],
      "examplePhrase": "Example first sentence the candidate can use to start answering."
    }
  },
  ...
]
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          {
            role: 'system',
            content: 'You are an experienced technical recruiter helping candidates prepare for interviews.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY2}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const aiResponse = response.data?.choices?.[0]?.message?.content?.trim();

    try {
      const questions = JSON.parse(aiResponse);
      return questions;
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", aiResponse);
      return [];
    }
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return [];
  }
}




async generateLocalBusinessActionPlan(userId: string) {
  const budget = await this.businessPlanService.getBudgetRangeByUserId(userId);
  const country = await this.businessPlanService.getCountryByUserId(userId);
  const city = await this.businessPlanService.getCityByUserId(userId);
  const details = await this.businessPlanService.getDescriptionAndTitleByUserId(userId);

  if (!budget || budget <= 0) {
    throw new Error("User budget is missing or zero. Please set your available budget first.");
  }

  if (!city || !country) {
    throw new Error("User location not found.");
  }

  if (!details || (!details.projectName && !details.description)) {
    throw new Error("Project name or description missing.");
  }

  const nearbyPlaces = await this.userLocationService.getPlaces(userId);

  let nearbyPlacesFormatted = '';
  if (nearbyPlaces && Object.keys(nearbyPlaces).length > 0) {
    const flatPlaces = Object.entries(nearbyPlaces)
      .flatMap(([category, places]) =>
        places.map(place => ({
          name: place.name,
          type: category,
          address: place.address,
        }))
      );

    const nearbyList = flatPlaces
      .slice(0, 10)
      .map(place => `- ${place.name} (${place.type})`)
      .join('\n');

    nearbyPlacesFormatted = `
🔎 Nearby Similar Businesses:
${nearbyList}

Please advise the user to physically visit these locations during busy times (weekends, afternoons).
- Check foot traffic.
- Observe competitor quality.
- Confirm if businesses are still active.
- Check general customer interest.
`;
  }

  const prompt = `
📍 City: ${city}, ${country}
💰 Available Budget: $${budget}
🚀 Existing Business Concept: ${details.projectName || 'No Title'}
📖 Description: ${details.description || 'No Description'}

Now, based on the user's real business idea, available budget, and location:

You are an expert business mentor helping real business owners launch or grow their small business fast with practical steps.

Please create an ultra-practical, detailed action plan.

Organize your response into clear sections:

1. 🛠️ Step-by-step Action Plan for Launch/Growth
   - Organize the steps using day-by-day format (e.g., Day 1, Day 2–3, etc.).
   - Break it into small, realistic steps.
   - Mention tools, websites, or apps to use.
   - Suggest first actions to get first income or improvement.
   - Give examples when possible (like what to say to a business owner).


2. 💡 Smart Budget Strategy
   - Detailed budget breakdown.
   - Prioritize free or cheap options first.

3. 🗓️ 30-Day Growth Calendar
   - Week-by-week actions.

4. ⚠️ Main Risks and How to Avoid Them

5. 🎯 Bonus Tip for Extra Success in ${city}

6. 💵 Minimum Budget Estimation
   - Estimate if user's current budget is enough.
   - If not, suggest:
     - A cheaper version.
     - Or ways to get extra funding.

${nearbyPlacesFormatted}

Tone: Friendly, motivating, realistic.
Format: Clear bullet points and short paragraphs.
`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: "mistralai/mixtral-8x7b-instruct",
      messages: [
        {
          role: 'system',
          content: `You are an expert business mentor. You help people create realistic action plans to launch and grow small businesses, adapted to their city, budget, and idea.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY2}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const actionPlan = response.data?.choices?.[0]?.message?.content?.trim();
  console.log(actionPlan)

  if (!actionPlan) {
    throw new Error("No action plan generated by AI.");
  }
  const startupPlan = await this.prisma.startupPlan.create({
    data: {
      userId,
      title: details.projectName ?? '',
      BusinessId: details.id,
      budget,
    },
  });
  
  const startupPlanId = startupPlan.id;
  



  const sections = await this.formatActionPlan(actionPlan,userId,startupPlanId);

 
  console.log(sections)
  

  return actionPlan || "No action plan generated.";
}




      
      
    }      