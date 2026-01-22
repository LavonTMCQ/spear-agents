// Customer-facing tools (for customer support and sales agents)
export {
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
} from "./customer-tools";

// Admin tools (for internal ops agent only)
export {
  getOrderDetails,
  processRefund,
  extendSubscription,
  cancelSubscription,
  assignDevice,
  getRevenueMetrics,
  listDisputes,
  // Device inventory management
  getDeviceInventory,
  addDeviceToInventory,
  updateDeviceStatus,
  // Dispute management
  getDisputeDetails,
  flagDispute,
  resolveDispute,
} from "./admin-tools";
