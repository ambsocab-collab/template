# UI/UX SPECIFICATION

## next-sqlite-starter

**Version**: 1.0
**Date**: 2025-10-28
**Status**: Ready for Design & Development
**Owner**: UX Expert (Sally)

---

## **TABLE OF CONTENTS**

1. [Introduction](#introduction)
2. [UX Goals & Principles](#ux-goals--principles)
3. [Information Architecture](#information-architecture)
4. [User Flows](#user-flows)
5. [Error States & Edge Cases](#error-states--edge-cases)
6. [Component & Design System](#component--design-system)
7. [Accessibility Requirements](#accessibility-requirements)
8. [Responsiveness Strategy](#responsiveness-strategy)
9. [Next Steps & Handoff](#next-steps--handoff)

---

## **INTRODUCTION**

This document defines the user experience goals, information architecture, user flows, and visual design specifications for **next-sqlite-starter**, a minimalist SaaS starter template. It serves as the foundation for visual design and frontend development, ensuring a cohesive, intuitive, and user-centered experience for indie developers, early-stage startups, and rapid prototypers.

**Document Purpose:**
- Guide frontend development with clear UI/UX requirements
- Establish consistent patterns and design decisions
- Serve as reference for design review and QA
- Enable handoff to developers with confidence

---

## **UX GOALS & PRINCIPLES**

### **Target User Personas**

#### **Persona 1: The Indie Hacker**
- Technical founder/developer building their own SaaS
- Values speed, simplicity, and minimal setup friction
- Wants to focus on core product logic, not boilerplate scaffolding
- Success metric: "I was shipping features in 30 minutes, not days"

#### **Persona 2: The Early-Stage Startup**
- Small team (2-5 people) launching an MVP quickly
- Mixed technical skill levels (designer, founder, developer)
- Needs a template that's maintainable and extensible
- Success metric: "We had a working product in a week"

#### **Persona 3: The Prototyper/Agency Developer**
- Freelancer or agency needing rapid prototyping baseline
- Reuses templates across multiple client projects
- Requires clean, documented code for client handoff
- Success metric: "Our setup time went from 3 days to 2 hours"

---

### **Usability Goals**

1. **Ease of Setup** - New developers can get the app running locally within 5 minutes without confusion
2. **Clarity of Purpose** - Every page and button clearly indicates what it does and why it exists
3. **Minimal Cognitive Load** - Users encounter only essential features; no clutter or irrelevant options
4. **Fast Onboarding** - New users complete registration, profile creation, and first action within 10 minutes
5. **Self-Documenting** - UI is intuitive enough that users rarely need external help for basic tasks
6. **Error Prevention** - Form validation and confirmation steps prevent common mistakes (especially destructive actions)
7. **Progressive Disclosure** - Advanced settings are accessible but don't overwhelm novice users

---

### **Core Design Principles**

1. **Simplicity Over Cleverness** - Prioritize clear, predictable interactions over creative or novel designs. Users should instantly understand what to do.

2. **Minimalism by Default** - Show only essential information and actions. Every UI element must earn its place; if it can be removed without hurting usability, remove it.

3. **Consistency & Familiar Patterns** - Use well-known UI patterns (buttons, forms, navigation) so users leverage mental models from other apps. Avoid custom or unusual interactions.

4. **Immediate Visual Feedback** - Every action (click, form submission, toggle) must have clear, instant feedback. No ambiguity about whether the action succeeded.

5. **Accessibility First** - Design inclusively from the start: clear color contrasts, keyboard navigation, screen reader support, and proper semantic HTML.

6. **Mobile-First Mindset** - Design for smallest screens first, then adapt upward. Ensures usability across all devices and forces prioritization of essential features.

7. **Trust Through Transparency** - Be honest about requirements, limitations, and next steps. Avoid dark patterns or misleading CTAs.

---

## **INFORMATION ARCHITECTURE**

### **Site Map / Screen Inventory**

```
Landing (Public)
├── Sign Up (Auth)
└── Sign In (Auth)

Dashboard (Authenticated)
├── Dashboard Home
├── Profile (Edit)
├── Settings
│   ├── Preferences (Dark Mode, Notifications)
│   └── Billing
│       └── Subscription Management
│           ├── Pricing Page
│           └── Stripe Checkout (External)
├── Checkout Success
└── Account Deletion Confirmation (Modal)
```

---

### **Screen Inventory Details**

| Screen | Route | Auth Required | Purpose |
|--------|-------|---------------|---------|
| Landing | `/` | No | Public entry point, value prop, CTA |
| Sign Up | `/(auth)/sign-up` | No | Clerk sign-up form (email + password) |
| Sign In | `/(auth)/sign-in` | No | Clerk sign-in form |
| Dashboard Home | `/(dashboard)` | Yes | Main authenticated space, welcome, action cards |
| Profile | `/(dashboard)/profile` | Yes | Edit user name, avatar, email (read-only) |
| Settings | `/(dashboard)/settings` | Yes | Preferences (dark mode, notifications), billing overview |
| Subscription Management | `/(dashboard)/settings/subscription` | Yes | View current plan, upgrade button, pricing table |
| Pricing Page | `/(dashboard)/settings/pricing` | Yes | Detailed Free vs Pro comparison |
| Stripe Checkout | External (Stripe) | Yes | Payment processing (Stripe-hosted iframe) |
| Checkout Success | `/(dashboard)/checkout/success` | Yes | Confirmation, celebration, auto-redirect |
| Account Deletion Confirmation | Modal within Settings | Yes | Confirm destructive action before deletion |

---

### **Navigation Structure**

#### **Primary Navigation (Desktop Sidebar)**

**Location**: Left side, fixed or sticky (256px width)
- Home → `/(dashboard)`
- Profile → `/(dashboard)/profile`
- Settings → `/(dashboard)/settings`
- Upgrade → `/(dashboard)/settings/subscription` (or **Manage** if Pro)

**Secondary Navigation (Sidebar Bottom)**:
- User card (avatar + name + dropdown)
  - Profile
  - Settings
  - Logout

#### **Navbar (Top Bar - All Pages)**

**Location**: Fixed at top
- **Left**: App logo (links to dashboard)
- **Center**: Current page title or breadcrumb
- **Right**: Dark mode toggle + User avatar dropdown

#### **Mobile Navigation**

**Hamburger menu** (top-left):
- Slides in sidebar from left
- Same links as desktop sidebar
- Closes on link click or outside click
- Overlays content (no layout shift)

#### **Breadcrumb Strategy**

- **Landing → Dashboard**: Hidden (clear context)
- **Dashboard → Profile/Settings**: Show `Dashboard > Profile`
- **Settings → Subscription**: Show `Dashboard > Settings > Subscription`
- **Checkout pages**: Show full path `Settings > Subscription > Pricing > Checkout`

---

## **USER FLOWS**

### **FLOW 1: New User → Sign Up → Dashboard**

**User Goal**: Create an account and access the dashboard
**Entry Points**: Landing page "Get Started" button
**Success Criteria**: User lands on dashboard home with personalized welcome message

**Happy Path**:
1. User lands on Landing page
2. Clicks "Get Started" CTA button
3. Redirected to Sign Up page (Clerk form)
4. Enters email + password
5. Clicks Sign Up
6. Account created, redirect to Profile Completion page
7. Enters First Name & Last Name (required)
8. Saves profile
9. Redirected to Dashboard Home
10. Sees welcome banner: "Welcome back, {firstName}!"
11. Sees action cards: Complete Profile ✓, Upgrade to Pro, Manage Subscription

**Edge Cases**:
- Email already exists → Show inline error "Account exists. [Sign in instead?]"
- Password too weak → Show requirements + strength meter; submit disabled
- Network timeout → Show retry banner "Connection lost. [Retry]"
- Clerk unavailable → Show fallback message with retry option
- User closes browser mid-signup → Session persists; resume on next visit

---

### **FLOW 2: Authenticated User → Edit Profile**

**User Goal**: Update personal information (name, avatar)
**Entry Points**: Dashboard navbar avatar → Profile; or Sidebar Profile link
**Success Criteria**: Changes saved, success toast shown, user remains on page

**Happy Path**:
1. User clicks avatar in navbar
2. Dropdown menu appears
3. Clicks "Profile"
4. Profile page loads with form
5. Edits First Name and/or Last Name
6. Save button enables (form changed)
7. Clicks Save
8. Form validates client-side
9. Submits to API
10. Success toast: "Profile updated"
11. Form retains values
12. User can edit again or navigate away

**Edge Cases**:
- First/Last Name empty → Show inline error "Required field"
- API fails (500 error) → Show error toast "Couldn't save. [Retry]"; keep form data
- User navigates away → No warning (acceptable for this template); changes lost silently
- Avatar change (Clerk) → Link to Clerk profile manager; refresh on return

---

### **FLOW 3: Free User → Upgrade → Stripe → Success**

**User Goal**: Subscribe to Pro plan and enable paid features
**Entry Points**: Sidebar "Upgrade" button; Dashboard action card; Settings > Subscription
**Success Criteria**: Payment processed, subscription stored in DB, user sees "Pro" badge

**Happy Path**:
1. User clicks "Upgrade to Pro" button
2. Redirected to Subscription page
3. Sees current plan: Free (badge)
4. Reviews pricing table (Free vs Pro features)
5. Clicks "Choose Pro"
6. Backend creates Stripe checkout session
7. Redirected to Stripe Checkout (secure iframe/modal)
8. Enters payment details
9. Clicks "Subscribe"
10. Stripe processes payment (may require 3D Secure)
11. Payment succeeds
12. Stripe webhook notifies backend
13. Backend updates `subscriptions` table (status = active)
14. User redirected to Success page
15. Success page shows: "Welcome to Pro! 🎉"
16. Auto-redirect to Dashboard after 3 seconds
17. Dashboard shows Pro badge; user can access pro features

**Edge Cases**:
- Card declined → Stripe shows error; user can retry with different card
- 3D Secure required → User completes bank verification; charge retries
- Network timeout → Show "Processing..." spinner; check status after 10s
- Webhook delayed → Subscription shows "pending"; cron job syncs every 5 min
- User already Pro → Hide Upgrade button; show "Manage Subscription" instead
- Payment already charged (webhook delayed but user refreshed) → Idempotent handler; no duplicate charge

---

### **FLOW 4: User → Settings → Delete Account**

**User Goal**: Permanently delete account and all data
**Entry Points**: Settings page > "Danger Zone" > "Delete Account" button
**Success Criteria**: Account deleted, user logged out, redirected to landing page

**Happy Path**:
1. User navigates to Settings page
2. Scrolls to "Danger Zone" section (red background, visible warning)
3. Clicks "Delete Account" button (red, prominent)
4. Confirmation modal appears
5. Modal shows warning: "This action cannot be undone. All data will be permanently deleted."
6. Modal requires user to **type email address** to confirm
7. User types email
8. Confirm button enables
9. User clicks Confirm
10. Modal shows spinner: "Deleting account..."
11. Backend deletes user record + subscriptions + sessions
12. User is logged out
13. Redirected to Landing page
14. Success message: "Account deleted successfully"
15. After 3 seconds, modal closes

**Edge Cases**:
- User types wrong email → Confirm button stays disabled until correct email typed
- Database deletion fails → Rollback; show error "Couldn't delete. [Retry]"
- Stripe subscription not cleaned up → Catch error; log for manual review
- User closes modal mid-deletion → Request still completes; user gets logged out on next page load
- User has active Pro subscription → Delete anyway (subscription auto-cancels with user deletion)

---

## **ERROR STATES & EDGE CASES**

### **Error State Categories**

#### **1. Sign Up Errors**

**Email Already Exists**
```
Email Address field shows inline error:
❌ Account already exists [Sign in instead? →]
```
- Error appears on blur (not submit)
- Link to sign-in page provides escape route
- Email field retains value; user can retry with different email

**Password Too Weak**
```
Password field shows inline error:
❌ Password must be 8+ characters, 1 uppercase, 1 number
```
- Real-time validation as user types
- Visual strength meter (weak/fair/good/strong)
- Submit button disabled until valid

**Network Error**
```
Banner at top (yellow background):
⚠️ Connection lost
[Retry] [Dismiss]
```
- Dismissible banner (doesn't block form)
- Form data retained; user can retry immediately

---

#### **2. Login Errors**

**Invalid Credentials**
```
Banner at top:
❌ Email or password incorrect
```
- Generic error message (prevents account enumeration)
- Email field retains value; password cleared
- Show "Forgot password?" link for account recovery

**Account Suspended**
```
❌ Account disabled
Your account has been suspended. Contact support. [Contact Support]
```
- Clear explanation of issue
- Disable login button
- Provide support contact link

---

#### **3. Profile Form Errors**

**Validation Errors**
```
First Name field shows:
❌ First name is required
```
- Multiple errors shown simultaneously (not one at a time)
- Errors inline below fields (not top of form)
- Errors disappear when user starts fixing

**Save Failure**
```
Banner at top:
❌ Couldn't save changes [Retry]
```
- Keep form data intact
- Retry button attempts save again
- Form remains editable

---

#### **4. Stripe / Payment Errors**

**Card Declined**
```
Stripe shows error overlay:
❌ Card Declined
Your card was declined. Try another payment method. [Try Another Card]
```
- Stripe handles error display (don't recreate)
- User can retry with same or different card
- Offer support contact if repeated failures

**3D Secure / 2FA Required**
```
Stripe shows verification screen:
ⓘ Additional Verification Required
Your bank requires verification. Enter code: [__ __ __ __]
```
- Bank sends code via SMS or email
- User enters code
- Charge completes on success

**Network Timeout**
```
Loading screen:
⏳ Processing Payment...
Please wait. Do not close this window.
(After 10s) [Check Status] [Go Back]
```
- Reassuring message (payment is being processed)
- Check Status button queries backend for Stripe webhook status
- If charged: show success; if not: show retry option

---

#### **5. Subscription Errors**

**Billing Failed**
```
Banner on Settings > Billing page:
⚠️ Billing Issue
Your recent payment failed. [Update Payment Method]
```
- Warning appears on relevant page
- Direct link to Stripe billing portal (update card)
- Shows when next retry is scheduled

**Webhook Processing Delayed**
```
Success page shows:
⏳ Setting up your Pro plan...
This usually takes a few seconds. [Return to Dashboard]
```
- Allow user to navigate away (non-blocking)
- Dashboard shows "Pending" until webhook fires
- Email sent when subscription active

---

#### **6. Account Deletion Errors**

**Deletion Failed**
```
Banner at top:
❌ Couldn't delete account [Retry] [Dismiss]
```
- Show retry option
- Suggest contacting support if repeated failures

**Deletion Succeeded**
```
✅ Account deleted
Your account and all data have been permanently deleted.
Redirecting in 3s [Take me there now]
```
- Green checkmark (feels final and safe)
- Auto-redirect to landing page
- Support link provided

---

#### **7. Global Errors**

**404 Page Not Found**
```
Large text: 404
Heading: Page Not Found
Copy: The page you're looking for doesn't exist.
[Go to Dashboard] [Go Home]
```
- Show navbar/sidebar (keep user in app context)
- Provide multiple navigation options
- Professional tone (don't make it scary)

**500 Server Error**
```
Large text: 500
Heading: Something Went Wrong
[Try Again] [Go Home]
Error ID: #a1b2c3d4 (copy for support reference)
[Contact Support]
```
- Show error ID (helps support debugging)
- Refresh/retry button for transient errors
- Support link for escalation

**Network Offline**
```
Banner at top:
⚠️ You're Offline
[Reconnect] [View Cached Pages]
```
- Auto-reconnect every 3 seconds
- Show cached content if available (Service Worker)
- Don't panic; tell user what's happening

---

### **Error State Principles**

**Across All Errors**:

1. **Be Specific** - "Card declined" not "Payment failed"; "Email exists" not "Error"
2. **Be Helpful** - Offer next steps (retry, update, contact support)
3. **Be Honest** - Don't hide errors; users respect transparency
4. **Be Respectful** - Don't blame user; accept errors gracefully
5. **Be Clear** - Plain language, no technical jargon
6. **Be Visual** - Use color (red for error, yellow for warning, blue for info)
7. **Be Quick** - Show errors immediately
8. **Be Recoverable** - Always offer a way forward (retry, go back, contact support)

---

## **COMPONENT & DESIGN SYSTEM**

### **Color Palette**

| Color Type | Hex | RGB | Usage |
|-----------|-----|-----|-------|
| **Primary** | `#4F46E5` | 79, 70, 229 | Buttons, links, interactive elements (indigo-600) |
| **Primary Dark** | `#4338CA` | 67, 56, 202 | Hover state, darker variant |
| **Secondary** | `#6B7280` | 107, 114, 128 | Secondary text, inactive elements (gray-600) |
| **Background Light** | `#FFFFFF` | 255, 255, 255 | Light mode background |
| **Background Dark** | `#0F172A` | 15, 23, 42 | Dark mode background (slate-950) |
| **Card Light** | `#F9FAFB` | 249, 250, 251 | Card backgrounds, light mode (gray-50) |
| **Card Dark** | `#111827` | 17, 24, 39 | Card backgrounds, dark mode (gray-900) |
| **Border Light** | `#E5E7EB` | 229, 231, 235 | Borders, light mode (gray-200) |
| **Border Dark** | `#1F2937` | 31, 41, 55 | Borders, dark mode (gray-800) |
| **Success** | `#10B981` | 16, 185, 129 | Confirmations, success states (green-600) |
| **Warning** | `#F59E0B` | 245, 158, 11 | Cautions, important notices (amber-600) |
| **Error** | `#EF4444` | 239, 68, 68 | Errors, destructive actions (red-600) |
| **Neutral** | `#6B7280` | 107, 114, 128 | Text, secondary elements (gray-600) |

---

### **Typography**

#### **Font Families**
- **Primary**: System default (San Francisco on macOS, Segoe UI on Windows, Helvetica on Android)
- **Monospace**: `JetBrains Mono` or system monospace (code snippets)

#### **Type Scale**

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **H1** | 2.25rem (36px) | 700 (Bold) | 2.5rem (40px) | Page titles |
| **H2** | 1.875rem (30px) | 700 (Bold) | 2.25rem (36px) | Section headings |
| **H3** | 1.5rem (24px) | 600 (Semibold) | 2rem (32px) | Subsection headings |
| **H4** | 1.25rem (20px) | 600 (Semibold) | 1.75rem (28px) | Card titles |
| **Body** | 1rem (16px) | 400 (Regular) | 1.5rem (24px) | Body copy, form labels |
| **Small** | 0.875rem (14px) | 400 (Regular) | 1.25rem (20px) | Secondary text, hints |
| **Tiny** | 0.75rem (12px) | 500 (Medium) | 1rem (16px) | Badges, metadata |

---

### **Spacing Scale** (Tailwind)

| Unit | Size | Usage |
|------|------|-------|
| **xs** | 0.5rem (8px) | Micro spacing (icon padding, tight groups) |
| **sm** | 1rem (16px) | Small gaps (form field spacing, button padding) |
| **md** | 1.5rem (24px) | Medium gaps (card padding, section spacing) |
| **lg** | 2rem (32px) | Large gaps (page sections) |
| **xl** | 3rem (48px) | Extra large gaps (major sections) |
| **2xl** | 4rem (64px) | Maximum gaps (hero sections) |

---

### **Core Components**

#### **Buttons**

**Primary Button** (Call-to-action)
```
Background: #4F46E5 (indigo-600)
Hover: #4338CA (indigo-700)
Text: White
Padding: 12px 24px (py-3 px-6)
Border Radius: 8px
Font Weight: 600
Cursor: pointer

Disabled State:
Background: #D1D5DB (gray-300)
Text: #6B7280 (gray-600)
Cursor: not-allowed
```

**Secondary Button** (Alternative action)
```
Background: #F3F4F6 (gray-100) light / #1F2937 (gray-800) dark
Hover: #E5E7EB (gray-200) light / #111827 (gray-900) dark
Text: #111827 (gray-900) light / #F9FAFB (gray-50) dark
Padding: 12px 24px
Border: 1px solid #E5E7EB (gray-200) light / #1F2937 (gray-800) dark
Border Radius: 8px
```

**Danger Button** (Destructive action)
```
Background: #EF4444 (red-600)
Hover: #DC2626 (red-700)
Text: White
Padding: 12px 24px
Border Radius: 8px
Font Weight: 600
```

**Button States**:
- **Disabled**: Opacity 50%, cursor not-allowed, no hover effect
- **Loading**: Show spinner inside button, disable clicks
- **Focus**: Outline: 2px solid #4F46E5, offset 2px
- **Active**: Darker background (darker shade of base color)

---

#### **Form Inputs**

**Text Input**
```
Border: 1px solid #E5E7EB (gray-200) light
Background: White light / #111827 (gray-900) dark
Padding: 12px 16px
Border Radius: 8px
Font Size: 1rem
Line Height: 1.5rem
Color: #111827 (gray-900) light / #F9FAFB (gray-50) dark

Focus State:
Border: 2px solid #4F46E5 (indigo-600)
Box Shadow: 0 0 0 3px rgba(79, 70, 229, 0.1)
Outline: none

Error State:
Border: 2px solid #EF4444 (red-600)
Box Shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)
Error message shown below input (12px, red-600)

Disabled State:
Background: #F3F4F6 (gray-100)
Color: #9CA3AF (gray-400)
Cursor: not-allowed
```

**Textarea** (same as text input, but multiline)
- Min height: 120px
- Max height: 400px (with scroll)
- Resize: vertical only

**Checkbox**
```
Size: 20px × 20px
Border: 2px solid #D1D5DB (gray-300)
Border Radius: 4px
Background (checked): #4F46E5 (indigo-600)
Checkmark: White, 12px icon
Focus: Outline 2px solid #4F46E5, offset 2px
```

**Radio Button**
```
Size: 20px × 20px
Border: 2px solid #D1D5DB (gray-300)
Border Radius: 50%
Dot (checked): 8px diameter, center, #4F46E5 (indigo-600)
Focus: Outline 2px solid #4F46E5, offset 2px
```

**Select Dropdown**
```
Appearance: Similar to text input
Down arrow icon: Right side, 16px gray-600
Focus: Same as text input
On click: Show options (max height 300px, scroll if needed)
Hover option: Background #F3F4F6 (gray-100)
Selected option: Background #EBF2FF (indigo-50), bold text
```

---

#### **Cards**

**Card Container**
```
Background: White light / #111827 (gray-900) dark
Border: 1px solid #E5E7EB (gray-200) light / #1F2937 (gray-800) dark
Border Radius: 12px
Padding: 24px
Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1) (subtle)
```

**Card Variants**:
- **Elevated**: Add box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1)
- **Bordered**: Remove shadow, keep border

---

#### **Modals / Dialogs**

**Modal Container**
```
Background: White light / #111827 (gray-900) dark
Border Radius: 12px
Padding: 32px
Box Shadow: 0 20px 25px rgba(0, 0, 0, 0.15)
Max Width: 500px
Overlay: rgba(0, 0, 0, 0.5) (50% opacity, backdrop blur)
```

**Modal Anatomy**:
1. Close button (X icon, top-right)
2. Title (H2, 24px bold)
3. Content (body text)
4. Action buttons (primary + secondary/cancel at bottom)

---

#### **Alerts / Toasts**

**Toast Notification**
```
Position: Bottom-right corner (20px from edges)
Background: Depends on type (success/error/warning/info)
Padding: 16px 20px
Border Radius: 8px
Font Size: 14px (body-small)
Max Width: 400px
Duration: Auto-dismiss after 5 seconds
Close button: X icon (optional)
```

**Toast Types**:
- **Success**: Background #10B981 (green-600), Text white, checkmark icon
- **Error**: Background #EF4444 (red-600), Text white, X icon
- **Warning**: Background #F59E0B (amber-600), Text white, alert icon
- **Info**: Background #3B82F6 (blue-600), Text white, info icon

---

#### **Navigation Components**

**Navbar**
```
Height: 64px (mobile) / 64px (desktop)
Background: White light / #1F2937 (gray-800) dark
Border Bottom: 1px solid #E5E7EB (gray-200) light / #1F2937 (gray-800) dark
Padding: 0 20px
Display: Flexbox (space-between)
Position: Fixed, top: 0
Z-index: 40 (above content, below modals)
```

**Sidebar**
```
Width: 256px (desktop) / Hidden on mobile
Background: White light / #111827 (gray-900) dark
Border Right: 1px solid #E5E7EB (gray-200) light / #1F2937 (gray-800) dark
Padding: 20px
Position: Fixed, left: 0
Height: 100vh
Overflow-y: auto
Z-index: 30
```

**Mobile Menu** (Hamburger)
```
Width: 100% (full screen)
Background: White light / #111827 (gray-900) dark
Position: Fixed, left: 0, top: 64px (below navbar)
Height: calc(100vh - 64px)
Transform: translateX(-100%) when closed
Animation: translateX(0) when open (300ms ease-in-out)
Overlay: Show scrim (rgba(0, 0, 0, 0.5)) when open
```

**Navigation Links**
```
Padding: 12px 16px
Font Size: 1rem
Color: #6B7280 (gray-600) inactive
Color: #4F46E5 (indigo-600) active
Hover: Background #F3F4F6 (gray-100) light / #1F2937 (gray-800) dark
Active: Bold font weight, color indigo-600, left border 4px indigo-600
Border Radius: 8px
Cursor: pointer
```

---

#### **Badges**

**Plan Badge**
```
Free Plan:
Background: #E5E7EB (gray-200)
Text: #111827 (gray-900)
Padding: 6px 12px
Font Size: 12px
Font Weight: 600
Border Radius: 12px

Pro Plan:
Background: #4F46E5 (indigo-600)
Text: White
Padding: 6px 12px
Font Size: 12px
Font Weight: 600
Border Radius: 12px
```

---

### **Component Library Summary**

**shadcn/ui Components to Use**:
- Button (primary, secondary, danger variants)
- Input (text, email, password, number)
- Textarea
- Checkbox
- Radio
- Select
- Card
- Dialog / Modal
- Dropdown Menu
- Avatar
- Tabs
- Toast notifications

**DO NOT** use external UI libraries beyond shadcn/ui. Keep dependencies minimal.

---

## **ACCESSIBILITY REQUIREMENTS**

### **Compliance Target**

**WCAG 2.1 Level AA** (industry standard for web applications)

---

### **Visual Accessibility**

**Color Contrast**
- Normal text: 4.5:1 minimum (black on white, or equivalent)
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum
- Tool: Use WebAIM contrast checker to validate

**Text Sizing**
- Minimum: 14px (small text can be 12px)
- Line height: 1.5× font size minimum
- Letter spacing: Don't compress; use default or 0.5px
- Allow user to scale up to 200% without loss of content

**Focus Indicators**
- All interactive elements must have visible focus state
- Focus outline: 2px solid color with 2-4px offset
- Focus visible only for keyboard users (use `:focus-visible`)

**Icons & Images**
- All icons paired with text labels (or aria-label)
- Images require alt text (descriptive, concise)
- Decorative images: alt="" (empty)

---

### **Interaction Accessibility**

**Keyboard Navigation**
- All functionality available via keyboard (no mouse required)
- Tab order: Logical, top-to-bottom, left-to-right
- Skip navigation link at top of page (skip to main content)
- Trap focus in modals (don't tab out; cycle back to start)

**Touch Targets**
- Minimum size: 44px × 44px (mobile)
- Spacing: 8px minimum gap between targets
- No hover-only interactions (mobile users can't hover)

**Screen Reader Support**
- Proper semantic HTML (use `<button>`, not `<div onclick>`)
- Form labels: Always associated with inputs (`<label for="id">`)
- Headings: Proper hierarchy (h1 → h2 → h3, don't skip)
- Lists: Use `<ul>`, `<ol>`, `<li>` tags
- ARIA labels: Use aria-label for icon buttons without text
- Live regions: aria-live="polite" for dynamic content updates
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>` tags

**Motion & Animations**
- Respect `prefers-reduced-motion` (disable animations for users who prefer)
- Animations ≤ 5 seconds (don't loop indefinitely)
- No flashing content (avoiding seizure triggers)

---

### **Content Accessibility**

**Heading Structure**
- Use only one H1 per page
- Nest properly: H1 → H2 → H3 (don't jump levels)
- Headings should be descriptive

**Form Accessibility**
- All inputs have associated labels
- Error messages linked to inputs (aria-describedby)
- Required fields marked with `*` and aria-required="true"
- Placeholders NOT substitutes for labels

**Tables** (if used)
- Use `<thead>`, `<tbody>`, `<tfoot>`
- Header cells: `<th scope="col">` or `<th scope="row">`
- Complex tables: aria-labelledby for title/summary

---

### **Testing Strategy**

1. **Automated Testing**
   - axe DevTools (Chrome extension)
   - WAVE (WebAIM tool)
   - Lighthouse (Chrome DevTools)

2. **Keyboard Testing**
   - Tab through entire app (verify tab order)
   - Test modals (trap focus, escape closes)
   - Test form submission with keyboard only

3. **Screen Reader Testing** (monthly)
   - NVDA (Windows) or JAWS (Windows)
   - VoiceOver (macOS/iOS)
   - TalkBack (Android)
   - Test flows: signup, profile edit, upgrade

4. **Visual Testing**
   - Color contrast checker (WebAIM)
   - Zoom to 200% (should remain readable)
   - Test with Colorblind simulator (Protanopia, Deuteranopia)

5. **Manual Testing**
   - Test with actual assistive tech users (if possible)
   - Test on mobile with touch (no mouse)
   - Test with screen magnification software

---

## **RESPONSIVENESS STRATEGY**

### **Breakpoints**

| Breakpoint | Min Width | Max Width | Devices | Layout |
|-----------|-----------|-----------|---------|--------|
| **Mobile** | 320px | 639px | iPhone SE, small phones | 1 column, full width |
| **Tablet** | 640px | 767px | iPad mini, large phones | 1-2 columns |
| **Desktop** | 768px | 1199px | iPad Pro, laptops | 2-3 columns, sidebar |
| **Wide** | 1200px | ∞ | Desktop monitors | 3+ columns, max-width constraint |

---

### **Adaptation Patterns**

#### **Navigation Adaptations**
- **Mobile**: Hamburger menu (slide from left)
- **Tablet**: Collapsible sidebar (icon only until expanded)
- **Desktop**: Always-visible sidebar (256px fixed)

#### **Layout Adaptations**
- **Mobile**: Single column, full width, generous padding
- **Tablet**: Two columns (main + sidebar)
- **Desktop**: Three columns (sidebar + main + optional right panel)

#### **Form Adaptations**
- **Mobile**: Single column, full-width inputs, large touch targets (48px height)
- **Desktop**: Two column layout (if many fields), normal inputs (44px height)

#### **Typography Adaptations**
- **Mobile**: H1 = 24px, H2 = 20px, Body = 16px
- **Desktop**: H1 = 36px, H2 = 30px, Body = 16px
- **Readability**: Max line length 70 characters (mobile), 80 characters (desktop)

#### **Image/Content Adaptations**
- **Mobile**: Crop images, hide optional content, stack elements vertically
- **Desktop**: Full images, show optional content, arrange in grids
- **Lazy loading**: Load images below fold on demand

#### **Interaction Adaptations**
- **Mobile**: No hover states (use active/focus instead), larger touch targets
- **Desktop**: Hover states enhance UX, normal-sized targets (44px minimum)
- **Tooltips**: Show on hover (desktop), on tap (mobile), or omit if space-constrained

---

### **Specific Screen Adaptations**

#### **Landing Page**
- **Mobile**: Hero text smaller, single CTA button, cards stack vertically
- **Desktop**: Hero text large, multiple CTAs, 3-column feature grid

#### **Dashboard**
- **Mobile**: Hamburger menu, full-width cards
- **Desktop**: Sidebar always visible, 2-column card grid

#### **Pricing Table**
- **Mobile**: Horizontal scroll, card view (Free plan → Pro plan toggled)
- **Desktop**: Full table, comparison side-by-side

#### **Forms** (Profile, Settings)
- **Mobile**: Single column, large inputs, submit at bottom
- **Desktop**: Two column (label + input pairs), sticky submit button

---

### **Performance Considerations**

**Mobile-First CSS**
- Base styles for mobile (smallest, simplest)
- Use media queries to enhance for larger screens (mobile-first approach)
- Avoid large desktop-first resets

**Image Optimization**
- Responsive images: Use `<picture>` and `srcset`
- Format: WebP (modern), JPEG (fallback)
- Lazy loading: `loading="lazy"` for below-fold images

**Critical CSS**
- Inline critical CSS in `<head>` (landing page above fold)
- Defer non-critical CSS
- Goal: First Contentful Paint (FCP) < 1.5s

**Bundle Size** (from PRD: < 200KB minified)
- Tree-shake unused code
- Code-split by route (Next.js automatic)
- Lazy load heavy components (modals, dashboards)

---

## **NEXT STEPS & HANDOFF**

### **Immediate Actions**

1. **Design Review**
   - Share this spec with stakeholders
   - Gather feedback on user flows, error states, navigation
   - Validate component library choices (shadcn/ui)

2. **Visual Design**
   - Create high-fidelity mockups in Figma (or design tool)
   - Reference this spec for color, typography, spacing
   - Design key screens: landing, signup, dashboard, profile, settings, pricing

3. **Prototype Interactive Flows**
   - Build interactive prototype in Figma or similar
   - Test user journeys (signup → profile → upgrade)
   - Validate navigation and error states

4. **Developer Handoff**
   - Share this spec + AI Frontend Prompt (AI_FRONTEND_PROMPT.md)
   - Provide design files (Figma links, assets)
   - Clarify component library setup (shadcn/ui installation)

5. **QA Preparation**
   - Create test cases based on user flows
   - Prepare accessibility checklist
   - Plan manual testing on mobile devices

---

### **Design Handoff Checklist**

- [ ] All user flows documented and validated
- [ ] Error states designed for each flow
- [ ] Component inventory complete (buttons, inputs, cards, etc.)
- [ ] Color palette finalized and tested for contrast
- [ ] Typography scale defined and tested
- [ ] Accessibility requirements reviewed (WCAG 2.1 AA)
- [ ] Responsive strategy tested (mobile, tablet, desktop)
- [ ] Navigation structure clear and validated
- [ ] Brand guidelines incorporated (if applicable)
- [ ] Performance goals established (< 200KB JS, < 1.5s FCP)
- [ ] Figma/design files linked and organized
- [ ] AI Frontend Prompt ready for code generation

---

## **DOCUMENT METADATA**

| Field | Value |
|-------|-------|
| **Document Title** | UI/UX Specification - next-sqlite-starter |
| **Version** | 1.0 |
| **Created** | 2025-10-28 |
| **Owner** | UX Expert (Sally) |
| **Status** | Ready for Design & Development |
| **Related Documents** | AI_FRONTEND_PROMPT.md, next-sqlite-starter-PRD.md |
| **Last Updated** | 2025-10-28 |
| **Approval** | Pending stakeholder review |

---

**End of Document**

---

**Questions or feedback?** Contact the UX Expert or open a discussion in the project documentation repository.