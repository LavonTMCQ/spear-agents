# Terms of Service Revision Draft

**Document:** Draft revisions for SPEAR Terms of Service
**Status:** DRAFT - Requires legal counsel review before implementation
**Created:** January 20, 2026

---

## Instructions

This document contains specific language to be added to or revised in `src/app/terms/page.tsx`. Each section includes the rationale and the actual text to implement.

---

## Section 1: Add Definitions Section (NEW)

**Rationale:** Clear definitions reduce ambiguity and improve enforceability.

**Add after "Acceptance of Terms":**

```jsx
<Card>
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-4">2. Definitions</h2>
    <div className="space-y-4 text-muted-foreground">
      <p>
        The following definitions apply throughout these Terms:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>"Service"</strong> means the SPEAR remote device management platform, including our website, applications, and all related features and functionality.</li>
        <li><strong>"Device"</strong> means the Samsung Galaxy A14 smartphone or other hardware device purchased from or used with the Service.</li>
        <li><strong>"Subscription"</strong> means your paid access to the Service, billed on a monthly recurring basis.</li>
        <li><strong>"You" or "User"</strong> means the individual or entity accessing or using the Service.</li>
        <li><strong>"Third-Party Services"</strong> means services not operated by SPEAR, including but not limited to check-in applications (such as HHAeXchange), payment processors, and device manufacturers.</li>
        <li><strong>"Content"</strong> means any data, information, or materials transmitted through or stored on Devices using the Service.</li>
      </ul>
    </div>
  </CardContent>
</Card>
```

---

## Section 2: Revise Service Description

**Rationale:** Must accurately describe both enterprise and home care use cases.

**Replace existing "Description of Service" content:**

```jsx
<Card>
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-4">3. Description of Service</h2>
    <div className="space-y-4 text-muted-foreground">
      <p>
        SPEAR provides a secure remote device management platform that enables users to:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Remotely access and control Devices</li>
        <li>Manage Device configurations and settings</li>
        <li>Monitor Device performance and connectivity</li>
        <li>Access analytics and reporting features</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground mt-6">Home Care Worker Solutions</h3>
      <p>
        For home care professionals, SPEAR enables remote access to Devices placed at client locations,
        which can be used with third-party check-in applications. You understand that:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>SPEAR facilitates remote access to your Device only</li>
        <li>SPEAR does not operate or control Third-Party Services such as HHAeXchange</li>
        <li>Compatibility with Third-Party Services is not guaranteed</li>
        <li>You are responsible for compliance with your employer or agency requirements</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground mt-6">Important Limitations</h3>
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
        <p className="font-semibold text-foreground mb-2">SPEAR IS NOT:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Medical care, advice, diagnosis, or treatment</li>
          <li>An emergency response service</li>
          <li>Proof of physical presence, attendance, or services performed</li>
          <li>A substitute for your employer's required documentation</li>
          <li>A HIPAA-covered entity or business associate</li>
        </ul>
        <p className="mt-4">
          The Service may be unavailable, inaccurate, or delayed due to connectivity,
          device settings, software updates, or other factors beyond our control.
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Section 3: Add Device Purchase Terms (NEW SECTION)

**Rationale:** Device sales require specific terms regarding ownership, shipping, and warranty.

**Add new section:**

```jsx
<Card>
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-4">5. Device Purchase Terms</h2>
    <div className="space-y-4 text-muted-foreground">
      <p>
        If you purchase a Device through SPEAR, the following terms apply:
      </p>

      <h3 className="text-lg font-semibold text-foreground">Ownership</h3>
      <p>
        When you purchase a Device from SPEAR, you are buying the physical hardware.
        The Device is yours to keep, regardless of your Subscription status.
        The one-time Device fee ($100) is non-refundable.
      </p>

      <h3 className="text-lg font-semibold text-foreground">Shipping</h3>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Devices are processed and shipped within 3 business days of order</li>
        <li>Standard shipping is included in the Device price</li>
        <li>Risk of loss or damage passes to you upon delivery to the carrier</li>
        <li>You are responsible for providing accurate shipping information</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Pre-Configuration</h3>
      <p>
        Devices purchased from SPEAR come pre-configured with our remote access software.
        You may not remove, disable, or interfere with this configuration while
        maintaining an active Subscription.
      </p>

      <h3 className="text-lg font-semibold text-foreground">No Warranty</h3>
      <p>
        SPEAR PROVIDES NO WARRANTY FOR DEVICES. Any warranty coverage is provided
        solely by the Device manufacturer (Samsung). Contact Samsung directly for
        hardware defects, repairs, or warranty claims. SPEAR is not responsible for
        Device malfunction, damage, loss, or theft.
      </p>

      <h3 className="text-lg font-semibold text-foreground">BYOD (Bring Your Own Device)</h3>
      <p>
        If you use your own Device with the Service, you are responsible for ensuring
        the Device meets our minimum requirements and is properly configured.
        We are not responsible for any issues arising from Device incompatibility.
      </p>
    </div>
  </CardContent>
</Card>
```

---

## Section 4: Revise Subscription and Payment Terms

**Rationale:** Must include both pricing tiers and ROSCA-compliant auto-renewal disclosures.

**Replace existing section:**

```jsx
<Card>
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-4">6. Subscription and Payment Terms</h2>
    <div className="space-y-4 text-muted-foreground">

      <h3 className="text-lg font-semibold text-foreground">Current Pricing</h3>
      <p>SPEAR offers the following subscription plans:</p>

      <div className="bg-muted p-4 rounded-lg mt-2">
        <p className="font-semibold">Enterprise Plans:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Single User: $199-$299 per month</li>
          <li>Two User Bundle: Starting at $298 per month</li>
        </ul>
        <p className="font-semibold mt-3">Home Care Plans (Founder's Pricing):</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Service Only (BYOD): $100 per month</li>
          <li>With Device: $200 first month ($100 device + $100 service), then $100 per month</li>
        </ul>
        <p className="text-sm mt-2">Promotional codes may reduce these prices. Prices subject to change with notice.</p>
      </div>

      <h3 className="text-lg font-semibold text-foreground mt-6">Automatic Renewal</h3>
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="font-semibold text-foreground">IMPORTANT: YOUR SUBSCRIPTION WILL AUTOMATICALLY RENEW</p>
        <p className="mt-2">
          Your Subscription will automatically renew each month at the then-current rate
          unless you cancel before the renewal date. You authorize us to charge your
          payment method on file for each renewal period.
        </p>
        <p className="mt-2">
          We will send you a reminder email at least 7 days before each renewal.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-foreground mt-6">How to Cancel</h3>
      <p>
        You may cancel your Subscription at any time using any of these methods:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>Online:</strong> Log in at spear-global.com, go to Settings, and click "Cancel Subscription"</li>
        <li><strong>Email:</strong> Send a cancellation request to support@spear-global.com</li>
      </ul>
      <p className="mt-2">
        Cancellation takes effect at the end of your current billing period.
        You will retain access to the Service until then.
      </p>

      <h3 className="text-lg font-semibold text-foreground mt-6">Refund Policy</h3>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li><strong>Service:</strong> 30-day money-back guarantee on your first month of service. After 30 days, service fees are non-refundable.</li>
        <li><strong>Device:</strong> Device purchases are non-refundable. The Device is yours to keep.</li>
        <li><strong>Partial Months:</strong> We do not provide refunds for partial months.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground mt-6">Payment Methods</h3>
      <p>
        We accept payment via PayPal and major credit cards. By providing a payment method,
        you represent that you are authorized to use it and authorize us to charge it
        for your Subscription and any applicable fees.
      </p>
    </div>
  </CardContent>
</Card>
```

---

## Section 5: Add User Responsibilities Section (Expanded)

**Rationale:** Critical for home care use case and reducing liability.

**Add/expand section:**

```jsx
<Card>
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-4">7. User Responsibilities</h2>
    <div className="space-y-4 text-muted-foreground">

      <h3 className="text-lg font-semibold text-foreground">General Responsibilities</h3>
      <p>You are responsible for:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Maintaining the security of your account credentials</li>
        <li>All activity that occurs under your account</li>
        <li>Ensuring you have proper authorization to access and manage any Devices</li>
        <li>Complying with all applicable laws and regulations</li>
        <li>Providing accurate and current account information</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground mt-6">In-Home Device Placement</h3>
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="font-semibold text-foreground">If you place a Device in another person's home or premises:</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>You are solely responsible for obtaining any required permission or consent</li>
          <li>You are solely responsible for complying with any rules set by the property owner, resident, or your employer</li>
          <li>You are solely responsible for the physical security and care of the Device</li>
          <li>SPEAR provides tools to display notices but does not verify consent was obtained</li>
          <li>SPEAR is not responsible for any disputes arising from your Device placement</li>
        </ul>
      </div>

      <h3 className="text-lg font-semibold text-foreground mt-6">Third-Party Check-In Applications</h3>
      <p>If you use the Service with third-party applications (such as HHAeXchange):</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>You must comply with all terms of those third-party services</li>
        <li>You must comply with your employer or agency's policies</li>
        <li>You are responsible for understanding and following the requirements of your position</li>
        <li>SPEAR does not guarantee compatibility with any third-party application</li>
        <li>SPEAR is not responsible for actions taken by your employer based on check-in records</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground mt-6">Prohibited Uses</h3>
      <p>You may not use the Service to:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Commit fraud or misrepresent your presence, attendance, or services provided</li>
        <li>Violate any law, regulation, or third-party rights</li>
        <li>Access devices or accounts without authorization</li>
        <li>Engage in unauthorized surveillance or monitoring</li>
        <li>Interfere with or disrupt the Service</li>
        <li>Transmit malicious code or attempt to exploit vulnerabilities</li>
        <li>Share your account credentials with others</li>
      </ul>
    </div>
  </CardContent>
</Card>
```

---

## Section 6: Add Third-Party Technology Section (NEW)

**Rationale:** RustDesk is AGPL-licensed; must disclose open source use.

```jsx
<Card>
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-4">11. Third-Party Technology</h2>
    <div className="space-y-4 text-muted-foreground">
      <p>
        The Service incorporates third-party software components, including open source software.
        These components are subject to their own license terms.
      </p>

      <h3 className="text-lg font-semibold text-foreground">Open Source Components</h3>
      <p>
        The Service uses RustDesk remote desktop software, which is licensed under the
        GNU Affero General Public License (AGPL-3.0). Information about this and other
        open source components can be found in our Third-Party Notices.
      </p>

      <h3 className="text-lg font-semibold text-foreground">Third-Party Services</h3>
      <p>
        The Service integrates with or relies upon various third-party services, including:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Payment processing (PayPal)</li>
        <li>Authentication services</li>
        <li>Cloud hosting and infrastructure</li>
      </ul>
      <p className="mt-2">
        We are not responsible for the availability, accuracy, or actions of third-party services.
        Your use of third-party services is subject to their respective terms and policies.
      </p>

      <h3 className="text-lg font-semibold text-foreground">Third-Party Applications</h3>
      <p>
        If you use the Service with third-party applications (such as HHAeXchange or other
        check-in systems), you acknowledge that:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>We are not affiliated with these applications</li>
        <li>We do not guarantee compatibility or continued functionality</li>
        <li>Changes to third-party applications may affect your use of the Service</li>
        <li>You are bound by the terms of those third-party applications</li>
      </ul>
    </div>
  </CardContent>
</Card>
```

---

## Section 7: Add Arbitration Clause (NEW/EXPANDED)

**Rationale:** Reduces litigation risk; standard for SaaS businesses.

```jsx
<Card>
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-4">14. Dispute Resolution and Arbitration</h2>
    <div className="space-y-4 text-muted-foreground">
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="font-semibold text-foreground">
          PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS,
          INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-foreground mt-4">Agreement to Arbitrate</h3>
      <p>
        You and SPEAR agree that any dispute, claim, or controversy arising out of or
        relating to these Terms or the Service shall be resolved through binding
        individual arbitration, rather than in court, except that:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>You may bring claims in small claims court if your claims qualify</li>
        <li>Either party may seek injunctive relief in court for intellectual property matters</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground mt-4">Class Action Waiver</h3>
      <p>
        <strong>YOU AND SPEAR AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY
        IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER
        IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.</strong>
      </p>
      <p className="mt-2">
        The arbitrator may not consolidate more than one person's claims and may not
        preside over any form of representative or class proceeding.
      </p>

      <h3 className="text-lg font-semibold text-foreground mt-4">Arbitration Procedures</h3>
      <p>
        Arbitration will be conducted by the American Arbitration Association (AAA)
        under its Consumer Arbitration Rules. The arbitration will be held in
        [Your jurisdiction] or another mutually agreed location.
      </p>

      <h3 className="text-lg font-semibold text-foreground mt-4">Opt-Out</h3>
      <p>
        You may opt out of this arbitration agreement by sending written notice to
        legal@spear-global.com within 30 days of creating your account. Your notice
        must include your name, email address, and a clear statement that you wish
        to opt out of arbitration.
      </p>

      <h3 className="text-lg font-semibold text-foreground mt-4">Governing Law</h3>
      <p>
        These Terms shall be governed by and construed in accordance with the laws
        of the State of [Your State], without regard to conflict of law principles.
      </p>
    </div>
  </CardContent>
</Card>
```

---

## Section 8: Revise Disclaimers

**Rationale:** Must specifically disclaim proof of service/attendance.

```jsx
<Card>
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-4">12. Disclaimers</h2>
    <div className="space-y-4 text-muted-foreground">
      <p className="uppercase font-semibold">
        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF
        ANY KIND, EITHER EXPRESS OR IMPLIED.
      </p>

      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING
        BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING FROM
        COURSE OF DEALING OR USAGE OF TRADE.
      </p>

      <h3 className="text-lg font-semibold text-foreground mt-4">Specific Disclaimers</h3>
      <p>Without limiting the foregoing, we do not warrant that:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>The Service will be uninterrupted, error-free, or secure</li>
        <li>The Service will meet your requirements or expectations</li>
        <li>Any data or information will be accurate, current, or complete</li>
        <li>The Service will be compatible with third-party applications</li>
        <li>Connection or access will be continuously available</li>
      </ul>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
        <p className="font-semibold text-foreground">NOT PROOF OF SERVICE DISCLAIMER:</p>
        <p className="mt-2">
          THE SERVICE DOES NOT CONSTITUTE PROOF OF YOUR PHYSICAL PRESENCE, ATTENDANCE,
          TIME WORKED, OR SERVICES PERFORMED. CHECK-IN DATA, LOCATION DATA, AND OTHER
          INFORMATION FROM THE SERVICE MAY BE INACCURATE, INCOMPLETE, OR UNAVAILABLE.
          YOU SHOULD NOT RELY ON THE SERVICE AS YOUR SOLE DOCUMENTATION FOR EMPLOYMENT,
          BILLING, OR COMPLIANCE PURPOSES.
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Section 9: Update Limitation of Liability

**Rationale:** Ensure cap is clear and comprehensive.

```jsx
<Card>
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-4">13. Limitation of Liability</h2>
    <div className="space-y-4 text-muted-foreground">
      <p className="uppercase font-semibold">
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
      </p>

      <p>
        IN NO EVENT SHALL SPEAR, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES,
        OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
        EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Loss of profits, revenue, or business</li>
        <li>Loss of data or information</li>
        <li>Loss of employment or job opportunities</li>
        <li>Disciplinary action by your employer</li>
        <li>Claims by third parties</li>
        <li>Business interruption</li>
      </ul>

      <p className="mt-4">
        OUR TOTAL LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE
        SHALL NOT EXCEED THE GREATER OF:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>The amounts you paid to us in the twelve (12) months preceding the claim, OR</li>
        <li>One hundred dollars ($100)</li>
      </ul>

      <p className="mt-4">
        These limitations apply regardless of the theory of liability (contract, tort,
        strict liability, or otherwise) and even if we have been advised of the
        possibility of such damages.
      </p>

      <p className="mt-4">
        Some jurisdictions do not allow the exclusion or limitation of certain damages.
        In such jurisdictions, our liability shall be limited to the maximum extent
        permitted by law.
      </p>
    </div>
  </CardContent>
</Card>
```

---

## Section 10: Update Indemnification

**Rationale:** Must cover home care specific risks.

```jsx
<Card>
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold mb-4">15. Indemnification</h2>
    <div className="space-y-4 text-muted-foreground">
      <p>
        You agree to defend, indemnify, and hold harmless SPEAR, its affiliates,
        officers, directors, employees, agents, and licensors from and against any
        and all claims, damages, losses, liabilities, and expenses (including
        reasonable attorneys' fees) arising out of or related to:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Your use of the Service</li>
        <li>Your violation of these Terms</li>
        <li>Your violation of any law or regulation</li>
        <li>Your violation of any rights of any third party</li>
        <li>Your failure to obtain required permissions or consents for in-home Device placement</li>
        <li>Any dispute with your employer, agency, or client regarding attendance, check-ins, or services</li>
        <li>Any misrepresentation of your presence, attendance, or services performed</li>
        <li>Any Content you transmit through the Service</li>
      </ul>

      <p className="mt-4">
        We reserve the right, at our own expense, to assume the exclusive defense
        and control of any matter subject to indemnification by you. You agree to
        cooperate with our defense of such claims.
      </p>
    </div>
  </CardContent>
</Card>
```

---

## Implementation Notes

1. **Renumber Sections:** After adding new sections, renumber all subsequent sections
2. **Update Last Updated Date:** Change to actual implementation date
3. **Add Effective Date:** Add specific effective date for new terms
4. **Email Notice:** Email existing users about material changes
5. **Require Re-acceptance:** Consider requiring users to re-accept updated terms

---

## Legal Review Checklist

Before implementing these changes:

- [ ] Have attorney licensed in your jurisdiction review all changes
- [ ] Verify arbitration clause is enforceable in your state
- [ ] Confirm ROSCA compliance for your specific state(s)
- [ ] Verify small claims court exception language
- [ ] Confirm 30-day opt-out period is adequate
- [ ] Review class action waiver enforceability in your jurisdiction
- [ ] Verify limitation of liability cap is appropriate

---

**DISCLAIMER:** This document is provided for informational purposes only and does not constitute legal advice. Consult with a licensed attorney before implementing any legal documents.
