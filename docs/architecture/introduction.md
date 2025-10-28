# **INTRODUCTION**

This document outlines the **complete full-stack architecture** for **next-sqlite-starter**, a minimalist SaaS boilerplate template designed for rapid development of web applications with authentication, user management, and payment integration.

## **Purpose**

This unified architecture serves as:
- Single source of truth for AI-driven development
- Reference guide for developers implementing features
- Foundation for consistent technology decisions
- Blueprint for deployment and operations

## **Starter Template**

This project is built on **Next.js 14+** with TypeScript, combining a frontend application and backend API within a monolithic Next.js instance. The stack includes Clerk for authentication, SQLite with Drizzle ORM for data persistence, Stripe for payment processing, and Tailwind CSS + shadcn/ui for the user interface.

No additional starter template is being modified; this is a greenfield project starting from Next.js App Router conventions.

## **Key Characteristics**

- **Monolithic Full-Stack:** Frontend and backend coexist in one Next.js app
- **Serverless-First:** Deployed on Vercel using Next.js API routes (serverless functions)
- **Type-Safe:** TypeScript throughout; potential for shared type definitions
- **Minimal Dependencies:** Focus on simplicity over feature richness
- **MVP-Focused:** Only essential features; designed for rapid iteration

## **Change Log**

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-28 | 1.0 | Initial architecture document | Architect (Winston) |

---
