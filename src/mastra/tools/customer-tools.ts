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

export const lookupCustomer = createTool({
  id: "lookupCustomer",
  description: "Look up a customer by their email address",
  inputSchema: z.object({
    email: z.string().email().describe("Customer's email address"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    customer: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
        role: z.string(),
        subscriptionStatus: z.string().nullable(),
        createdAt: z.string(),
      })
      .nullable(),
    error: z.string().optional(),
  }),
  execute: async ({ email }) => {
    try {
      const data = await spearApi(`/admin/clients?search=${encodeURIComponent(email)}`);
      if (data.clients && data.clients.length > 0) {
        const client = data.clients[0];
        return {
          success: true,
          customer: {
            id: client.id,
            name: client.name,
            email: client.email,
            role: client.role,
            subscriptionStatus: client.subscription?.status || null,
            createdAt: client.createdAt,
          },
        };
      }
      return { success: false, customer: null, error: "Customer not found" };
    } catch (error) {
      return { success: false, customer: null, error: String(error) };
    }
  },
});

export const getSubscriptionStatus = createTool({
  id: "getSubscriptionStatus",
  description: "Get detailed subscription information for a customer",
  inputSchema: z.object({
    customerId: z.string().describe("Customer's unique ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    subscription: z
      .object({
        status: z.string(),
        planType: z.string().nullable(),
        currentPeriodEnd: z.string().nullable(),
        cancelAtPeriodEnd: z.boolean(),
      })
      .nullable(),
    error: z.string().optional(),
  }),
  execute: async ({ customerId }) => {
    try {
      const data = await spearApi(`/admin/subscriptions/${customerId}`);
      if (data.subscription) {
        return {
          success: true,
          subscription: {
            status: data.subscription.status,
            planType: data.subscription.planType,
            currentPeriodEnd: data.subscription.currentPeriodEnd,
            cancelAtPeriodEnd: data.subscription.cancelAtPeriodEnd || false,
          },
        };
      }
      return { success: false, subscription: null, error: "No subscription found" };
    } catch (error) {
      return { success: false, subscription: null, error: String(error) };
    }
  },
});

export const getDeviceStatus = createTool({
  id: "getDeviceStatus",
  description: "Get device connection status for a customer",
  inputSchema: z.object({
    customerId: z.string().optional().describe("Customer's unique ID"),
    deviceId: z.string().optional().describe("Specific device ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    devices: z.array(
      z.object({
        deviceId: z.string(),
        rustDeskId: z.string().nullable(),
        status: z.string(),
        lastSeen: z.string().nullable(),
        isOnline: z.boolean(),
      })
    ),
    error: z.string().optional(),
  }),
  execute: async ({ customerId, deviceId }) => {
    try {
      let endpoint = "/admin/devices";
      const params = new URLSearchParams();
      if (customerId) params.append("customerId", customerId);
      if (deviceId) params.append("deviceId", deviceId);
      if (params.toString()) endpoint += `?${params.toString()}`;

      const data = await spearApi(endpoint);
      if (data.devices) {
        return {
          success: true,
          devices: data.devices.map((d: any) => ({
            deviceId: d.id,
            rustDeskId: d.rustDeskId,
            status: d.status,
            lastSeen: d.lastSeen,
            isOnline: d.status === "active",
          })),
        };
      }
      return { success: false, devices: [], error: "No devices found" };
    } catch (error) {
      return { success: false, devices: [], error: String(error) };
    }
  },
});

export const checkFounderSlots = createTool({
  id: "checkFounderSlots",
  description:
    "Check if founder's pricing slots are available. MUST call before quoting $100/month pricing.",
  inputSchema: z.object({}),
  outputSchema: z.object({
    available: z.boolean(),
    remaining: z.number(),
    total: z.number(),
  }),
  execute: async () => {
    try {
      const data = await spearApi("/founder-slots");
      return {
        available: data.remaining > 0,
        remaining: data.remaining,
        total: data.total || 100,
      };
    } catch (error) {
      // Default to unavailable if API fails
      return { available: false, remaining: 0, total: 100 };
    }
  },
});

export const checkRefundEligibility = createTool({
  id: "checkRefundEligibility",
  description:
    "Check if an order is eligible for auto-approved refund (within 7 days of delivery)",
  inputSchema: z.object({
    orderId: z.string().describe("Order ID to check"),
  }),
  outputSchema: z.object({
    eligible: z.boolean(),
    reason: z.string(),
    deliveryDate: z.string().nullable(),
    daysSinceDelivery: z.number().nullable(),
  }),
  execute: async ({ orderId }) => {
    try {
      const data = await spearApi(`/admin/orders/${orderId}`);
      if (!data.order) {
        return {
          eligible: false,
          reason: "Order not found",
          deliveryDate: null,
          daysSinceDelivery: null,
        };
      }

      const order = data.order;
      if (!order.deliveredAt) {
        return {
          eligible: false,
          reason: "Order has not been delivered yet",
          deliveryDate: null,
          daysSinceDelivery: null,
        };
      }

      const deliveryDate = new Date(order.deliveredAt);
      const now = new Date();
      const daysSinceDelivery = Math.floor(
        (now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceDelivery <= 7) {
        return {
          eligible: true,
          reason: "Within 7-day auto-approval window",
          deliveryDate: order.deliveredAt,
          daysSinceDelivery,
        };
      }

      return {
        eligible: false,
        reason: "Outside 7-day window - requires admin approval",
        deliveryDate: order.deliveredAt,
        daysSinceDelivery,
      };
    } catch (error) {
      return {
        eligible: false,
        reason: String(error),
        deliveryDate: null,
        daysSinceDelivery: null,
      };
    }
  },
});

export const createSupportTicket = createTool({
  id: "createSupportTicket",
  description: "Create a support ticket for issues that need human escalation",
  inputSchema: z.object({
    customerId: z.string().describe("Customer's unique ID"),
    subject: z.string().max(200).describe("Ticket subject"),
    description: z.string().max(5000).describe("Detailed description"),
    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .default("medium")
      .describe("Ticket priority"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    ticketId: z.string().nullable(),
    error: z.string().optional(),
  }),
  execute: async ({ customerId, subject, description, priority }) => {
    try {
      const data = await spearApi("/support-tickets", {
        method: "POST",
        body: JSON.stringify({
          customerId,
          subject,
          description,
          priority,
        }),
      });

      if (data.ticket) {
        return { success: true, ticketId: data.ticket.id };
      }
      return { success: false, ticketId: null, error: "Failed to create ticket" };
    } catch (error) {
      return { success: false, ticketId: null, error: String(error) };
    }
  },
});

export const sendPasswordReset = createTool({
  id: "sendPasswordReset",
  description: "Send a password reset email to a customer",
  inputSchema: z.object({
    email: z.string().email().describe("Customer's email address"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ email }) => {
    try {
      await spearApi("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      return {
        success: true,
        message: "Password reset email sent if account exists",
      };
    } catch (error) {
      return { success: false, message: String(error) };
    }
  },
});
