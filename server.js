import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { VertexAI } from '@google-cloud/vertexai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Vertex AI
const project = process.env.GCP_PROJECT_ID || '';
const location = process.env.GCP_REGION || 'us-central1';
let generativeModel = null;

if (project) {
  try {
    const vertexAI = new VertexAI({ project, location });
    generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
    console.log('Vertex AI initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Vertex AI:', err.message);
  }
} else {
  console.warn('GCP_PROJECT_ID not set. AI Assistant will be in demo mode.');
}

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        // Fallback Mock Responses for Demo Mode
        const getMockResponse = (msg) => {
            const m = msg.toLowerCase();
            if (m.includes('register') || m.includes('form 6')) return "To register as a voter, you need to fill out **Form 6**. You can do this online via the NVSP portal or the Voter Helpline App. You'll need a photo, age proof, and address proof! Would you like to know about the documents needed?";
            if (m.includes('evm') || m.includes('vvpat')) return "EVMs (Electronic Voting Machines) and VVPATs are the backbone of our secure voting. When you vote, the VVPAT prints a slip for 7 seconds so you can verify your choice! Do you want to know how the VVPAT slip looks?";
            if (m.includes('age') || m.includes('eligible')) return "Any Indian citizen who is **18 years or older** on the qualifying date is eligible to vote. Have you registered yet? If not, I can tell you how!";
            if (m.includes('id') || m.includes('document') || m.includes('proof')) return "On voting day, you should carry your **Voter ID (EPIC)**. If you don't have it, you can use other valid IDs like Aadhaar, PAN card, or Passport! Should I list all 12 valid documents?";
            if (m.includes('booth') || m.includes('where to vote')) return "You can find your polling booth by checking your name on the **Electoral Search portal** (electoralsearch.eci.gov.in) or using the Voter Helpline App. Do you have your EPIC number ready?";
            if (m.includes('form 8')) return "**Form 8** is used for correction of details or shifting residence within the same constituency. It's very easy to do online! Need steps for shifting?";
            if (m.includes('nota')) return "**NOTA (None of the Above)** is an option on the EVM that allows you to express your disapproval of all candidates. It's the last button on the machine!";
            if (m.includes('ink')) return "The **Indelible Ink** is applied to your left forefinger as a sign that you have voted. It's a proud mark of every Indian voter!";
            return null; // No mock found
        };

        if (!generativeModel) {
            const mock = getMockResponse(message);
            return res.json({ 
                response: mock || "I'm currently in Demo Mode. I can help with registration, EVMs, or eligibility questions. To enable full AI, please fix your GCP configuration!",
                isDemo: true 
            });
        }

        // Start a Chat Session for multi-turn conversation
        const chat = generativeModel.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: `
You are 'Election Edu', a premium interactive AI guide for the Indian Election Process.
Your goal is to help citizens understand their rights and the voting process.
Rules:
1. Be encouraging, clear, and educational.
2. After every answer, suggest 2 or 3 follow-up topics.
3. Always mention official sources like NVSP when relevant.
` }],
                },
                {
                    role: 'model',
                    parts: [{ text: "Namaste! I am Election Edu. I'm here to help you navigate every step of the Indian election process. What would you like to explore first?" }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const text = result.response.candidates[0].content.parts[0].text;
        
        res.json({ response: text });
    } catch (error) {
        console.error('❌ AI Assistant Error (Falling back to Demo Mode):', error.message);
        
        // Final fallback if even the API call fails
        const mock = (req.body.message && req.body.message.length > 0) ? 
            "I'm having trouble connecting to my brain right now, but I can still tell you that voter registration is done via Form 6 on the NVSP portal!" :
            "I'm temporarily in offline mode.";

        res.json({ 
            response: mock,
            isDemo: true,
            error: error.message
        });
    }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
