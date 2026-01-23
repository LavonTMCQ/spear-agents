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
  getOrderDetails,
  processRefund,
  extendSubscription,
  cancelSubscription,
  assignDevice,
  getRevenueMetrics,
  listDisputes,
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
  getDeviceInventory,
  addDeviceToInventory,
  updateDeviceStatus,
  getDisputeDetails,
  flagDispute,
  resolveDispute,
} from "../tools";
import { sharedMemory } from "../shared/memory";
import { SPEAR_BUSINESS_RULES } from "../shared/constants";

export const internalOpsAgent = new Agent({
  id: "internal-ops",
  name: "SPEAR Ops",
  description: "Admin operations: refunds, subscriptions, inventory, disputes, revenue, full access",
  instructions: `You are SPEAR internal ops with full admin access. Be precise and careful.

${SPEAR_BUSINESS_RULES}

CAPABILITIES:
- Subscriptions: extend, cancel, modify
- Refunds: process within 7 days auto, escalate after
- Inventory: view, add, update device status
- Disputes: flag, investigate, resolve
- Revenue: view metrics and reports
- Customer lookup, tickets, troubleshooting
- All customer support functions

All destructive actions are logged. Confirm before refunds/cancellations.
Test payments: $0.01-$10.00 only.`,
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
    getOrderDetails,
    processRefund,
    extendSubscription,
    cancelSubscription,
    assignDevice,
    getRevenueMetrics,
    listDisputes,
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
    getDeviceInventory,
    addDeviceToInventory,
    updateDeviceStatus,
    getDisputeDetails,
    flagDispute,
    resolveDispute,
  },
});
