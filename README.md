# SPEAR Agents

AI agents for SPEAR platform powered by Mastra and Google Gemini 3 Pro Preview.

Features:
- Human-like communication style (active voice, direct, no AI filler phrases)
- Context caching for 90% cost savings on repeated tokens
- Human-in-the-loop (HITL) approval for destructive operations

## Agents

### Customer Support (`customer-support`)
Handles customer inquiries about accounts, devices, and subscriptions. Can:
- Look up customer information
- Check subscription and device status
- Create support tickets
- Send password reset emails
- Check refund eligibility

### Internal Ops (`internal-ops`)
Full administrative capabilities for managing the platform. Can:
- All customer support capabilities
- Process refunds
- Extend or cancel subscriptions
- Assign devices
- View revenue metrics
- List disputes

### Sales (`sales`)
Handles pre-sales questions and onboarding. Can:
- Check founder's pricing availability
- Answer pricing and feature questions
- Guide signup process

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your Gemini API key to `.env`:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
SPEAR_API_URL=https://www.spear-global.com/api
SPEAR_API_KEY=your_spear_api_key_if_needed
```

3. Start the development server:
```bash
npm run dev
```

Open http://localhost:4111 in your browser to access Mastra Studio.

## Deployment to Mastra Cloud

1. Push to GitHub
2. Connect to Mastra Cloud at https://cloud.mastra.ai
3. Deploy from your repository

Check out the deployment guide at https://mastra.ai/docs/deployment/overview

## Communication Style

All agents follow a strict communication style to sound human:
- Use active voice
- Be direct and concise
- Use simple language
- Maintain conversational tone
- Avoid AI filler phrases, cliches, jargon

## Business Rules

Critical rules embedded in all agents:
- Founder's pricing: 100 spots at $100/month (must check availability)
- Refunds within 7 days: Auto approve
- Refunds after 7 days: Escalate to admin
- Device replacement: $100 fee
- Shipping: 5 days domestic, 14 days international

## Learn More

- Mastra Documentation: https://mastra.ai/docs/
- Discord Community: https://discord.gg/BTYqqHKUrf
- Mastra Cloud: https://cloud.mastra.ai/
