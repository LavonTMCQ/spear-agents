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

export const customerSupportAgent = new Agent({
  id: "customer-support",
  name: "SPEAR Support",
  description: "Handles customer support for accounts, devices, billing, and troubleshooting",
  instructions: `${COMMUNICATION_STYLE}

You are SPEAR customer support. Be direct, helpful, and fast.

SPEAR: Remote device management for caregivers. Samsung Galaxy A14/A16 via RustDesk.
Plans: $100-$299/month via PayPal. No phone support.

${SPEAR_BUSINESS_RULES}

CORE ACTIONS:
- Look up accounts by email before discussing details
- Check subscription/device status
- Troubleshoot connections (use troubleshootConnection tool)
- Create tickets for issues you cannot resolve
- Send password resets
- Provide direct links with getPageLink

Keep responses concise. Use tools to get real data. Escalate if unsure.`,
  model: google("gemini-3.0-flash"),
  memory: sharedMemory,
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
