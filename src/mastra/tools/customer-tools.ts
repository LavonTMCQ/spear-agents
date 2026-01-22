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

export const checkAccountHealth = createTool({
  id: "checkAccountHealth",
  description:
    "Comprehensive account health check - shows subscription status, device status, payment status, and any issues that need attention. Use this when customers ask 'is everything okay with my account?' or 'check my account' or as a first step when helping customers.",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address to check account health"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    user: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
        memberSince: z.string().nullable(),
        accountAge: z.string(),
      })
      .nullable(),
    health: z
      .object({
        overall: z.object({
          status: z.enum(["good", "warning", "action_needed"]),
          message: z.string(),
        }),
        subscription: z.object({
          status: z.enum(["good", "warning", "action_needed"]),
          message: z.string(),
          details: z
            .object({
              planType: z.string().nullable(),
              currentPeriodEnd: z.string().nullable(),
              cancelAtPeriodEnd: z.boolean(),
            })
            .nullable(),
        }),
        devices: z.object({
          status: z.enum(["good", "warning", "action_needed"]),
          message: z.string(),
          total: z.number(),
          online: z.number(),
        }),
        order: z.object({
          status: z.enum(["good", "warning", "action_needed"]),
          message: z.string(),
        }),
      })
      .nullable(),
    issues: z.array(
      z.object({
        type: z.string(),
        severity: z.enum(["low", "medium", "high"]),
        message: z.string(),
        action: z.string().optional(),
      })
    ),
    openTickets: z.number(),
    error: z.string().optional(),
  }),
  execute: async ({ email }) => {
    try {
      const data = await spearApi(`/agent/health-check?email=${encodeURIComponent(email)}`);

      if (data.success) {
        return {
          success: true,
          user: data.user,
          health: data.health,
          issues: data.issues || [],
          openTickets: data.openTickets || 0,
        };
      }

      return {
        success: false,
        user: null,
        health: null,
        issues: [],
        openTickets: 0,
        error: data.error || "Failed to check account health",
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        health: null,
        issues: [],
        openTickets: 0,
        error: String(error),
      };
    }
  },
});

export const getQuickDeviceInfo = createTool({
  id: "getQuickDeviceInfo",
  description:
    "Quick access to customer's device credentials - RustDesk ID and password. Use when customers ask 'what's my device ID?' or 'what's my RustDesk password?' or need to connect to their device. Returns only the essential connection info.",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    devices: z.array(
      z.object({
        name: z.string().nullable(),
        rustDeskId: z.string().nullable(),
        password: z.string().nullable(),
        status: z.string(),
        isOnline: z.boolean(),
      })
    ),
    deviceCount: z.number(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ email }) => {
    try {
      const data = await spearApi(`/agent/devices?email=${encodeURIComponent(email)}`);

      if (data.success && data.devices) {
        const devices = data.devices.map((d: any) => ({
          name: d.name || `Device ${d.rustDeskId || "Unknown"}`,
          rustDeskId: d.rustDeskId,
          password: d.password,
          status: d.status,
          isOnline: d.status === "active" || d.status === "online",
        }));

        if (devices.length === 0) {
          return {
            success: true,
            devices: [],
            deviceCount: 0,
            message: "No devices found on this account. Need help setting one up?",
          };
        }

        return {
          success: true,
          devices,
          deviceCount: devices.length,
        };
      }

      return {
        success: false,
        devices: [],
        deviceCount: 0,
        error: data.error || "Could not retrieve device info",
      };
    } catch (error) {
      return {
        success: false,
        devices: [],
        deviceCount: 0,
        error: String(error),
      };
    }
  },
});

export const getOnboardingProgress = createTool({
  id: "getOnboardingProgress",
  description:
    "Check a customer's onboarding/setup progress. Shows which steps are complete, what's next, and provides guidance. Use when new customers ask 'how do I get started?' or 'what do I do next?' or 'am I set up correctly?'",
  inputSchema: z.object({
    email: z
      .string()
      .email()
      .describe("Customer's email address"),
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
    onboarding: z
      .object({
        status: z.enum(["not_started", "in_progress", "complete"]),
        flowType: z.enum(["byod", "furnished"]),
        progress: z.object({
          completed: z.number(),
          total: z.number(),
          percent: z.number(),
        }),
        currentStep: z
          .object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            helpText: z.string().optional(),
          })
          .nullable(),
        nextAction: z.string(),
        steps: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            completed: z.boolean(),
            current: z.boolean(),
            helpText: z.string().optional(),
          })
        ),
      })
      .nullable(),
    error: z.string().optional(),
  }),
  execute: async ({ email }) => {
    try {
      const data = await spearApi(`/agent/onboarding?email=${encodeURIComponent(email)}`);

      if (data.success) {
        return {
          success: true,
          user: data.user,
          onboarding: data.onboarding,
        };
      }

      return {
        success: false,
        user: null,
        onboarding: null,
        error: data.error || "Failed to get onboarding progress",
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        onboarding: null,
        error: String(error),
      };
    }
  },
});

export const troubleshootConnection = createTool({
  id: "troubleshootConnection",
  description:
    "Interactive connection troubleshooter. Use when customers report 'device won't connect', 'connection issues', 'device offline', or similar problems. Gathers info about their situation and provides targeted troubleshooting steps.",
  inputSchema: z.object({
    email: z.string().email().describe("Customer's email address"),
    symptom: z
      .enum([
        "device_offline",
        "connection_timeout",
        "connection_drops",
        "wrong_password",
        "other",
      ])
      .describe("The main symptom they're experiencing"),
    additionalInfo: z
      .string()
      .optional()
      .describe("Any additional details about the issue"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    diagnosis: z.string(),
    steps: z.array(
      z.object({
        step: z.number(),
        action: z.string(),
        details: z.string().optional(),
      })
    ),
    deviceStatus: z
      .object({
        name: z.string().nullable(),
        rustDeskId: z.string().nullable(),
        status: z.string(),
        isOnline: z.boolean(),
      })
      .nullable(),
    escalate: z.boolean(),
    escalateReason: z.string().optional(),
  }),
  execute: async ({ email, symptom, additionalInfo }) => {
    // First, get device status
    let deviceStatus = null;
    try {
      const deviceData = await spearApi(`/agent/devices?email=${encodeURIComponent(email)}`);
      if (deviceData.success && deviceData.devices && deviceData.devices.length > 0) {
        const d = deviceData.devices[0];
        deviceStatus = {
          name: d.name,
          rustDeskId: d.rustDeskId,
          status: d.status,
          isOnline: d.status === "active" || d.status === "online",
        };
      }
    } catch (e) {
      // Continue without device status
    }

    // Build troubleshooting response based on symptom
    const troubleshootingGuides: Record<
      string,
      { diagnosis: string; steps: { step: number; action: string; details?: string }[] }
    > = {
      device_offline: {
        diagnosis:
          "Device showing offline usually means the device is powered off, lost internet, or RustDesk isn't running.",
        steps: [
          {
            step: 1,
            action: "Check if the device is powered on",
            details: "Look for screen activity or power indicator light",
          },
          {
            step: 2,
            action: "Verify WiFi connection on the device",
            details: "Look for the WiFi icon in the status bar. If not connected, reconnect to WiFi.",
          },
          {
            step: 3,
            action: "Open the RustDesk app on the device",
            details: "RustDesk must be running for remote connections to work. Open the app and make sure it shows your ID.",
          },
          {
            step: 4,
            action: "Restart the device if still offline",
            details: "Power off completely, wait 10 seconds, then power back on.",
          },
          {
            step: 5,
            action: "Check the dashboard again",
            details: "After a minute, refresh the SPEAR dashboard to see if device shows online.",
          },
        ],
      },
      connection_timeout: {
        diagnosis:
          "Connection timeouts usually indicate network issues or the device not responding.",
        steps: [
          {
            step: 1,
            action: "Try connecting again",
            details: "Sometimes connections work on retry. Click Connect again.",
          },
          {
            step: 2,
            action: "Check your own internet connection",
            details: "Make sure you have stable internet where you're connecting from.",
          },
          {
            step: 3,
            action: "Verify device has good WiFi signal",
            details: "If device is far from router, try moving it closer.",
          },
          {
            step: 4,
            action: "Restart RustDesk on the device",
            details: "Close and reopen RustDesk app on the device.",
          },
          {
            step: 5,
            action: "Try connecting from mobile data",
            details: "If on restricted network (work, hospital), try using phone hotspot instead.",
          },
        ],
      },
      connection_drops: {
        diagnosis:
          "Frequent disconnections are usually caused by unstable WiFi or device sleep settings.",
        steps: [
          {
            step: 1,
            action: "Check WiFi signal strength",
            details: "Move device closer to WiFi router if signal is weak.",
          },
          {
            step: 2,
            action: "Disable battery optimization for RustDesk",
            details: "Go to device Settings > Apps > RustDesk > Battery > Don't optimize",
          },
          {
            step: 3,
            action: "Keep device plugged in",
            details: "Connect to charger to prevent battery saver from closing apps.",
          },
          {
            step: 4,
            action: "Disable auto-sleep or extend timeout",
            details: "Settings > Display > Screen timeout > set to longer duration or Never when charging",
          },
          {
            step: 5,
            action: "Check for WiFi interference",
            details: "Other devices, microwaves, or thick walls can interfere. Try different location.",
          },
        ],
      },
      wrong_password: {
        diagnosis: "Password errors happen when the password was changed or entered incorrectly.",
        steps: [
          {
            step: 1,
            action: "Copy-paste the password instead of typing",
            details: "Avoid typos by copying from dashboard and pasting.",
          },
          {
            step: 2,
            action: "Check password directly on the device",
            details: "Open RustDesk on the device and look at the password shown there.",
          },
          {
            step: 3,
            action: "Generate a new password if needed",
            details: "In RustDesk on device, tap the refresh icon next to password to generate new one.",
          },
          {
            step: 4,
            action: "Update password in SPEAR dashboard",
            details: "If you changed the password, update it in your SPEAR device settings.",
          },
        ],
      },
      other: {
        diagnosis: "Let's go through general troubleshooting steps.",
        steps: [
          {
            step: 1,
            action: "Verify device is online in SPEAR dashboard",
            details: "Check if device shows as online or offline.",
          },
          {
            step: 2,
            action: "Restart RustDesk on the device",
            details: "Close and reopen the RustDesk app.",
          },
          {
            step: 3,
            action: "Restart the device completely",
            details: "Power off, wait 10 seconds, power on.",
          },
          {
            step: 4,
            action: "Check internet on both ends",
            details: "Make sure both your computer and the device have internet.",
          },
          {
            step: 5,
            action: "Try again in a few minutes",
            details: "Temporary network issues often resolve themselves.",
          },
        ],
      },
    };

    const guide = troubleshootingGuides[symptom] || troubleshootingGuides.other;

    // Determine if we should escalate
    const escalate = additionalInfo?.toLowerCase().includes("tried everything") ||
      additionalInfo?.toLowerCase().includes("still not working") ||
      additionalInfo?.toLowerCase().includes("multiple devices");

    return {
      success: true,
      diagnosis: guide.diagnosis,
      steps: guide.steps,
      deviceStatus,
      escalate,
      escalateReason: escalate
        ? "If these steps don't resolve the issue, I can create a support ticket for our team to investigate further."
        : undefined,
    };
  },
});
