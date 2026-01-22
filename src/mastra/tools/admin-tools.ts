import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const SPEAR_API_URL = process.env.SPEAR_API_URL || "https://www.spear-global.com/api";
const SPEAR_API_KEY = process.env.SPEAR_API_KEY || "";

// Helper to make API calls
async function spearApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${SPEAR_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(SPEAR_API_KEY && { Authorization: `Bearer ${SPEAR_API_KEY}` }),
      ...options.headers,
    },
  });
  return response.json();
}

// ============================================
// READ-ONLY TOOLS (no approval required)
// ============================================

export const getOrderDetails = createTool({
  id: "getOrderDetails",
  description: "Get full details of an order including payment information",
  inputSchema: z.object({
    orderId: z.string().describe("Order ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    order: z
      .object({
        id: z.string(),
        amount: z.number(),
        status: z.string(),
        paymentStatus: z.string(),
        fulfillmentStatus: z.string().nullable(),
        createdAt: z.string(),
        deliveredAt: z.string().nullable(),
      })
      .nullable(),
    customer: z
      .object({
        id: z.string(),
        email: z.string(),
        name: z.string().nullable(),
      })
      .nullable(),
    error: z.string().optional(),
  }),
  execute: async ({ orderId }) => {
    try {
      const data = await spearApi(`/admin/orders/${orderId}`);
      if (data.order) {
        return {
          success: true,
          order: {
            id: data.order.id,
            amount: data.order.amount,
            status: data.order.status,
            paymentStatus: data.order.paymentStatus,
            fulfillmentStatus: data.order.fulfillmentStatus,
            createdAt: data.order.createdAt,
            deliveredAt: data.order.deliveredAt,
          },
          customer: data.order.user
            ? {
                id: data.order.user.id,
                email: data.order.user.email,
                name: data.order.user.name,
              }
            : null,
        };
      }
      return { success: false, order: null, customer: null, error: "Order not found" };
    } catch (error) {
      return { success: false, order: null, customer: null, error: String(error) };
    }
  },
});

export const getRevenueMetrics = createTool({
  id: "getRevenueMetrics",
  description: "Get revenue and business metrics",
  inputSchema: z.object({
    period: z
      .enum(["day", "week", "month", "quarter", "year"])
      .default("month")
      .describe("Time period for metrics"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    metrics: z
      .object({
        mrr: z.number(),
        arr: z.number(),
        newSubscriptions: z.number(),
        churnedSubscriptions: z.number(),
        churnRate: z.number(),
        totalCustomers: z.number(),
        activeSubscriptions: z.number(),
      })
      .nullable(),
    error: z.string().optional(),
  }),
  execute: async ({ period }) => {
    try {
      const data = await spearApi(`/admin/revenue?period=${period}`);
      if (data) {
        return {
          success: true,
          metrics: {
            mrr: data.mrr || 0,
            arr: data.arr || 0,
            newSubscriptions: data.newSubscriptions || 0,
            churnedSubscriptions: data.churnedSubscriptions || 0,
            churnRate: data.churnRate || 0,
            totalCustomers: data.totalCustomers || 0,
            activeSubscriptions: data.activeSubscriptions || 0,
          },
        };
      }
      return { success: false, metrics: null, error: "No metrics available" };
    } catch (error) {
      return { success: false, metrics: null, error: String(error) };
    }
  },
});

export const listDisputes = createTool({
  id: "listDisputes",
  description: "List all open PayPal disputes",
  inputSchema: z.object({}),
  outputSchema: z.object({
    success: z.boolean(),
    disputes: z.array(
      z.object({
        id: z.string(),
        amount: z.number(),
        status: z.string(),
        reason: z.string().nullable(),
        createdAt: z.string(),
      })
    ),
    error: z.string().optional(),
  }),
  execute: async () => {
    try {
      const data = await spearApi("/admin/disputes");
      if (data.disputes) {
        return {
          success: true,
          disputes: data.disputes.map((d: any) => ({
            id: d.id,
            amount: d.amount,
            status: d.status,
            reason: d.reason,
            createdAt: d.createdAt,
          })),
        };
      }
      return { success: true, disputes: [] };
    } catch (error) {
      return { success: false, disputes: [], error: String(error) };
    }
  },
});

// ============================================
// DESTRUCTIVE TOOLS (require human approval)
// ============================================

export const processRefund = createTool({
  id: "processRefund",
  description:
    "Process a refund for an order. REQUIRES APPROVAL. Only use for orders within 7 day window unless explicitly authorized.",
  inputSchema: z.object({
    orderId: z.string().describe("Order ID to refund"),
    amount: z.number().optional().describe("Partial refund amount (full refund if omitted)"),
    reason: z
      .enum(["customer_request", "service_issue", "duplicate_charge", "fraud", "other"])
      .describe("Reason for refund"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    refundId: z.string().nullable(),
    amount: z.number().nullable(),
    error: z.string().optional(),
  }),
  // HITL: Requires human approval before executing
  requireApproval: true,
  execute: async ({ orderId, amount, reason }) => {
    try {
      const data = await spearApi(`/admin/orders/${orderId}/refund`, {
        method: "POST",
        body: JSON.stringify({ amount, reason }),
      });

      if (data.success) {
        return {
          success: true,
          refundId: data.refundId,
          amount: data.amount,
        };
      }
      return {
        success: false,
        refundId: null,
        amount: null,
        error: data.error || "Failed to process refund",
      };
    } catch (error) {
      return { success: false, refundId: null, amount: null, error: String(error) };
    }
  },
});

export const extendSubscription = createTool({
  id: "extendSubscription",
  description: "Extend a customer's subscription period as a goodwill gesture. REQUIRES APPROVAL.",
  inputSchema: z.object({
    subscriptionId: z.string().describe("Subscription ID"),
    days: z.number().min(1).max(365).describe("Number of days to extend"),
    reason: z.string().describe("Reason for extension (logged for audit)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    newPeriodEnd: z.string().nullable(),
    error: z.string().optional(),
  }),
  // HITL: Requires human approval before executing
  requireApproval: true,
  execute: async ({ subscriptionId, days, reason }) => {
    try {
      const data = await spearApi(`/admin/subscriptions/${subscriptionId}/extend`, {
        method: "POST",
        body: JSON.stringify({ days, reason }),
      });

      if (data.success) {
        return {
          success: true,
          newPeriodEnd: data.newPeriodEnd,
        };
      }
      return { success: false, newPeriodEnd: null, error: data.error || "Failed to extend" };
    } catch (error) {
      return { success: false, newPeriodEnd: null, error: String(error) };
    }
  },
});

export const cancelSubscription = createTool({
  id: "cancelSubscription",
  description:
    "Cancel a customer's subscription. DESTRUCTIVE ACTION. REQUIRES APPROVAL.",
  inputSchema: z.object({
    subscriptionId: z.string().describe("Subscription ID"),
    reason: z.string().describe("Reason for cancellation"),
    immediate: z
      .boolean()
      .default(false)
      .describe("If true, cancel immediately. If false, cancel at period end."),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    effectiveDate: z.string().nullable(),
    error: z.string().optional(),
  }),
  // HITL: Requires human approval before executing
  requireApproval: true,
  execute: async ({ subscriptionId, reason, immediate }) => {
    try {
      const data = await spearApi(`/admin/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason, immediate }),
      });

      if (data.success) {
        return {
          success: true,
          effectiveDate: data.effectiveDate,
        };
      }
      return { success: false, effectiveDate: null, error: data.error || "Failed to cancel" };
    } catch (error) {
      return { success: false, effectiveDate: null, error: String(error) };
    }
  },
});

export const assignDevice = createTool({
  id: "assignDevice",
  description: "Assign a device to a customer. REQUIRES APPROVAL.",
  inputSchema: z.object({
    deviceId: z.string().describe("Device ID"),
    customerId: z.string().describe("Customer ID"),
    orderId: z.string().optional().describe("Associated order ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    error: z.string().optional(),
  }),
  // HITL: Requires human approval before executing
  requireApproval: true,
  execute: async ({ deviceId, customerId, orderId }) => {
    try {
      const data = await spearApi(`/admin/devices/${deviceId}/assign`, {
        method: "POST",
        body: JSON.stringify({ customerId, orderId }),
      });

      return { success: data.success || false, error: data.error };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
});

// ============================================
// DEVICE INVENTORY MANAGEMENT
// ============================================

export const getDeviceInventory = createTool({
  id: "getDeviceInventory",
  description:
    "View device inventory with optional filtering. Shows all devices, their status, and assignment info. Use to check available devices, see what's shipped, or audit inventory.",
  inputSchema: z.object({
    status: z
      .enum(["available", "assigned", "shipped", "delivered", "inactive", "active", "pending"])
      .optional()
      .describe("Filter by device status"),
    deviceType: z
      .enum(["mobile", "desktop"])
      .optional()
      .describe("Filter by device type"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    devices: z.array(
      z.object({
        id: z.string(),
        name: z.string().nullable(),
        rustDeskId: z.string().nullable(),
        deviceType: z.string().nullable(),
        status: z.string(),
        assignedTo: z
          .object({
            id: z.string(),
            email: z.string(),
            name: z.string().nullable(),
          })
          .nullable(),
        createdAt: z.string().nullable(),
      })
    ),
    summary: z.object({
      total: z.number(),
      available: z.number(),
      assigned: z.number(),
      shipped: z.number(),
      delivered: z.number(),
      inactive: z.number(),
    }),
    error: z.string().optional(),
  }),
  execute: async ({ status, deviceType }) => {
    try {
      let url = "/agent/inventory";
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (deviceType) params.append("deviceType", deviceType);
      if (params.toString()) url += `?${params.toString()}`;

      const data = await spearApi(url);

      if (data.success) {
        return {
          success: true,
          devices: data.devices,
          summary: data.summary,
        };
      }

      return {
        success: false,
        devices: [],
        summary: { total: 0, available: 0, assigned: 0, shipped: 0, delivered: 0, inactive: 0 },
        error: data.error || "Failed to fetch inventory",
      };
    } catch (error) {
      return {
        success: false,
        devices: [],
        summary: { total: 0, available: 0, assigned: 0, shipped: 0, delivered: 0, inactive: 0 },
        error: String(error),
      };
    }
  },
});

export const addDeviceToInventory = createTool({
  id: "addDeviceToInventory",
  description:
    "Add a new device to inventory. Use when provisioning new devices. REQUIRES APPROVAL.",
  inputSchema: z.object({
    rustDeskId: z.string().describe("RustDesk ID of the device"),
    name: z.string().optional().describe("Friendly name for the device"),
    password: z.string().optional().describe("RustDesk password"),
    deviceType: z
      .enum(["mobile", "desktop"])
      .default("mobile")
      .describe("Type of device"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    device: z
      .object({
        id: z.string(),
        name: z.string(),
        rustDeskId: z.string(),
        status: z.string(),
      })
      .nullable(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  requireApproval: true,
  execute: async ({ rustDeskId, name, password, deviceType }) => {
    try {
      const data = await spearApi("/agent/inventory", {
        method: "POST",
        body: JSON.stringify({ rustDeskId, name, password, deviceType }),
      });

      if (data.success) {
        return {
          success: true,
          device: data.device,
          message: data.message,
        };
      }

      return {
        success: false,
        device: null,
        error: data.error || "Failed to add device",
      };
    } catch (error) {
      return { success: false, device: null, error: String(error) };
    }
  },
});

export const updateDeviceStatus = createTool({
  id: "updateDeviceStatus",
  description:
    "Update a device's status or unassign it from a customer. REQUIRES APPROVAL for status changes.",
  inputSchema: z.object({
    deviceId: z.string().describe("Device ID to update"),
    status: z
      .enum(["available", "assigned", "shipped", "delivered", "inactive", "active"])
      .optional()
      .describe("New status for the device"),
    unassign: z
      .boolean()
      .optional()
      .describe("Set to true to unassign device from current customer"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    device: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        status: z.string(),
        previousStatus: z.string(),
      })
      .nullable(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  requireApproval: true,
  execute: async ({ deviceId, status, unassign }) => {
    try {
      const data = await spearApi("/agent/inventory", {
        method: "PATCH",
        body: JSON.stringify({ deviceId, status, unassign }),
      });

      if (data.success) {
        return {
          success: true,
          device: data.device,
          message: data.message,
        };
      }

      return {
        success: false,
        device: null,
        error: data.error || "Failed to update device",
      };
    } catch (error) {
      return { success: false, device: null, error: String(error) };
    }
  },
});

// ============================================
// DISPUTE MANAGEMENT
// ============================================

export const getDisputeDetails = createTool({
  id: "getDisputeDetails",
  description:
    "Get detailed information about a specific dispute or list all disputes with filtering.",
  inputSchema: z.object({
    disputeId: z.string().optional().describe("Specific dispute ID to look up"),
    status: z
      .enum(["open", "in_progress", "resolved", "closed"])
      .optional()
      .describe("Filter by status when listing disputes"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    dispute: z
      .object({
        id: z.string(),
        subject: z.string(),
        description: z.string().nullable(),
        status: z.string(),
        priority: z.string().nullable(),
        customer: z
          .object({
            id: z.string(),
            email: z.string(),
            name: z.string().nullable(),
          })
          .nullable(),
        createdAt: z.string().nullable(),
      })
      .nullable(),
    disputes: z
      .array(
        z.object({
          id: z.string(),
          subject: z.string(),
          status: z.string(),
          priority: z.string().nullable(),
          customer: z
            .object({
              id: z.string(),
              email: z.string(),
              name: z.string().nullable(),
            })
            .nullable(),
          createdAt: z.string().nullable(),
        })
      )
      .optional(),
    summary: z
      .object({
        total: z.number(),
        open: z.number(),
        inProgress: z.number(),
        resolved: z.number(),
      })
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ disputeId, status }) => {
    try {
      let url = "/agent/disputes";
      const params = new URLSearchParams();
      if (disputeId) params.append("id", disputeId);
      if (status) params.append("status", status);
      if (params.toString()) url += `?${params.toString()}`;

      const data = await spearApi(url);

      if (data.success) {
        return {
          success: true,
          dispute: data.dispute || null,
          disputes: data.disputes || undefined,
          summary: data.summary || undefined,
        };
      }

      return {
        success: false,
        dispute: null,
        error: data.error || "Failed to fetch dispute(s)",
      };
    } catch (error) {
      return { success: false, dispute: null, error: String(error) };
    }
  },
});

export const flagDispute = createTool({
  id: "flagDispute",
  description:
    "Flag a new dispute for admin review. Use when a customer reports a PayPal dispute, chargeback, or payment issue that needs investigation.",
  inputSchema: z.object({
    email: z.string().email().describe("Customer's email address"),
    orderId: z.string().optional().describe("Associated order ID if known"),
    amount: z.number().optional().describe("Disputed amount"),
    reason: z.string().describe("Reason for the dispute"),
    source: z
      .enum(["paypal", "bank", "customer_complaint", "other"])
      .default("paypal")
      .describe("Source of the dispute"),
    paypalDisputeId: z.string().optional().describe("PayPal dispute ID if from PayPal"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    disputeId: z.string().nullable(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ email, orderId, amount, reason, source, paypalDisputeId }) => {
    try {
      const data = await spearApi("/agent/disputes", {
        method: "POST",
        body: JSON.stringify({ email, orderId, amount, reason, source, paypalDisputeId }),
      });

      if (data.success) {
        return {
          success: true,
          disputeId: data.disputeId,
          message: data.message,
        };
      }

      return {
        success: false,
        disputeId: null,
        error: data.error || "Failed to flag dispute",
      };
    } catch (error) {
      return { success: false, disputeId: null, error: String(error) };
    }
  },
});

export const resolveDispute = createTool({
  id: "resolveDispute",
  description:
    "Resolve or update a dispute status. REQUIRES APPROVAL. Use after investigating and determining outcome.",
  inputSchema: z.object({
    disputeId: z.string().describe("Dispute ID to resolve"),
    status: z
      .enum(["in_progress", "resolved", "closed"])
      .describe("New status for the dispute"),
    resolution: z
      .enum(["refund_issued", "no_action", "subscription_extended", "customer_satisfied", "lost_dispute", "won_dispute", "other"])
      .optional()
      .describe("Resolution type"),
    notes: z.string().optional().describe("Notes about the resolution"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    dispute: z
      .object({
        id: z.string(),
        status: z.string(),
        previousStatus: z.string(),
      })
      .nullable(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  requireApproval: true,
  execute: async ({ disputeId, status, resolution, notes }) => {
    try {
      const data = await spearApi("/agent/disputes", {
        method: "PATCH",
        body: JSON.stringify({ disputeId, status, resolution, notes }),
      });

      if (data.success) {
        return {
          success: true,
          dispute: data.dispute,
          message: data.message,
        };
      }

      return {
        success: false,
        dispute: null,
        error: data.error || "Failed to resolve dispute",
      };
    } catch (error) {
      return { success: false, dispute: null, error: String(error) };
    }
  },
});
