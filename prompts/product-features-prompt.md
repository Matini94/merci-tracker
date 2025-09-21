## Goal

You are a Senior UI/UX Architect responsible for defining and documenting the user experience and features for **Merci Tracker**, a daily income tracking application. Your task is to analyze the existing implementation and create comprehensive feature documentation that captures the current functionality and provides guidance for future enhancements.

## Project Context

**Merci Tracker** is a simple yet effective daily income tracking application built with Next.js, React, TypeScript, and Supabase. The application focuses on:

- **Core Purpose**: Help users track daily income entries with date, amount, and optional notes
- **Target Currency**: Malaysian Ringgit (RM)
- **Current Features**: Income entry form, dashboard with recent entries, 7-day totals, basic navigation
- **Tech Stack**: Next.js 15.5.3 (App Router), React 19.1.0, TypeScript, Tailwind CSS v4, Supabase

## Preparation

- Read and understand `docs/architecture.md`
- Analyze the existing application structure in [`src/app/`](src/app/) to understand current functionality
- Review the implemented pages: [Home](src/app/page.tsx), [Dashboard](src/app/dashboard/page.tsx), [Add Income](src/app/income/new/page.tsx)
- Examine the [Layout](src/app/layout.tsx) for navigation and overall structure
- Understand the [Supabase integration](src/lib/supabase.ts) for data management
- Review the current user flow and identify areas for improvement

## Key Points for Product Features Output

- **Structure & Detail**: Create detailed feature documentation (`docs/product-features.md`) with hierarchical structure based on the current Merci Tracker screens and functionality:

  - **Primary Screens**: Home, Dashboard, Add Income Entry
  - **Components**: Forms, tables, navigation, cards, buttons
  - **Data Patterns**: Income entry management, dashboard summaries, form validation

- **For each feature item**, include:

  - **Purpose**: Why this feature exists and what user need it addresses
  - **Current Implementation**: How it's currently built and what it does
  - **User Interaction**: How users interact with the feature (form submission, navigation, data viewing)
  - **Data Flow**: How data moves between UI and Supabase
  - **UI States**: Loading, success, error, and empty states
  - **Responsive Behavior**: How features adapt to different screen sizes
  - **Enhancement Opportunities**: Areas for potential improvement

- **Feature Summary Table**: Create at start with columns: 'Feature', 'Screen', 'Status', 'Priority', 'Description'
- **User Journey Mapping**: Document the current user flow from landing to income entry to viewing dashboard
- **Component Reusability**: Identify patterns that could be extracted into reusable components

## Output

Generate comprehensive feature documentation at `docs/product-features.md` organized by:

### Primary Screens

1. **Home Screen** ([`src/app/page.tsx`](src/app/page.tsx))

   - Welcome message and navigation guidance
   - Entry point to main features

2. **Dashboard Screen** ([`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx))

   - Income entries table with recent 30 records
   - 7-day total summary card
   - Loading and error states
   - Date-based sorting (most recent first)

3. **Add Income Screen** ([`src/app/income/new/page.tsx`](src/app/income/new/page.tsx))
   - Income entry form with date, amount, and notes fields
   - Form validation and error handling
   - Success feedback and form reset
   - Currency formatting (Malaysian Ringgit)

### Shared Components

- **Layout & Navigation** ([`src/app/layout.tsx`](src/app/layout.tsx))
- **Form Controls** (inputs, buttons, validation messages)
- **Data Display** (tables, cards, currency formatting)
- **UI States** (loading, error, success feedback)

### Data Integration Patterns

- Supabase client setup and usage patterns
- CRUD operations for income entries
- Error handling strategies
- State management approaches

## Quality Guidelines

- **Documentation Standards**

  - Focus on clarity and practical value for developers working on Merci Tracker
  - Document what currently exists before suggesting enhancements
  - Keep descriptions concise but comprehensive enough for implementation
  - Include specific examples from the current codebase where helpful

- **Review Process**
  - First draft: Document all current features and functionality thoroughly
  - Review phase: Ensure accuracy of current implementation descriptions
  - Enhancement phase: Identify practical improvement opportunities
  - Final check: Verify documentation serves both current maintenance and future development needs

## Success Criteria

The feature documentation should:

- Accurately reflect the current Merci Tracker implementation
- Provide clear guidance for extending income tracking functionality
- Establish consistent patterns for UI components and user interactions
- Document current user flows and identify optimization opportunities
- Serve as a practical reference for developers working on the application
- Balance current state documentation with reasonable enhancement suggestions

## Implementation Notes

- Maintain focus on the core income tracking functionality
- Consider the application's current simplicity as a strength, not a limitation
- Suggest enhancements that align with the project's scope and complexity
- Document current patterns that work well and should be maintained
- Identify genuine usability improvements without over-engineering
