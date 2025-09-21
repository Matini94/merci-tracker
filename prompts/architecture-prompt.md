### Goal

Generate a comprehensive, actionable frontend architecture for the **Merci Tracker** daily income tracking application. The architecture should ensure simplicity, maintainability, scalability, accessibility, and performance while providing a clean user experience for income data management.

### Project Context

**Merci Tracker** is a daily income tracking application built with:

- Next.js 15.5.3 (App Router with Turbopack)
- React 19.1.0 with TypeScript
- Tailwind CSS v4 for styling
- Supabase for backend/database
- Malaysian Ringgit (RM) currency focus

**Core Features:**

- Add daily income entries with date, amount, and notes
- View dashboard with recent entries and 7-day totals
- Simple navigation and responsive design
- Form validation and error handling

### Preparation

- Analyze the existing project structure under [`src/app/`](src/app/)
- Review the current Supabase integration in [`src/lib/supabase.ts`](src/lib/supabase.ts)
- Understand the current component structure and data flow
- Identify areas for architectural improvement without over-engineering

### Output

Generate and save the architecture documentation at `docs/architecture.md` with the following sections:

- **Table of Sections**: A concise, quick-reference table of all the sections below with a brief summary of each.
- **Project Overview**: Summarize Merci Tracker's scope, goals, and frontend development requirements for income tracking functionality.
- **Technical Stack & Dependencies**: Detail the current tech stack (Next.js, React, TypeScript, Tailwind CSS, Supabase) with justifications for each choice.
- **Development Approach**: Describe the development methodology focusing on simplicity, maintainability, and progressive enhancement.
- **System Architecture**: Detail the frontend architecture, including:
  - Component structure and hierarchy for income tracking features
  - State management approach (local state vs. server state)
  - Data flow between Supabase and UI components
  - Form validation and error handling patterns
  - Accessibility considerations for forms and data display
  - Performance optimization techniques appropriate for the app size
  - Browser compatibility strategies
- **Data Layer Integration**: Outline Supabase integration patterns, including:
  - Database schema considerations for income tracking
  - Client-side data fetching and mutation patterns
  - Error handling for database operations
  - Future authentication integration strategy
- **User Experience Patterns**: Define consistent UX patterns for:
  - Form interactions and validation feedback
  - Loading states and error messages
  - Navigation and routing
  - Responsive design considerations
- **Testing Strategy**: Outline testing approach appropriate for the application complexity.
- **Folder Structure**: Provide current and recommended folder organization.
- **Architecture Diagrams**: Use Mermaid.js to represent:
  - Component hierarchy and data flow
  - Supabase integration architecture

### Review and Quality Assurance

- **IMPORTANT**

  - This architecture documentation should balance comprehensiveness with simplicity.
  - First draft: Create the architecture documentation focusing on the current project scope.
  - Review phase: Validate that the architecture addresses the core income tracking requirements without over-engineering.
  - Final check: Ensure the documentation is actionable for developers working on Merci Tracker.
  - Focus on practical implementation guidance rather than theoretical concepts.

### Implementation Guidelines

- Keep architecture decisions aligned with the project's current simplicity and scope
- Prioritize maintainability and developer experience over complex patterns
- Ensure all recommendations are immediately actionable with the current tech stack
- Consider future scalability without premature optimization
- Document current patterns and suggest improvements where beneficial
- Maintain focus on the core income tracking functionality

### Success Criteria

The architecture documentation should:

- Provide clear guidance for extending the income tracking features
- Establish consistent patterns for component development
- Define clear data flow between Supabase and React components
- Include practical code examples where helpful
- Balance current needs with reasonable future extensibility
