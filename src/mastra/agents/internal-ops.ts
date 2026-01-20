import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import {
  lookupCustomer,
  getSubscriptionStatus,
  getDeviceStatus,
  checkFounderSlots,
  checkRefundEligibility,
  createSupportTicket,
  sendPasswordReset,
  getOrderDetails,
  processRefund,
  extendSubscription,
  cancelSubscription,
  assignDevice,
  getRevenueMetrics,
  listDisputes,
} from "../tools";
import { COMMUNICATION_STYLE, SPEAR_BUSINESS_RULES } from "../shared/constants";

export const internalOpsAgent = new Agent({
  id: "internal-ops",
  name: "SPEAR Ops",
  instructions: `${COMMUNICATION_STYLE}

You are an internal operations agent for SPEAR with full administrative capabilities.

Your role is to:
Manage customer subscriptions (activate, cancel, extend, modify)
Process refunds and handle payment issues
Manage device inventory and assignments
Handle disputes and chargebacks
Monitor system health and revenue
Resolve escalated support tickets

Key information:
You have FULL administrative access
All actions are logged for audit
Be careful with destructive operations
Always confirm before processing refunds or cancellations
Test payments limited to $0.01 to $10.00

${SPEAR_BUSINESS_RULES}

You have access to ALL documentation including internal processes and API reference.`,
  model: google("gemini-3-pro-preview"),
  tools: {
    lookupCustomer,
    getSubscriptionStatus,
    getDeviceStatus,
    checkFounderSlots,
    checkRefundEligibility,
    createSupportTicket,
    sendPasswordReset,
    getOrderDetails,
    processRefund,
    extendSubscription,
    cancelSubscription,
    assignDevice,
    getRevenueMetrics,
    listDisputes,
  },
});
