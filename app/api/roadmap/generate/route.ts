import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock_key' });

const roadmapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    targetRole: { type: Type.STRING },
    readinessScore: { type: Type.INTEGER, description: "A score from 0 to 100 indicating career readiness" },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weakSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingSkills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          priority: { type: Type.STRING, description: "High, Medium, or Low" },
          timeToLearn: { type: Type.STRING, description: "Estimated time, e.g. 2 weeks" },
          recommendedProject: { type: Type.STRING },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING },
                type: { type: Type.STRING, description: "Course, Video, Article, etc." }
              },
              required: ["title", "url", "type"]
            }
          }
        },
        required: ["name", "priority", "timeToLearn", "recommendedProject", "resources"]
      }
    },
    whatToLearnNext: { type: Type.STRING, description: "A brief paragraph summarizing what to focus on immediately." },
    phases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING, description: "e.g. Foundation, Core Skills, Projects, Deployment" },
          description: { type: Type.STRING },
          status: { type: Type.STRING, description: "not-started, in-progress, or completed" },
          topics: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["id", "name", "description", "status", "topics"]
      }
    }
  },
  required: ["targetRole", "readinessScore", "strengths", "weakSkills", "missingSkills", "whatToLearnNext", "phases"]
};

export async function POST(req: Request) {
  try {
    const { onboarding, targetRoleOverride } = await req.json();
    
    // Determine the target role
    const targetRole = targetRoleOverride || onboarding?.targetRole || 'Software Engineer';
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock_key') {
      return NextResponse.json({ error: "Gemini API Key is missing or invalid. Please configure GEMINI_API_KEY." }, { status: 500 });
    }

    const prompt = `
You are an expert AI Career Coach. Generate a comprehensive, highly personalized career roadmap.
User's desired Target Role: ${targetRole}
User's existing Profile Data: ${JSON.stringify(onboarding)}

Analyze the user's existing skills, projects, and experience. 
Identify their current strengths, weak skills, and missing skills required for the target role.
Generate a calculated readiness score (0-100).
Create a roadmap broken down into logical phases (e.g. Foundation, Core Skills, Advanced, Projects, Interview Prep).
For every missing skill, provide REAL, verified learning resources (e.g. real URLs to freecodecamp, youtube, coursera, official docs) - NEVER invent fake URLs.
    `;

    const interaction = await ai.interactions.create({
      model: 'gemini-3.6-flash',
      input: prompt,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: roadmapSchema
      }
    });

    if (!interaction.output_text) {
      throw new Error("No output text from Gemini API");
    }

    const parsedData = JSON.parse(interaction.output_text);
    return NextResponse.json({ data: parsedData });

  } catch (error: any) {
    console.error('Roadmap AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
