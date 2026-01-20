import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import {
  lookupCustomer,
  getDeviceStatus,
  getSubscriptionStatus,
  createSupportTicket,
} from "../tools";

const inputSchema = z.object({
  email: z.string().email().optional(),
  customerId: z.string().optional(),
  deviceId: z.string().optional(),
  issueDescription: z.string().optional(),
});

const resolveCustomer = createStep({
  id: "resolve-customer",
  inputSchema,
  outputSchema: z.object({
    email: z.string().email().optional(),
    customerId: z.string().optional(),
    deviceId: z.string().optional(),
    issueDescription: z.string().optional(),
    customer: z
      .object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
      })
      .nullable(),
    lookupError: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    if (inputData.customerId) {
      return {
        email: inputData.email,
        customerId: inputData.customerId,
        deviceId: inputData.deviceId,
        issueDescription: inputData.issueDescription,
        customer: null,
      };
    }

    if (inputData.email) {
      const result = await lookupCustomer.execute({ email: inputData.email });
      if (result.success && result.customer) {
        return {
          email: inputData.email,
          customerId: result.customer.id,
          deviceId: inputData.deviceId,
          issueDescription: inputData.issueDescription,
          customer: {
            id: result.customer.id,
            name: result.customer.name ?? null,
            email: result.customer.email,
          },
        };
      }

      return {
        email: inputData.email,
        customerId: undefined,
        deviceId: inputData.deviceId,
        issueDescription: inputData.issueDescription,
        customer: null,
        lookupError: result.error || "Customer not found",
      };
    }

    return {
      email: inputData.email,
      customerId: undefined,
      deviceId: inputData.deviceId,
      issueDescription: inputData.issueDescription,
      customer: null,
      lookupError: "Missing email or customerId",
    };
  },
});

const fetchSignals = createStep({
  id: "fetch-signals",
  inputSchema: z.object({
    customerId: z.string().optional(),
    deviceId: z.string().optional(),
    issueDescription: z.string().optional(),
    customer: z.any().nullable().optional(),
    lookupError: z.string().optional(),
  }),
  outputSchema: z.object({
    customerId: z.string().optional(),
    deviceId: z.string().optional(),
    issueDescription: z.string().optional(),
    customer: z.any().nullable().optional(),
    lookupError: z.string().optional(),
    deviceStatus: z.any(),
    subscriptionStatus: z.any(),
  }),
  execute: async ({ inputData }) => {
    const deviceStatus = await getDeviceStatus.execute({
      customerId: inputData.customerId,
      deviceId: inputData.deviceId,
    });

    const subscriptionStatus = inputData.customerId
      ? await getSubscriptionStatus.execute({ customerId: inputData.customerId })
      : { success: false, subscription: null, error: "Missing customerId" };

    return {
      ...inputData,
      deviceStatus,
      subscriptionStatus,
    };
  },
});

const diagnose = createStep({
  id: "diagnose",
  inputSchema: z.object({
    customerId: z.string().optional(),
    deviceId: z.string().optional(),
    issueDescription: z.string().optional(),
    deviceStatus: z.any(),
    subscriptionStatus: z.any(),
    lookupError: z.string().optional(),
  }),
  outputSchema: z.object({
    customerId: z.string().optional(),
    summary: z.string(),
    actions: z.array(z.string()),
    requiresHuman: z.boolean(),
    reason: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (inputData.lookupError) {
      return {
        customerId: inputData.customerId,
        summary: "Customer lookup failed",
        actions: ["Confirm the correct account email", "Collect the device ID if available"],
        requiresHuman: true,
        reason: inputData.lookupError,
      };
    }

    const subscription = inputData.subscriptionStatus?.subscription;
    if (subscription && subscription.status && subscription.status !== "active") {
      return {
        customerId: inputData.customerId,
        summary: `Subscription is ${subscription.status}`,
        actions: [
          "Explain subscription status and renewal steps",
          "Collect payment confirmation if recently updated",
        ],
        requiresHuman: false,
        reason: "Subscription inactive",
      };
    }

    const devices = inputData.deviceStatus?.devices || [];
    if (devices.length === 0) {
      return {
        customerId: inputData.customerId,
        summary: "No device records found for this account",
        actions: ["Verify device ID", "Confirm device assignment in admin tools"],
        requiresHuman: true,
        reason: "No devices found",
      };
    }

    const offline = devices.filter((d: any) => !d.isOnline);
    if (offline.length === devices.length) {
      return {
        customerId: inputData.customerId,
        summary: "Device appears offline",
        actions: [
          "Guide user to restart device and check connectivity",
          "Confirm RustDesk ID is correct",
          "Escalate for remote reset if still offline",
        ],
        requiresHuman: true,
        reason: "All devices offline",
      };
    }

    return {
      customerId: inputData.customerId,
      summary: "Unable to determine root cause from signals",
      actions: [
        "Collect more details (location, last successful check-in)",
        "Escalate with logs and device status",
      ],
      requiresHuman: true,
      reason: "Unknown failure mode",
    };
  },
});

const approval = createStep({
  id: "request-approval",
  inputSchema: z.object({
    customerId: z.string().optional(),
    summary: z.string(),
    actions: z.array(z.string()),
    requiresHuman: z.boolean(),
    reason: z.string(),
  }),
  outputSchema: z.object({
    customerId: z.string().optional(),
    summary: z.string(),
    actions: z.array(z.string()),
    approved: z.boolean(),
    reason: z.string(),
  }),
  suspendSchema: z.object({
    reason: z.string(),
    actions: z.array(z.string()),
  }),
  resumeSchema: z.object({
    approved: z.boolean(),
    notes: z.string().optional(),
  }),
  execute: async ({ inputData, suspend, resumeData }) => {
    if (!inputData.requiresHuman) {
      return {
        customerId: inputData.customerId,
        summary: inputData.summary,
        actions: inputData.actions,
        approved: true,
        reason: inputData.reason,
      };
    }

    if (!resumeData) {
      await suspend(
        { reason: inputData.reason, actions: inputData.actions },
        { resumeLabel: "admin-approval" }
      );
      return;
    }

    return {
      customerId: inputData.customerId,
      summary: inputData.summary,
      actions: inputData.actions,
      approved: resumeData.approved,
      reason: inputData.reason,
    };
  },
});

const finalize = createStep({
  id: "finalize",
  inputSchema: z.object({
    customerId: z.string().optional(),
    summary: z.string(),
    actions: z.array(z.string()),
    approved: z.boolean(),
    reason: z.string(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    actions: z.array(z.string()),
    requiresHuman: z.boolean(),
    ticketId: z.string().nullable(),
  }),
  execute: async ({ inputData }) => {
    let ticketId: string | null = null;

    if (!inputData.approved && inputData.customerId) {
      const ticket = await createSupportTicket.execute({
        customerId: inputData.customerId,
        subject: "SPEAR check-in issue escalation",
        description: `${inputData.summary}\nReason: ${inputData.reason}`,
        priority: "high",
      });
      if (ticket.success) {
        ticketId = ticket.ticketId;
      }
    }

    return {
      summary: inputData.summary,
      actions: inputData.actions,
      requiresHuman: !inputData.approved,
      ticketId,
    };
  },
});

export const cantCheckInWorkflow = createWorkflow({
  id: "cant-check-in",
  description: "Support playbook for users who cannot complete a check-in.",
  inputSchema,
  outputSchema: z.object({
    summary: z.string(),
    actions: z.array(z.string()),
    requiresHuman: z.boolean(),
    ticketId: z.string().nullable(),
  }),
})
  .then(resolveCustomer)
  .then(fetchSignals)
  .then(diagnose)
  .then(approval)
  .then(finalize)
  .commit();
