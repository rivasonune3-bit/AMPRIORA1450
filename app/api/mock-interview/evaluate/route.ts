import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@supabase/supabase-js'

const getUserFromAuthHeader = async (req: Request) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return null
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : auth.trim()
  if (!token) return null
  const anonClient = createClient(supabaseUrl, anonKey)
  try {
    const { data, error } = await anonClient.auth.getUser(token)
    if (error) return null
    return data?.user || null
  } catch (e) {
    return null
  }
}

const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.6-flash']

async function generateWithModelFallback(ai: GoogleGenAI, contents: any) {
  let lastError: any = null
  for (const model of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({ model, contents })
      if (response && response.text) {
        return response
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed in evaluation, trying next fallback... Error:`, err?.message || err)
      lastError = err
    }
  }
  throw lastError || new Error('All AI models failed to generate evaluation')
}

export async function POST(request: Request) {
  try {
    const caller = await getUserFromAuthHeader(request)
    if (!caller) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to complete evaluation.', code: 'UNAUTHENTICATED' },
        { status: 401 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Add GEMINI_API_KEY to .env.local.', code: 'MISSING_GEMINI_KEY' },
        { status: 503 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })
    const { type, difficulty, targetRole, dreamCompany, history, profileContext, focusAreas, cameraMetrics } = await request.json()

    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json({ error: 'Interview transcript history is required for evaluation' }, { status: 400 })
    }

    const candidateName = profileContext?.full_name || caller.user_metadata?.full_name || 'Candidate'
    const role = targetRole || profileContext?.targetRole || 'Target Role'
    const company = dreamCompany && dreamCompany !== 'Not specified' ? dreamCompany : 'Not specified'
    const level = difficulty || 'Mid-Level'
    const interviewType = (type || 'technical').toUpperCase()

    const transcriptText = history
      .map((msg: any) => `${msg.role === 'user' ? candidateName : 'AMPRIORA Interviewer'}: ${msg.text}`)
      .join('\n\n')

    const cameraInfo = cameraMetrics 
      ? `Real Camera Presentation Metrics captured during session:
- Eye Contact Centering: ${cameraMetrics.eyeContactPercentage}%
- Posture Rating: ${cameraMetrics.postureRating}
- Facing Camera Ratio: ${cameraMetrics.facingCameraPercentage}%
- Movement Distractions: ${cameraMetrics.distractionsDetected ? 'Yes' : 'None detected'}`
      : `Camera Analysis: Not enabled by candidate for this session.`

    const prompt = `You are a senior AMPRIORA hiring bar-raiser and career interview coach.
Analyze the following real ${interviewType} mock interview transcript for candidate ${candidateName}, who interviewed for a ${level} ${role} position (Target Company Context: ${company}).
Focus Areas: ${focusAreas || 'Core competencies and role-specific skills'}.

${cameraInfo}

--- INTERVIEW TRANSCRIPT ---
${transcriptText}
--- END TRANSCRIPT ---

Perform a rigorous, evidence-based, question-by-question evaluation based STRICTLY on the candidate's actual answers in the transcript.
Return ONLY a valid JSON object matching this exact structure:
{
  "overallScore": number (0-100 based strictly on candidate's answers),
  "technicalScore": number (0-100),
  "communicationScore": number (0-100),
  "structureScore": number (0-100),
  "summary": "2-3 sentence executive evaluation summarizing overall performance.",
  "strengths": ["Specific strength 1 from answers", "Specific strength 2"],
  "areasForImprovement": ["Specific area 1 to improve", "Specific area 2"],
  "actionableSuggestions": ["Concrete recommendation 1", "Concrete recommendation 2"],
  "whereMarksLost": [
    {
      "questionNum": number,
      "impactCategory": "Technical Correctness / Communication Clarity / STAR Structure / Incomplete Answer",
      "reason": "Specific explanation of why score was reduced for this answer"
    }
  ],
  "questionReviews": [
    {
      "questionNum": number,
      "questionText": "Exact or summarized question asked by interviewer",
      "candidateAnswer": "Candidate's actual response snippet",
      "whatWasGood": "What candidate did well in this answer",
      "whatWasMissingOrWrong": "WHERE YOU WENT WRONG: Specific mistake, missing technical depth, or concept gap",
      "whyItWasWeak": "WHY IT MATTERED: Impact on interview evaluation",
      "howToImprove": "WHAT TO LEARN: Actionable steps to master this topic",
      "betterApproachExample": "BETTER APPROACH: Concrete example of a strong, ideal answer for this exact question (clearly labeled as guidance/example)"
    }
  ],
  "cameraPresentation": ${cameraMetrics ? `{
    "eyeContact": "Good / Needs Improvement",
    "posture": "Professional / Slouched",
    "presentation": "Attentive / Distracted",
    "distractions": "None detected / Minor movement detected",
    "summary": "Evidence-based presentation feedback (e.g. 'Maintaining camera eye contact during explanations will enhance presentation confidence.')"
  }` : 'null'}
}

Scoring criteria:
- Base scores STRICTLY on the actual responses provided by candidate in the transcript.
- NEVER return generic hardcoded placeholders.
- Do NOT make unsupported psychological claims; provide evidence-based observable feedback only.
- Return ONLY the JSON object. Do not include markdown code block syntax or extra prose.`

    const response = await generateWithModelFallback(ai, [{ role: 'user', parts: [{ text: prompt }] }])

    const rawText = response.text || ''
    const cleanJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim()

    let evaluation
    try {
      evaluation = JSON.parse(cleanJsonText)
    } catch (parseErr) {
      console.error('Failed to parse AI evaluation JSON from Gemini:', rawText)
      return NextResponse.json(
        { error: 'AI evaluation output format was invalid. Please retry evaluation.' },
        { status: 500 }
      )
    }

    if (typeof evaluation.overallScore !== 'number') {
      return NextResponse.json(
        { error: 'AI evaluation missing numeric overall score. Please retry evaluation.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ evaluation })
  } catch (error: any) {
    console.error('Mock Interview Evaluation API Error:', error)

    const isQuotaError = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Quota exceeded')
    if (isQuotaError) {
      return NextResponse.json(
        { error: 'AI Interview evaluation rate limit reached. Please wait 10-15 seconds and click Retry Evaluation.', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate evaluation' },
      { status: 500 }
    )
  }
}
