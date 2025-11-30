import { Box } from "@mui/material";
import Page from "~/components/Page";
import type { Route } from "./+types";
import AIChat from "~/components/AIChat";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function action({}: Route.ActionArgs) {
  const INSTRUCTIONS = `
    You are a Mock Call Assistant for Solvent Funding's call center training program.
    Your job is to simulate realistic conversations with business owners or gatekeepers,
    helping agents practice the official sales script, rebuttals, and process flow.
    Always stay in character as the prospect while responding naturally, based on the scenario and qualifying data.
    Do not provide coaching, explanations, or internal notes — only play the role of the prospect.
    Ensure each interaction aligns with Solvent Funding's products, criteria, and compliance guidelines.
  `;

  const KNOWLEDGE_BASE = {
    company: "Solvent Funding",
    products: [
      "Merchant Cash Advance",
      "Short-Term Business Loan",
      "Business Line of Credit",
      "Equipment Financing",
      "Loan Consolidation",
    ],
    differentiators: [
      "Fast funding (24 hours)",
      "No hidden fees",
      "Competitive rates",
      "Flexible repayment terms",
      "Personalized support",
    ],
    criteria: {
      monthly_deposits: ">= 20000",
      credit_score: ">= 490 (>= 500 for short-term loan)",
      time_in_business: ">= 6 months",
      no_defaults: true,
      no_bankruptcy_last_2yrs: true,
    },
    script_flow: [
      "Intro (Business Owner / Gatekeeper)",
      "Qualifying Questions",
      "Merchant Information",
      "Live Transfer",
      "Polite Decline if not qualified",
    ],
    qualifying_questions: [
      "Loan amount needed?",
      "Use of funds?",
      "Monthly deposits?",
      "Credit score?",
      "Any loan defaults?",
      "Any bankruptcies / UCC liens?",
      "Ownership details?",
      "Entity type (LLC/Corp/Partnership)?",
      "Time in business?",
      "Other existing loans?",
    ],
    rebuttals: {
      Rates:
        "We offer competitive and transparent terms. The funding team will discuss exact numbers, but let's first confirm eligibility.",
      "Too Busy":
        "Completely understand. That's why we keep this quick. Can I just confirm your monthly deposits?",
      "Not Interested":
        "No worries. Many businesses felt the same until they realized how fast we can fund—often in 24 hours.",
    },
    trainer_objectives: [
      "Coach the Agent to follow flow",
      "Verify qualifying questions",
      "Give rebuttal guidance",
      "Enforce compliance",
      "Provide encouragement",
    ],
  };

  const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview-2024-12-17",
      voice: "alloy",
      modalities: ["text", "audio"],
      instructions:
        INSTRUCTIONS + "\n\nKnowledge Base:\n" + JSON.stringify(KNOWLEDGE_BASE),
      turn_detection: {
        type: "server_vad",
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 200,
      },
      input_audio_transcription: { model: "whisper-1" },
      input_audio_format: "pcm16",
      output_audio_format: "pcm16",
    }),
  });

  const data = await response.json();
  const token = data?.client_secret?.value;

  return { token };
}

export default function Component({ actionData }: any) {
  const token = actionData?.token;

  return (
    <Page pageParamsKey="mock-call" formId="mock-call" title="Mock Call">
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AIChat token={token} />
      </Box>
    </Page>
  );
}

const ROLE_INSTRUCTIONS_PROCESS_TRAINER = `
You are a Process Trainer Assistant for Solvent Funding's call center agents.
Your job is to coach, guide, and train agents in real time while they speak with business owners or gatekeepers.
You are NOT the sales agent; you are a supportive trainer who ensures the agent follows the script, asks the right questions,
handles rebuttals properly, and maintains compliance with Solvent Funding's process.
Always give concise, directive coaching in real-time. Do not improvise offers outside official details.
`;
