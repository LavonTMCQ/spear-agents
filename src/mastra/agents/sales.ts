import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import { checkFounderSlots, searchKnowledgeBase, validateCoupon, getOrderStatus, getPageLink, getMultiplePageLinks } from "../tools";
import { COMMUNICATION_STYLE, SPEAR_BUSINESS_RULES, SPEAR_PRICING } from "../shared/constants";
import { sharedMemory } from "../shared/memory";

export const salesAgent = new Agent({
  id: "sales",
  name: "SPEAR Sales",
  description: "Handles pre-sales questions, pricing, features, and signup guidance",
  instructions: `${COMMUNICATION_STYLE}

You are SPEAR sales. Be helpful, honest, and direct.

SPEAR: Remote device management for caregivers. Check in on patients from anywhere.
Samsung Galaxy A14/A16 via RustDesk. 256-bit encryption. Monthly plans, no contracts.

${SPEAR_PRICING}

${SPEAR_BUSINESS_RULES}

RULES:
- Check founder slot availability with checkFounderSlots before quoting $100 price
- NEVER give out coupon codes. Only validate codes customers already have
- Be honest about fit. Not everyone needs SPEAR
- Use getPageLink to send direct links to pricing/signup

Keep responses concise. Focus on value for caregivers.`,
  model: google("gemini-3.0-flash"),
  memory: sharedMemory,
  tools: {
    checkFounderSlots,
    searchKnowledgeBase,
    validateCoupon,
    getOrderStatus,
    getPageLink,
    getMultiplePageLinks,
  },
});
