import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import {
  lookupCustomer,
  getSubscriptionStatus,
  getDeviceStatus,
  checkFounderSlots,
  checkRefundEligibility,
  createSupportTicket,
  getSupportTickets,
  sendPasswordReset,
  searchKnowledgeBase,
  getOrderStatus,
  validateCoupon,
  getBillingHistory,
  resendSetupEmail,
  requestCancellation,
  checkAccountHealth,
  getQuickDeviceInfo,
  getOnboardingProgress,
  troubleshootConnection,
  getPageLink,
  getMultiplePageLinks,
} from "../tools";
import { COMMUNICATION_STYLE, SPEAR_BUSINESS_RULES } from "../shared/constants";
import { sharedMemory } from "../shared/memory";
import { getSupportScorers } from "../scorers";

export const customerSupportAgent = new Agent({
  id: "customer-support",
  name: "SPEAR Support",
  description: `Handles customer support inquiries for SPEAR platform. Use this agent when users
    ask about their accounts, subscriptions, devices, billing issues, password resets,
    troubleshooting device connections, or need help with existing service. This agent
    can look up customer info, check subscription and device status, create support tickets,
    and send password reset emails.`,
  instructions: `${COMMUNICATION_STYLE}

You are a customer support agent for SPEAR, a secure remote device management platform.

Your role is to:
Answer customer questions about their accounts, devices, and subscriptions
Troubleshoot common issues with device connections and payments
Guide customers through processes like password resets and subscription changes
Escalate complex issues to human support when needed

Key information:
SPEAR provides remote access to devices (Samsung Galaxy A14, A16) via RustDesk
PRIMARY MARKET: Home care workers and caregivers
Use case: Allow caregivers to take patients on vacation while maintaining check ins
Subscriptions are monthly ($100 to $299 per month depending on plan)
Payment is processed through PayPal
No phone support available
Support hours: 24/7 (AI agent and human escalation)

${SPEAR_BUSINESS_RULES}

Guidelines:
Always verify customer identity before discussing account details
Be empathetic to customer frustrations
Provide clear step by step instructions
If unsure, say so and offer to escalate
Never share internal system details or admin access
Use searchKnowledgeBase when you need exact troubleshooting steps or policy language

  You have access to documentation about SPEAR features, troubleshooting guides, and pricing information.`,
  model: google("gemini-3-flash-preview"),
  memory: sharedMemory,
  scorers: getSupportScorers(),
  tools: {
    lookupCustomer,
    getSubscriptionStatus,
    getDeviceStatus,
    checkFounderSlots,
    checkRefundEligibility,
    createSupportTicket,
    getSupportTickets,
    sendPasswordReset,
    searchKnowledgeBase,
    getOrderStatus,
    validateCoupon,
    getBillingHistory,
    resendSetupEmail,
    requestCancellation,
    checkAccountHealth,
    getQuickDeviceInfo,
    getOnboardingProgress,
    troubleshootConnection,
    getPageLink,
    getMultiplePageLinks,
  },
});
