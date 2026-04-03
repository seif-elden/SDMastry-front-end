# SDMastry Front End

SDMastry Front End is the web client for the SDMastry learning platform. It helps learners work through backend and software engineering topics using guided attempts, AI chat support, progress tracking, analytics, and badges.

## Purpose

This project provides a focused study experience where users can:

- browse and follow a topic roadmap
- submit answers and receive evaluations
- continue learning through topic-specific AI chat
- track learning streaks and progress
- view analytics and unlock badges
- manage preferred AI agents and account settings

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Zustand
- Axios
- React Router
- Vitest + Testing Library

## Local Development

Requirements:

- Node.js 18+
- npm

Install and run:

```bash
npm install
npm run dev
```

The app runs at:

- http://localhost:5174

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview production build
npm run test       # run tests
npx tsc --noEmit   # type check
```

## Backend API

This frontend is configured to work with the SDMastry backend API at:

- http://localhost:8000/api/v1

## Project Structure

Main folders:

- src/pages: route-level pages
- src/components: reusable UI and feature components
- src/api: API modules and client configuration
- src/hooks: custom data and behavior hooks
- src/store: client state management
- src/types: shared TypeScript types

## Status

Current active frontend phase in this repository:

- FE-6 Analytics Dashboard and Badges
