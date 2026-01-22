import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { formatRagContext, retrieveKnowledge } from "../rag/retrieval";

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
  description:
    "Get detailed subscription information for a customer by their email address. Returns subscription status, plan type, billing period, and cancellation status.",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address to look up their subscription"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    user: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
      })
      .nullable(),
    subscription: z
      .object({
        id: z.string(),
        status: z.string(),
        planType: z.string().nullable(),
        currentPeriodStart: z.string().nullable(),
        currentPeriodEnd: z.string().nullable(),
        cancelAtPeriodEnd: z.boolean(),
        createdAt: z.string().nullable(),
      })
      .nullable(),
    error: z.string().optional(),
  }),
  execute: async ({ email }) => {
    try {
      const data = await spearApi(`/agent/subscription?email=${encodeURIComponent(email)}`);

      if (data.success) {
        return {
          success: true,
          user: data.user,
          subscription: data.subscription
            ? {
                id: data.subscription.id,
                status: data.subscription.status,
                planType: data.subscription.planType,
                currentPeriodStart: data.subscription.currentPeriodStart,
                currentPeriodEnd: data.subscription.currentPeriodEnd,
                cancelAtPeriodEnd: data.subscription.cancelAtPeriodEnd || false,
                createdAt: data.subscription.createdAt,
              }
            : null,
        };
      }

      return {
        success: false,
        user: null,
        subscription: null,
        error: data.error || "Failed to fetch subscription",
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        subscription: null,
        error: String(error),
      };
    }
  },
});

export const getDeviceStatus = createTool({
  id: "getDeviceStatus",
  description:
    "Get device information for a customer by their email address. Returns device details including name, RustDesk ID, connection status, model, and platform.",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address to look up their devices"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    user: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
        hasActiveSubscription: z.boolean(),
        subscriptionStatus: z.string().nullable(),
      })
      .nullable(),
    devices: z.array(
      z.object({
        id: z.string(),
        name: z.string().nullable(),
        rustDeskId: z.string().nullable(),
        password: z.string().nullable(),
        model: z.string(),
        status: z.string(),
        platform: z.string(),
        lastSeen: z.string().nullable(),
        isOnline: z.boolean(),
      })
    ),
    deviceCount: z.number(),
    error: z.string().optional(),
  }),
  execute: async ({ email }) => {
    try {
      const data = await spearApi(`/agent/devices?email=${encodeURIComponent(email)}`);

      if (data.success && data.devices) {
        return {
          success: true,
          user: data.user,
          devices: data.devices.map((d: any) => ({
            id: d.id,
            name: d.name,
            rustDeskId: d.rustDeskId,
            password: d.password,
            model: d.model,
            status: d.status,
            platform: d.platform,
            lastSeen: d.lastSeen,
            isOnline: d.status === "active" || d.status === "online",
          })),
          deviceCount: data.deviceCount,
        };
      }

      return {
        success: false,
        user: null,
        devices: [],
        deviceCount: 0,
        error: data.error || "No devices found",
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        devices: [],
        deviceCount: 0,
        error: String(error),
      };
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
  description:
    "Create a support ticket for issues that need human escalation. Use this when you cannot resolve the customer's issue and need to involve a human support agent.",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address"),
    subject: z.string().max(200).describe("Brief summary of the issue"),
    description: z
      .string()
      .max(5000)
      .describe("Detailed description of the issue and what has been tried"),
    category: z
      .enum(["technical", "billing", "account", "feature", "other"])
      .default("technical")
      .describe("Category of the support issue"),
    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .default("medium")
      .describe("Ticket priority - use urgent only for critical issues"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    ticket: z
      .object({
        id: z.string(),
        subject: z.string(),
        category: z.string(),
        priority: z.string(),
        status: z.string(),
        createdAt: z.string().nullable(),
      })
      .nullable(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ email, subject, description, category, priority }) => {
    try {
      const data = await spearApi("/agent/tickets", {
        method: "POST",
        body: JSON.stringify({
          email,
          subject,
          description,
          category,
          priority,
        }),
      });

      if (data.success && data.ticket) {
        return {
          success: true,
          ticket: data.ticket,
          message: data.message || `Ticket created with ID: ${data.ticket.id}`,
        };
      }
      return {
        success: false,
        ticket: null,
        error: data.error || "Failed to create ticket",
      };
    } catch (error) {
      return { success: false, ticket: null, error: String(error) };
    }
  },
});

export const getSupportTickets = createTool({
  id: "getSupportTickets",
  description:
    "View existing support tickets for a customer by their email address. Use this to check on ticket status or see ticket history.",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address to look up their tickets"),
    status: z
      .enum(["all", "open", "in_progress", "closed"])
      .default("all")
      .describe("Filter tickets by status"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    user: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
      })
      .nullable(),
    tickets: z.array(
      z.object({
        id: z.string(),
        subject: z.string(),
        description: z.string(),
        category: z.string(),
        status: z.string(),
        priority: z.string(),
        adminNotes: z.string().nullable(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
        closedAt: z.string().nullable(),
      })
    ),
    ticketCount: z.number(),
    openCount: z.number(),
    inProgressCount: z.number(),
    error: z.string().optional(),
  }),
  execute: async ({ email, status }) => {
    try {
      const statusParam = status !== "all" ? `&status=${status}` : "";
      const data = await spearApi(
        `/agent/tickets?email=${encodeURIComponent(email)}${statusParam}`
      );

      if (data.success) {
        return {
          success: true,
          user: data.user,
          tickets: data.tickets || [],
          ticketCount: data.ticketCount || 0,
          openCount: data.openCount || 0,
          inProgressCount: data.inProgressCount || 0,
        };
      }

      return {
        success: false,
        user: null,
        tickets: [],
        ticketCount: 0,
        openCount: 0,
        inProgressCount: 0,
        error: data.error || "Failed to fetch tickets",
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        tickets: [],
        ticketCount: 0,
        openCount: 0,
        inProgressCount: 0,
        error: String(error),
      };
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

export const searchKnowledgeBase = createTool({
  id: "searchKnowledgeBase",
  description: "Search the SPEAR knowledge base for policies, runbooks, and troubleshooting steps",
  inputSchema: z.object({
    query: z.string().min(3).describe("Natural language search query"),
    topK: z.number().min(1).max(10).optional().describe("Number of results to return"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    context: z.string(),
    results: z.array(
      z.object({
        score: z.number().optional(),
        source: z.string().optional(),
        text: z.string(),
      })
    ),
  }),
  execute: async ({ query, topK }) => {
    const results = await retrieveKnowledge(query, { topK });
    const formatted = formatRagContext(results, topK ?? undefined);

    return {
      success: results.length > 0,
      context: formatted,
      results: results.map((result) => ({
        score: result.score,
        source: (result.metadata?.source || result.metadata?.path || "kb") as string,
        text: (result.metadata?.text || "").toString(),
      })),
    };
  },
});

export const getOrderStatus = createTool({
  id: "getOrderStatus",
  description:
    "Get order and shipping information for a customer by their email address. Returns order status, tracking number, and shipping details. Use this when customers ask 'where is my device?' or 'what's my order status?'",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address to look up their orders"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    user: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
      })
      .nullable(),
    orders: z.array(
      z.object({
        id: z.string(),
        status: z.string(),
        statusLabel: z.string(),
        statusDescription: z.string(),
        subscriptionPlan: z.string(),
        amount: z.number(),
        trackingNumber: z.string().nullable(),
        hasTracking: z.boolean(),
        shippingAddress: z
          .object({
            street: z.string().nullable(),
            city: z.string().nullable(),
            state: z.string().nullable(),
            zip: z.string().nullable(),
            country: z.string(),
          })
          .nullable(),
        createdAt: z.string().nullable(),
        statusHistory: z.array(
          z.object({
            status: z.string(),
            statusLabel: z.string(),
            notes: z.string().nullable(),
            date: z.string().nullable(),
          })
        ),
      })
    ),
    orderCount: z.number(),
    latestOrder: z
      .object({
        id: z.string(),
        status: z.string(),
        statusLabel: z.string(),
        statusDescription: z.string(),
        trackingNumber: z.string().nullable(),
        hasTracking: z.boolean(),
      })
      .nullable(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ email }) => {
    try {
      const data = await spearApi(`/agent/orders?email=${encodeURIComponent(email)}`);

      if (data.success) {
        return {
          success: true,
          user: data.user,
          orders: data.orders || [],
          orderCount: data.orderCount || 0,
          latestOrder: data.latestOrder || null,
          message: data.message,
        };
      }

      return {
        success: false,
        user: null,
        orders: [],
        orderCount: 0,
        latestOrder: null,
        error: data.error || "Failed to fetch orders",
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        orders: [],
        orderCount: 0,
        latestOrder: null,
        error: String(error),
      };
    }
  },
});

export const validateCoupon = createTool({
  id: "validateCoupon",
  description:
    "Validate a coupon code to check if it's valid and what discount it provides. Use this when a customer asks if their coupon code is valid. NOTE: Do NOT give out or suggest coupon codes - only validate codes the customer already has.",
  inputSchema: z.object({
    code: z.string().min(1).describe("The coupon code to validate"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    valid: z.boolean(),
    code: z.string(),
    discountType: z.string().optional(),
    discountValue: z.number().optional(),
    discountDescription: z.string().optional(),
    discountAmount: z.string().optional(),
    applicablePlans: z.array(z.string()).optional(),
    applicablePlansDescription: z.string().optional(),
    validUntil: z.string().nullable().optional(),
    usesRemaining: z.number().nullable().optional(),
    reason: z.string().optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ code }) => {
    try {
      const data = await spearApi(
        `/agent/coupons/validate?code=${encodeURIComponent(code)}`
      );

      if (data.success) {
        return {
          success: true,
          valid: data.valid,
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          discountDescription: data.discountDescription,
          discountAmount: data.discountAmount,
          applicablePlans: data.applicablePlans,
          applicablePlansDescription: data.applicablePlansDescription,
          validUntil: data.validUntil,
          usesRemaining: data.usesRemaining,
          reason: data.reason,
          message: data.message,
        };
      }

      return {
        success: false,
        valid: false,
        code: code.toUpperCase(),
        error: data.error || "Failed to validate coupon",
      };
    } catch (error) {
      return {
        success: false,
        valid: false,
        code: code.toUpperCase(),
        error: String(error),
      };
    }
  },
});

export const getBillingHistory = createTool({
  id: "getBillingHistory",
  description:
    "Get billing history for a customer by their email address. Returns invoices, orders, payment totals, and current subscription status. Use when customers ask 'what have I paid?' or 'show my billing history'.",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address to look up billing history"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    user: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
      })
      .nullable(),
    billing: z
      .object({
        totalPaid: z.number(),
        invoiceCount: z.number(),
        orderCount: z.number(),
        history: z.array(
          z.object({
            id: z.string(),
            type: z.enum(["invoice", "order"]),
            amount: z.number(),
            description: z.string(),
            status: z.string(),
            date: z.string().nullable(),
          })
        ),
        currentSubscription: z
          .object({
            status: z.string(),
            planType: z.string().nullable(),
            currentPeriodEnd: z.string().nullable(),
            cancelAtPeriodEnd: z.boolean(),
          })
          .nullable(),
      })
      .nullable(),
    error: z.string().optional(),
  }),
  execute: async ({ email }) => {
    try {
      const data = await spearApi(`/agent/billing?email=${encodeURIComponent(email)}`);

      if (data.success) {
        return {
          success: true,
          user: data.user,
          billing: data.billing,
        };
      }

      return {
        success: false,
        user: null,
        billing: null,
        error: data.error || "Failed to fetch billing history",
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        billing: null,
        error: String(error),
      };
    }
  },
});

export const resendSetupEmail = createTool({
  id: "resendSetupEmail",
  description:
    "Resend the setup/welcome email to a customer. Use when a customer says they lost their setup instructions or never received the welcome email.",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address to resend setup email to"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    emailsSent: z.array(z.string()).optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ email }) => {
    try {
      const data = await spearApi("/agent/resend-setup", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (data.success) {
        return {
          success: true,
          emailsSent: data.emailsSent,
          message: data.message,
        };
      }

      return {
        success: false,
        error: data.error || "Failed to resend setup email",
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
      };
    }
  },
});

export const requestCancellation = createTool({
  id: "requestCancellation",
  description:
    "Submit a subscription cancellation request for a customer. This creates a support ticket for admin review - it does NOT immediately cancel. Use when a customer explicitly asks to cancel their subscription. Always try to understand their reason first and see if there's an alternative solution.",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address"),
    reason: z
      .string()
      .optional()
      .describe("Reason for cancellation (helps us improve)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    ticketId: z.string().optional(),
    alreadyRequested: z.boolean().optional(),
    message: z.string().optional(),
    subscription: z
      .object({
        status: z.string(),
        currentPeriodEnd: z.string().nullable(),
      })
      .nullable()
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ email, reason }) => {
    try {
      const data = await spearApi("/agent/cancel-request", {
        method: "POST",
        body: JSON.stringify({ email, reason }),
      });

      if (data.success) {
        return {
          success: true,
          ticketId: data.ticketId,
          alreadyRequested: data.alreadyRequested || false,
          message: data.message,
          subscription: data.subscription,
        };
      }

      return {
        success: false,
        error: data.error || "Failed to submit cancellation request",
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
      };
    }
  },
});
