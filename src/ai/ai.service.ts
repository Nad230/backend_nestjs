import axios from "axios";
import { Injectable, ForbiddenException, NotFoundException, InternalServerErrorException } from "@nestjs/common";

import { PrismaService } from '../prisma/prisma.service';
import { ProjectService } from '../project/project.service';
import { MilestoneService } from '../milestone/milestone.service';
import { TaskService } from '../task/task.service';


@Injectable()
export class AIService {
  
  private readonly API_URL ="https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

  private readonly HF_API_KEY = process.env.HF_API_KEY;

  constructor(
    private prisma: PrismaService,
    private projectService: ProjectService,
    private milestoneService: MilestoneService,
    private taskService: TaskService,
  ) {}

  // Check if user has an AI-eligible package
  private async validatePackage(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { packageType: true },
    });
    

    if (!user || (user.packageType !== 'GOLD' && user.packageType !== 'DIAMOND')) {
      throw new ForbiddenException('AI features are available only for GOLD and DIAMOND users.');
    }
  }



  async assistProjectDetails(userId: string, projectData: { name: string; description: string }) {
    await this.validatePackage(userId);  // Ensure user has access

    const prompt = this.generatePrompt(projectData);
  
    try {
      const response = await axios.post(
        this.API_URL,
        { inputs: prompt },
        { headers: { Authorization: `Bearer ${this.HF_API_KEY}` } }
      );
  
      console.log("AI Raw Response:", response.data); // Debugging log
  
      const formattedResponse = this.formatAIResponse(response.data);
      console.log("Formatted AI Response:", formattedResponse); // Debugging log
  
      return formattedResponse;
    } catch (error) {
      console.error('Error calling AI:', error.response?.data || error.message);
      throw new Error('AI assistant failed to generate project details.');
    }
  }
  
  private generatePrompt(projectData: { name: string; description: string }): string {
    
    return `Project Name: ${projectData.name}
    
    Description: ${projectData.description}

    Based on this information, predict the following fields:
    - Type (e.g., Personal, Business, Startup)
    - VisionImpact (Summary of long-term goals and the impact of it)
    - Revenue Model (e.g., Freemium, Subscription, One-time Purchase)
    - Budget (Estimated range)
    - Timeline (Expected duration)
    - Team (e.g., Solo, Small Team, Large Team)
    - Visibility (Public or Private)
    - Location (Global, Regional, or Specific Country)
    - Status (Planning, In Progress, Completed)
    - Funding Source (e.g., Bootstrapped, Investors)
    - Tags (e.g., Mobile, Web, Education, Art, Freelancing)
    - Collaborations (Specify if you're open to working with others. If yes, mention the type of collaboration.)
    - CompletionDate ( refers to a date property that represents when a project is expected to finish. Think of it as a target deadline for the entire project, calculated based on milestones, tasks, and resource availability.)
    - MainGoal (the main goal of this project the propose of it exicet
    - StrategyModel (🚀 Learn Startup Best for: Entrepreneurs, startups, and makers launching new ideas.
        Focus: Rapid experimentation, minimal viable products (MVPs), and customer feedback loops.
        AI Role: Suggests quick iterations, prioritizes validation, and reduces waste.
        ⚡ Agile Sprint Best for: Teams or individuals working in short, focused development cycles.
        Focus: Breaking work into sprints, continuously improving with feedback.
        AI Role: Helps create sprint cycles, prioritize backlog items, and optimize workflow.
        🎯 MVP Focus Best for: Solo founders or small teams aiming to launch a Minimum Viable Product (MVP).
        Focus: Shipping a core product fast, with only the essential features.
        AI Role: Suggests feature priorities, helps remove unnecessary complexity, and keeps focus on launch.
        🛠 Custom PlanBest for: Users with unique needs who want a fully personalized implementation plan.
        Focus: User-defined workflow, deadlines, and milestones.
        AI Role: Assists in structuring the plan while giving full control to the user.
)
    Please ensure the response includes all the requested fields. 

    Respond in JSON format.`;
}


  formatAIResponse(responseData: any) {
    if (!responseData || !responseData[0] || !responseData[0].generated_text) {
      return { message: "AI could not generate structured details" };
    }
  
    const rawText = responseData[0].generated_text;
    console.log("Raw AI Text:", rawText); // Debugging log
  
    // Extract JSON from response (find the text between ``` and ``` or { and })
    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawText.match(/{[\s\S]*}/)?.[0];
  
    if (!jsonString) {
      return { message: "AI could not generate structured details" };
    }
  
    try {
      const parsedJson = JSON.parse(jsonString);
      return parsedJson;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return { message: "AI response could not be processed" };
    }
  }



  /*///////////////////////////////////////////////////////////////////////////////////////////////////////////*/


  async generateProjectRoadmap(
    userId: string,
    projectId: string,
    projectData: {
      name: string;
      description: string;
      type: string;
      visionImpact: string;
      revenueModel: string;
      budget: string;
      timeline: string;
      team: string;
      teamType: string;
      visibility: string;
      location: string;
      status: string;
      fundingSource: string;
      tags: string[];
      strategyModel: string;
      collaborations: string;
      MainGoal?: string;
    }
  ) {
    const prompt = this.createRoadmapPrompt(projectData);
    await this.validatePackage(userId);  // Ensure user has access

  
    try {
      console.log('=== AI PROMPT ===\n', prompt);
  
      const response = await axios.post(
        this.API_URL,
        {
          inputs: prompt,
          parameters: {
            temperature: 0.4,  // Lower for more focused responses
            max_length: 600,   // Reduced from 800
            wait_for_model: true,
            do_sample: true    // Add this parameter
          }
        },
        { 
          headers: { 
            Authorization: `Bearer ${this.HF_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 1800// 90 seconds timeout
        }
      );
  
      console.log('=== RAW AI RESPONSE ===\n', response.data);
      const roadmapText = response.data[0]?.generated_text || '';
      console.log('=== PROCESSED ROADMAP TEXT ===\n', roadmapText);
  
      const parsedRoadmap = this.parseRoadmap(roadmapText);
      console.log('=== PARSED ROADMAP ===\n', JSON.stringify(parsedRoadmap, null, 2));
  
      // Save roadmap to the database
      await this.saveRoadmapToDatabase(userId, projectId, parsedRoadmap);
  
      // Call AI updates for milestones and tasks AFTER saving the roadmap
      await this.updateMilestonesWithAI(userId, projectId);
      await this.updateTasksWithAI(userId, projectId);
      await this.suggestBestActionsWithAI(userId, projectId);
      await this.generateTaskSuggestionsWithAI(userId)

  
      return parsedRoadmap;
    } catch (error) {
      console.error('AI Error:', error);
      throw new Error('Failed to generate roadmap');
    }
  }
  
  
 

  

  private parseRoadmap(roadmapText: string): { milestones: { title: string; duration: string; tasks: string[] }[] } {
    const milestones: { title: string; duration: string; tasks: string[] }[] = [];
    const lines = roadmapText.split('\n');
    let currentMilestone: { title: string; duration: string; tasks: string[] } | null = null;
  
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
  
      // Detect milestones using "PHASE X: " pattern
      const phaseMatch = trimmed.match(/^PHASE\s+\d+:\s(.+)/i);
      if (phaseMatch) {
        if (currentMilestone) milestones.push(currentMilestone);
        currentMilestone = {
          title: phaseMatch[1].trim(),
          duration: '',
          tasks: []
        };
      }
      // Capture duration
      else if (trimmed.startsWith('⏳ Duration:')) {
        if (currentMilestone) {
          currentMilestone.duration = trimmed.split(':')[1].trim();
        }
      }
      // Capture tasks (key deliverables)
      else if (trimmed.startsWith('• ') && currentMilestone) {
        currentMilestone.tasks.push(trimmed.slice(2).trim());
      }
    });
  
    if (currentMilestone) milestones.push(currentMilestone);
    return { milestones };
  }
  
  private async saveRoadmapToDatabase(
    userId: string,
    projectId: string,
    parsedRoadmap: { milestones: { title: string; duration: string; tasks: string[] }[] }
  ) {
    let startDate = new Date();
    
    for (const milestoneData of parsedRoadmap.milestones) {
      // Calculate due date from duration
      const durationMatch = milestoneData.duration.match(/(\d+)/);
      const weeks = durationMatch ? parseInt(durationMatch[1]) : 2;
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + (weeks * 7));
  
      // Create milestone
      const milestone = await this.milestoneService.create(userId, {
        projectId,
        name: milestoneData.title,
        description: `AI-generated phase: ${milestoneData.title}`,
        status: 'not_started',
        startDate: startDate,
        dueDate: dueDate,
        priority: 'medium',
        aiGenerated: true,
        progress: 0,
        visibility: 'private',
      });
  
      // Create tasks
      for (const taskText of milestoneData.tasks) {
        await this.taskService.create(userId, {
          milestoneId: milestone.id,
          name: taskText,
          description: taskText,
          status: 'ON_HOLD',
          priority: 'MEDIUM',
          type: 'FEATURE',
          estimatedTime: this.estimateTaskTime(taskText)
        });
      }
  
      // Set next start date after current due date
      startDate = new Date(dueDate);
      startDate.setDate(startDate.getDate() + 1);
    }
  }
  
  private estimateTaskTime(taskText: string): number {
    // Simple estimation logic
    if (taskText.toLowerCase().includes('analysis')) return 8;  // 1 day
    if (taskText.toLowerCase().includes('deployment')) return 24; // 3 days
    return 16; // Default 2 days
  }
  

  
  private createRoadmapPrompt(projectData: any): string {
    const { name, type, description, strategyModel, teamType } = projectData;

    // Enhanced project-type configurations
    const projectConfig: Record<string, any> = {
        default: {
            terms: {
                mvp: 'MVP',
                launch: 'Launch',
                userFeedback: 'user interviews',
                validation: 'Market Validation',
                iteration: 'Product Iteration',
                delivery: 'Final Delivery'
            },
            team: ['Project Manager', 'Core Developer', 'QA Specialist'],
            risks: ['Market competition', 'Resource constraints', 'Technical challenges'],
            budget: {
                development: '40%',
                testing: '20%',
                marketing: '25%',
                contingency: '15%'
            }
        },
        software: {
            terms: {
                mvp: 'Minimum Viable Product',
                launch: 'Deployment',
                userFeedback: 'beta testing',
                validation: 'Feature Validation',
                iteration: 'Code Refinement',
                delivery: 'Production Release'
            },
            team: ['Tech Lead', 'UI/UX Designer', 'Full-stack Developer', 'DevOps Engineer'],
            risks: ['API reliability', 'Scalability issues', 'Security vulnerabilities'],
            budget: {
                development: '50%',
                testing: '25%',
                deployment: '15%',
                contingency: '10%'
            }
        },
        university: {
            terms: {
                mvp: 'Research Prototype',
                launch: 'Thesis Defense',
                userFeedback: 'peer reviews',
                validation: 'Academic Validation',
                iteration: 'Study Refinement',
                delivery: 'Final Publication'
            },
            team: ['Faculty Advisor', 'Research Lead', 'Data Analyst', 'Lab Technician'],
            risks: ['Funding limitations', 'Ethical approvals', 'Data collection challenges'],
            budget: {
                research: '35%',
                equipment: '30%',
                personnel: '25%',
                contingency: '10%'
            }
        },
        business: {
            terms: {
                mvp: 'Proof of Concept',
                launch: 'Market Entry',
                userFeedback: 'client trials',
                validation: 'Business Validation',
                iteration: 'Model Optimization',
                delivery: 'Full Operation'
            },
            team: ['CEO', 'Operations Manager', 'Marketing Lead', 'Sales Director'],
            risks: ['Market saturation', 'Regulatory changes', 'Supply chain issues'],
            budget: {
                product: '40%',
                marketing: '30%',
                operations: '20%',
                contingency: '10%'
            }
        }
    };

    // Enhanced strategy configurations
    const strategyConfig: Record<string, any> = {
        lean: {
            description: "User-Centric Validation Framework",
            phases: [
                { 
                    title: "🔍 ${validation}", 
                    tasks: [
                        "Conduct 5 ${userFeedback}",
                        "Develop ${mvp} concept",
                        "Competitive landscape analysis",
                        "User persona development"
                    ], 
                    duration: "2-3 weeks" 
                },
                { 
                    title: "🛠 Build-Test-Learn", 
                    tasks: [
                        "Create interactive ${mvp}",
                        "Implement analytics tracking",
                        "A/B test core features",
                        "Collect qualitative feedback"
                    ], 
                    duration: "3-4 weeks" 
                },
                { 
                    title: "🔄 ${iteration}", 
                    tasks: [
                        "Prioritize feature backlog",
                        "Optimize user experience",
                        "Update risk mitigation plan",
                        "Prepare scalability blueprint"
                    ], 
                    duration: "2-3 weeks" 
                },
                { 
                    title: "🚀 ${delivery}", 
                    tasks: [
                        "Final security audits",
                        "Launch marketing campaign",
                        "Establish user support system",
                        "Implement monitoring dashboard"
                    ], 
                    duration: "3-4 weeks" 
                }
            ]
        },
        academic: {
            description: "Research-Driven Development Framework",
            phases: [
                { 
                    title: "📚 Literature Review", 
                    tasks: [
                        "Conduct systematic review",
                        "Identify research gaps",
                        "Formulate hypothesis",
                        "Secure ethics approval"
                    ], 
                    duration: "3-4 weeks" 
                },
                { 
                    title: "🔬 Methodology Design", 
                    tasks: [
                        "Develop research framework",
                        "Create data collection tools",
                        "Pilot study implementation",
                        "Peer validation process"
                    ], 
                    duration: "4-6 weeks" 
                },
                { 
                    title: "📊 Data Analysis", 
                    tasks: [
                        "Process collected data",
                        "Statistical validation",
                        "Comparative analysis",
                        "Draft findings"
                    ], 
                    duration: "3-5 weeks" 
                },
                { 
                    title: "📝 Publication", 
                    tasks: [
                        "Final paper writing",
                        "Journal submission",
                        "Conference preparation",
                        "Knowledge transfer plan"
                    ], 
                    duration: "4-6 weeks" 
                }
            ]
        },
        default: {
            description: "Adaptive Success Framework",
            phases: [
                { 
                    title: "🎯 Strategic Foundation", 
                    tasks: [
                        "Stakeholder alignment workshop",
                        "SWOT analysis",
                        "Risk assessment matrix",
                        "Success metric definition"
                    ], 
                    duration: "2-3 weeks" 
                },
                { 
                    title: "🛠 Core Development", 
                    tasks: [
                        "Modular implementation",
                        "Quality assurance protocols",
                        "User feedback integration",
                        "Performance benchmarking"
                    ], 
                    duration: "4-8 weeks" 
                },
                { 
                    title: "📌 Validation & Refinement", 
                    tasks: [
                        "Pilot deployment",
                        "Data-driven optimization",
                        "Competitive analysis update",
                        "Resource reallocation"
                    ], 
                    duration: "3-4 weeks" 
                },
                { 
                    title: "🚀 Operational Excellence", 
                    tasks: [
                        "Full-scale deployment",
                        "Team training program",
                        "Long-term monitoring",
                        "Continuous improvement"
                    ], 
                    duration: "4-6 weeks" 
                }
            ]
        }
    };

    const config = projectConfig[type] || projectConfig.default;
    const selectedStrategy = strategyConfig[strategyModel] || strategyConfig.default;

    // Dynamic content processing
    const processedPhases = selectedStrategy.phases.map((phase: any) => ({
        ...phase,
        title: phase.title.replace(/\${(.*?)}/g, (_, key) => config.terms[key] || key),
        tasks: phase.tasks.map((task: string) => 
            task.replace(/\${(.*?)}/g, (_, key) => config.terms[key] || key)
        )
    }));

    // Calculate timeline
    const totalDuration = processedPhases.reduce((acc: number, phase: any) => {
        const weeks = parseInt(phase.duration.split('-')[0]);
        return acc + weeks;
    }, 0);

    // Build roadmap
    let roadmap = `🔷 STRATEGIC ROADMAP: ${name || 'Your Project'} 🔷\n\n`;
    roadmap += `🏷 Type: ${type || 'General'}\n`;
    roadmap += `📐 Strategy: ${selectedStrategy.description}\n`;
    roadmap += description ? `📝 Description: ${description}\n\n` : '\n';

    processedPhases.forEach((phase: any, index: number) => {
        roadmap += `PHASE ${index + 1}: ${phase.title}\n`;
        roadmap += `⏳ Duration: ${phase.duration}\n`;
        roadmap += `📦 Key Deliverables:\n${phase.tasks.map((t: string) => `• ${t}`).join('\n')}\n\n`;
    });

    roadmap += `📊 Success Ecosystem:\n`;
    roadmap += `• Real-time KPI dashboards\n• User satisfaction metrics\n• Innovation index tracking\n\n`;

    roadmap += `🛡 Risk Management:\n`;
    roadmap += `• ${config.risks.join('\n• ')}\n• Dynamic contingency planning\n\n`;

    if (teamType === 'team') {
      roadmap += `👥 Team Structure:\n`;
      roadmap += `• ${config.team.join('\n• ')}\n\n`;
  }


    roadmap += `💰 Budget Allocation:\n`;
    Object.entries(config.budget).forEach(([category, percentage]) => {
        roadmap += `• ${category}: ${percentage}\n`;
    });

    roadmap += `\n⏱ Estimated Timeline: ${totalDuration}-${totalDuration + 2} weeks`;

    return roadmap;
}



private parseDate(dateString: any, fallback: Date): Date {
  if (!dateString) return fallback;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? fallback : date;
}
async updateMilestonesWithAI(userId: string, projectId: string) { 
  await this.validatePackage(userId);  // Ensure user has access

  const milestones = await this.milestoneService.getByProject(userId, projectId);

  if (!milestones.length) {
    throw new NotFoundException('No milestones found for this project');
  }

  // Improved AI Prompt with Progress-Based Status
  const prompt = `Analyze the following milestones and return a JSON array where each object contains "title", "status" (not_started, in_progress, completed), and "priority" (low, medium, high). 
  - If progress is 100%, set status to "completed".  
  - If progress is between 1% and 99%, set status to "in_progress".  
  - If progress is 0%, set status to "not_started".  
  - "start_date" (ISO-8601 format estimated logical start date based on dependencies)
  - "due_date" (ISO-8601 format estimated logical due date considering task durations)

  Rules:
  - The first milestone should start at the project start date if available.
  - A milestone cannot start before the previous milestone ends.
  - If tasks have estimated durations, sum them up for due_date estimation.
  - Strictly return only JSON.\n\n` +
    milestones.map(m => `- Title: ${m.name}, Description: ${m.description}, Tasks: ${m.tasks.length}`).join("\n");


  // Call AI API
  const response = await axios.post(
    this.API_URL,
    { inputs: prompt, parameters: { temperature: 0.2, max_length: 500, return_full_text: false } },
    { headers: { Authorization: `Bearer ${this.HF_API_KEY}` }, timeout: 60000 }
  );

  // Extract AI Response
  const aiResponseText = response.data[0]?.generated_text || '';
  console.log("Raw AI Response:", aiResponseText);

  let jsonString = '';

  // Extract JSON from AI response
  const jsonMatch = aiResponseText.match(/```json\s*([\s\S]+?)\s*```/);
  if (jsonMatch) {
    jsonString = jsonMatch[1];
  } else {
    const firstBracket = aiResponseText.indexOf('[');
    const lastBracket = aiResponseText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      jsonString = aiResponseText.substring(firstBracket, lastBracket + 1);
    } else {
      throw new InternalServerErrorException('AI response does not contain valid JSON.');
    }
  }

  let aiSuggestions;
  try {
    aiSuggestions = JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse AI response JSON:", jsonString);
    throw new InternalServerErrorException('AI response JSON is invalid.');
  }

  if (!Array.isArray(aiSuggestions)) {
    throw new InternalServerErrorException('AI response is not in array format.');
  }

  const updatedMilestones: { name: string; suggestedStatus: string; suggestedPriority: string ,startDate: string; dueDate: string}[] = [];

  
  // Ensure AI does not return all "Pending" by applying progress-based status
  for (const suggestion of aiSuggestions) {
    const milestone = milestones.find(m => m.name === suggestion.title);

    if (!milestone) {
      console.warn(`No matching milestone found for AI suggestion: ${suggestion.title}`);
      continue;
    }

    // Override AI response if needed based on actual progress
    let correctedStatus = suggestion.status;
    if (milestone.progress === 100) {
      correctedStatus = "completed";
    } else if (milestone.progress > 0) {
      correctedStatus = "in_progress";
    } else {
      correctedStatus = "not_started";
    }

    const currentDate = new Date();

    const startDate = milestone.startDate || suggestion.start_date || new Date().toISOString();
    const dueDate = suggestion.due_date || new Date(new Date(startDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();


    console.log(`Updating milestone: ${milestone.name}, Status: ${correctedStatus}, Priority: ${suggestion.priority}, Start Date: ${startDate}, Due Date: ${dueDate}`);

    await this.milestoneService.update(userId, milestone.id, {
      status: correctedStatus,
      priority: suggestion.priority
    });

    updatedMilestones.push({
      name: milestone.name,
      suggestedStatus: correctedStatus,
      suggestedPriority: suggestion.priority,
      startDate: startDate,
      dueDate: dueDate
    });
  }

  return {
    message: 'Milestones updated successfully with AI suggestions',
    updates: updatedMilestones
  };
}



async updateTasksWithAI(userId: string, projectId: string) { 
  await this.validatePackage(userId);  // Ensure user has access

  const tasks = await this.taskService.getTasksByProjectId(userId, projectId);

  if (!tasks.length) {
    throw new NotFoundException('No tasks found for this project');
  }

  // Improved AI Prompt
  const prompt = `Analyze the following tasks and return a JSON array where each object contains: 
  - "title" (same as given task title),  
  - "status"(not_started, in_progress, completed), 
  - "priority" (low, medium, high),  
  - "type" (e.g., Development, Marketing, Research, Design, etc.).  
  - If progress is 100%, set status to "completed".  
  - If progress is between 1% and 99%, set status to "in_progress".  
  - If progress is 0%, set status to "not_started".  
  
  - "start_date" (ISO-8601 format estimated logical start date based on dependencies)
  - "due_date" (ISO-8601 format estimated logical due date considering task durations)

  Rules:
  - The first task should start at the milestone start date if available.
  - A task cannot start before the previous task ends.
  - If tasks have estimated durations, sum them up for due_date estimation.
  - Strictly return only JSON.\n\n` +


    tasks.map(t => `- Title: ${t.name}, Description: ${t.description}, Progress: ${t.progress}`).join("\n");

  // Call AI API
  const response = await axios.post(
    this.API_URL,
    { inputs: prompt, parameters: { temperature: 0.2, max_length: 500, return_full_text: false } },
    { headers: { Authorization: `Bearer ${this.HF_API_KEY}` }, timeout: 60000 }
  );

  // Extract AI Response
  const aiResponseText = response.data[0]?.generated_text || '';
  console.log("Raw AI Response:", aiResponseText);

  let jsonString = '';

  // Extract JSON from AI response
  const jsonMatch = aiResponseText.match(/```json\s*([\s\S]+?)\s*```/);
  if (jsonMatch) {
    jsonString = jsonMatch[1];
  } else {
    const firstBracket = aiResponseText.indexOf('[');
    const lastBracket = aiResponseText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      jsonString = aiResponseText.substring(firstBracket, lastBracket + 1);
    } else {
      throw new InternalServerErrorException('AI response does not contain valid JSON.');
    }
  }

  let aiSuggestions;
  try {
    aiSuggestions = JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse AI response JSON:", jsonString);
    throw new InternalServerErrorException('AI response JSON is invalid.');
  }

  if (!Array.isArray(aiSuggestions)) {
    throw new InternalServerErrorException('AI response is not in array format.');
  }

  const updatedTasks: { name: string; suggestedStatus: string; suggestedPriority: string; suggestedType: string }[] = [];

  // Ensure AI does not return incorrect statuses
  for (const suggestion of aiSuggestions) {
    const task = tasks.find(t => t.name === suggestion.title);

    if (!task) {
      console.warn(`No matching task found for AI suggestion: ${suggestion.title}`);
      continue;
    }

    // Override AI response if needed based on actual progress
    let correctedStatus = suggestion.status;
    if (task.progress === 100) {
      correctedStatus = "completed";
    } else if (task.progress > 0) {
      correctedStatus = "in_progress";
    } else {
      correctedStatus = "not_started";
    }
   
    const currentDate = new Date();

    let startDate = task.startDate 
      ? new Date(task.startDate)
      : this.parseDate(suggestion.start_date, currentDate);
      const defaultDueDate = new Date(startDate.getTime() + 14 * 86400000); // 14 days
      let dueDate = this.parseDate(suggestion.due_date, defaultDueDate);
      
      // Ensure due date is after start date
      if (dueDate < startDate) dueDate = defaultDueDate;
    console.log(`Updating task: ${task.name}, New Status: ${correctedStatus}, New Priority: ${suggestion.priority}, New Type: ${suggestion.type}`);

    await this.taskService.update(userId, task.id, {
      status: correctedStatus,
      priority: suggestion.priority,
      type: suggestion.type,
      startDate: startDate, // Convert Date to ISO 8601 string
      dueDate: dueDate
    });

    updatedTasks.push({
      name: task.name,
      suggestedStatus: correctedStatus,
      suggestedPriority: suggestion.priority,
      suggestedType: suggestion.type,
      
       
    });
  }

  return {
    message: 'Tasks updated successfully with AI suggestions',
    updates: updatedTasks
  };
}

async suggestBestActionsWithAI(userId: string, projectId: string) {
  await this.validatePackage(userId);  // Ensure user has access

  // Fetch project details (ensure project exists)
  const project = await this.prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  // Fetch tasks and milestones for the project
  const tasks = await this.taskService.getTasksByProjectId(userId, projectId);
  const milestones = await this.milestoneService.getByProject(userId, projectId);

  if (!tasks.length && !milestones.length) {
    throw new NotFoundException('No tasks or milestones found for this project');
  }

  // AI Prompt
  const prompt = `Based on the following milestones and tasks, generate the best action plan for the user. 
  - Consider due dates, priorities, and workload balance.
  - Suggest whether the user should continue a task, switch to another, or complete an urgent milestone.
  - Return JSON with "recommendation" (best action), "reason" (why it's the best choice), and "nextSteps" (what to do next).
  Strictly return only JSON.

  ` + milestones.map(m => `- Milestone: ${m.name}, Start: ${m.startDate}, Due: ${m.dueDate}, Priority: ${m.priority}, Progress: ${m.progress}`).join("\n") +
    "\n" +
    tasks.map(t => `- Task: ${t.name}, Start: ${t.startDate}, Due: ${t.dueDate}, Priority: ${t.priority}, Progress: ${t.progress}`).join("\n");

  // Call AI API
  const response = await axios.post(
    this.API_URL,
    { inputs: prompt, parameters: { temperature: 0.2, max_length: 500, return_full_text: false } },
    { headers: { Authorization: `Bearer ${this.HF_API_KEY}` }, timeout: 60000 }
  );

  // Extract AI Response
  const aiResponseText = response.data[0]?.generated_text || '';
  console.log("Raw AI Response:", aiResponseText);

  let jsonString = '';
  const jsonMatch = aiResponseText.match(/```json\s*([\s\S]+?)\s*```/);
  if (jsonMatch) {
    jsonString = jsonMatch[1];
  } else {
    const firstBracket = aiResponseText.indexOf('[');
    const lastBracket = aiResponseText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      jsonString = aiResponseText.substring(firstBracket, lastBracket + 1);
    } else {
      throw new InternalServerErrorException('AI response does not contain valid JSON.');
    }
  }

  let aiSuggestions;
  try {
    aiSuggestions = JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse AI response JSON:", jsonString);
    throw new InternalServerErrorException('AI response JSON is invalid.');
  }

  // **Save AI Insights to Project**
  await this.prisma.project.update({
    where: { id: projectId },
    data: { aiInsights: JSON.stringify(aiSuggestions) }, // Save as string if using JSON field
  });

  return {
    message: 'AI-generated action plan saved to project',
    recommendations: aiSuggestions,
  };
}





async generateTaskSuggestionsWithAI(userId: string) {
  await this.validatePackage(userId);  // Ensure user has access

  const tasks = await this.taskService.getTasksByMemberId(userId);

  if (!tasks.length) {
    throw new NotFoundException('No tasks found for this user');
  }

  // Construct AI prompt
  const prompt = `Analyze the following tasks and provide personalized recommendations for each. 
For each task, return a JSON object with:
- "title" (exact task title)
- "bestAction" (specific next step)
- "timeAllocation" (suggested time in hours)
- "aiSuggestions" (efficiency recommendations)
- "aiTaskOptimization" (how to optimize the task for better efficiency)

Strictly return only a JSON array of objects:\n\n` +
tasks.map(t => 
  `Task: ${t.name}
Description: ${t.description}
Priority: ${t.priority || 'unset'}
Due: ${t.dueDate?.toISOString() || 'no deadline'}
Progress: ${t.progress}%`
).join("\n\n");

  // Call AI API
  const response = await axios.post(
    this.API_URL,
    { 
      inputs: prompt,
      parameters: { 
        temperature: 0.3,
        max_length: 1000,
        return_full_text: false
      }
    },
    { headers: { Authorization: `Bearer ${this.HF_API_KEY}` }, timeout: 60000 }
  );

  // Process AI response
  const aiResponseText = response.data[0]?.generated_text || '';
  console.log("AI Response:", aiResponseText);

  let jsonString = '';
  const jsonMatch = aiResponseText.match(/```json\s*([\s\S]+?)\s*```/);
  if (jsonMatch) {
    jsonString = jsonMatch[1];
  } else {
    const firstBracket = aiResponseText.indexOf('[');
    const lastBracket = aiResponseText.lastIndexOf(']');
    jsonString = firstBracket !== -1 && lastBracket > firstBracket 
      ? aiResponseText.slice(firstBracket, lastBracket + 1)
      : aiResponseText;
  }

  let aiSuggestions;
  try {
    aiSuggestions = JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON Parse Error:", error.message);
    throw new InternalServerErrorException('Invalid AI response format');
  }

  // Validate and update tasks with AI suggestions
  const updatedTasks = await Promise.all(aiSuggestions.map(async suggestion => {
    const task = tasks.find(t => t.name === suggestion.title);
    if (!task) {
      console.warn(`Suggestion for unknown task: ${suggestion.title}`);
      return null;
    }

    return this.taskService.update(userId,task.id, {
      bestAction: suggestion.bestAction || 'No suggestion',
      timeAllocation: `${suggestion.timeAllocation || 0} hours`,
      aiSuggestions: suggestion.aiSuggestions || 'No suggestions available',
      aiTaskOptimization: suggestion.aiTaskOptimization || 'No optimization suggestions',
    });
  }));

  return {
    message: 'AI-powered task suggestions saved',
    updatedTasks: updatedTasks.filter(Boolean), // Remove null values
    generatedAt: new Date().toISOString()
  };
}




  
}

  
