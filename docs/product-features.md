# Merci Tracker - Product Features Documentation

## Feature Summary Table

| Feature              | Screen               | Status         | Priority | Description                                                        |
| -------------------- | -------------------- | -------------- | -------- | ------------------------------------------------------------------ |
| Welcome Landing      | Home                 | ✅ Implemented | Medium   | Simple welcome message and navigation guidance                     |
| Navigation Header    | All Screens          | ✅ Implemented | High     | Global navigation with app title and main action links             |
| Income Entries Table | Dashboard            | ✅ Implemented | High     | Table displaying recent 30 income entries with date, amount, notes |
| 7-Day Total Summary  | Dashboard            | ✅ Implemented | High     | Card showing total income for last 7 entries                       |
| Loading States       | Dashboard            | ✅ Implemented | Medium   | Loading indicator while fetching data                              |
| Error Handling       | Dashboard            | ✅ Implemented | Medium   | Error message display for failed data fetching                     |
| Income Entry Form    | Add Income           | ✅ Implemented | High     | Form with date, amount (RM), and notes fields                      |
| Form Validation      | Add Income           | ✅ Implemented | High     | Client-side validation for amount field and required fields        |
| Success Feedback     | Add Income           | ✅ Implemented | Medium   | Success message and form reset after submission                    |
| Currency Formatting  | Dashboard/Add Income | ✅ Implemented | Medium   | Malaysian Ringgit (RM) formatting for amounts                      |

## User Journey Mapping

### Primary User Flow

1. **Entry Point**: User lands on Home screen with welcome message
2. **Navigation**: User chooses between "Dashboard" (view data) or "Add income" (enter new data)
3. **Data Entry Path**: User fills income form → validates → submits → receives feedback → returns to dashboard
4. **Data Viewing Path**: User views dashboard → sees recent entries table → sees 7-day summary → can navigate to add more

### Alternative Flows

- **Error Recovery**: If form submission fails → user sees error message → can retry submission
- **Data Loading**: If dashboard loading fails → user sees error message → can refresh/retry

## Primary Screens

### 1. Home Screen (`src/app/page.tsx`)

**Purpose**: Serves as the application entry point and navigation hub for users to understand the app's purpose and access main features.

**Current Implementation**:

- Simple welcome message: "Welcome"
- Instructional text: "Use the nav to add income or view the dashboard"
- Clean, minimal design with Tailwind CSS spacing utilities

**User Interaction**:

- **Navigation**: Users read the welcome content and use the header navigation to proceed
- **Accessibility**: Standard HTML structure, semantic text elements

**Data Flow**:

- Static content only, no data fetching required

**UI States**:

- Single static state, no loading or error states needed

**Responsive Behavior**:

- Uses responsive container classes for mobile and desktop compatibility
- Text adapts naturally to screen width

**Enhancement Opportunities**:

- Add visual indicators or icons for main actions
- Include quick stats or recent activity preview
- Add onboarding for first-time users
- Consider adding direct action buttons for common tasks

### 2. Dashboard Screen (`src/app/dashboard/page.tsx`)

**Purpose**: Provides users with an overview of their recent income entries and key summary metrics to track their earning patterns.

**Current Implementation**:

- **Data Table**: Shows recent 30 income entries with columns for Date, Amount (RM), Notes
- **7-Day Summary Card**: Calculates and displays total income from the first 7 entries
- **Data Fetching**: Uses Supabase client to query `daily_income` table
- **Sorting**: Orders entries by date (most recent first)
- **Styling**: Clean table design with alternating row styling

**User Interaction**:

- **Data Viewing**: Users can scroll through the table to view entries
- **Information Processing**: Users can quickly see recent activity and weekly totals
- **Navigation**: Users can navigate to "Add income" to enter new data

**Data Flow**:

```
Dashboard Component → useEffect → Supabase query → State update → UI render
```

- Queries: `SELECT id, date, amount, notes FROM daily_income ORDER BY date DESC LIMIT 30`
- State management using React hooks (`useState` for rows, loading, error)

**UI States**:

- **Loading State**: Shows "Loading…" message while data fetches
- **Error State**: Displays red error message if query fails
- **Success State**: Shows data table and summary card with fetched data
- **Empty State**: Table shows no rows if no data exists (handled gracefully)

**Responsive Behavior**:

- Table adapts to mobile screens with Tailwind responsive utilities
- Card layout stacks appropriately on smaller screens
- Text size and spacing adjust for readability

**Enhancement Opportunities**:

- Add date range filtering options
- Implement pagination for large datasets
- Add export functionality (CSV/PDF)
- Include more summary statistics (monthly totals, averages)
- Add visual charts or graphs for income trends
- Implement edit/delete functionality for entries
- Add search functionality for notes or specific dates

### 3. Add Income Screen (`src/app/income/new/page.tsx`)

**Purpose**: Allows users to input new daily income entries with validation and feedback to maintain accurate financial records.

**Current Implementation**:

- **Form Fields**:
  - Date input (pre-filled with current date)
  - Amount input (number type with decimal support, RM currency)
  - Notes textarea (optional field)
- **Form Validation**: Client-side validation for non-negative numeric amounts
- **Supabase Integration**: Inserts new records into `daily_income` table
- **User Feedback**: Success/error messaging with status display

**User Interaction**:

- **Form Filling**: Users input date, amount, and optional notes
- **Validation**: Real-time validation on amount field (prevents negative values)
- **Submission**: Form submission with loading feedback
- **Success Flow**: Form resets amount and notes fields, keeps date
- **Error Recovery**: Error messages displayed for failed submissions

**Data Flow**:

```
Form Input → Validation → Supabase INSERT → Response handling → UI feedback
```

- Insert query: `INSERT INTO daily_income (date, amount, notes) VALUES (...)`
- Form state managed with individual useState hooks for each field

**UI States**:

- **Default State**: Clean form with current date pre-filled
- **Validation Error**: Inline error message for invalid amount
- **Submitting State**: Form disabled during submission (implicit)
- **Success State**: Green success message "Saved!" with form reset
- **Error State**: Red error message with specific error details

**Responsive Behavior**:

- Form adapts to mobile with full-width inputs
- Touch-friendly input controls for mobile devices
- Proper input types for better mobile keyboard experience

**Enhancement Opportunities**:

- Add recurring income templates
- Implement income categories or tags
- Add photo upload for receipts
- Include income source tracking
- Add bulk entry for multiple days
- Implement auto-save/draft functionality
- Add confirmation dialogs for large amounts
- Include income type classification (salary, freelance, etc.)

## Shared Components

### Layout & Navigation (`src/app/layout.tsx`)

**Purpose**: Provides consistent application structure and navigation across all screens.

**Current Implementation**:

- **Header**: Fixed header with app title and navigation links
- **Navigation Links**: "Dashboard" and "Add income" links with hover effects
- **Layout Structure**: HTML5 semantic structure with header and main content areas
- **Styling**: Tailwind CSS with consistent spacing and typography

**User Interaction**:

- **Navigation**: Click-based navigation between main sections
- **Hover Effects**: Visual feedback on navigation links

**Responsive Behavior**:

- Navigation adapts from horizontal layout to mobile-friendly arrangement
- Consistent max-width container for content alignment

**Enhancement Opportunities**:

- Add active state indicators for current page
- Implement breadcrumb navigation
- Add user authentication UI elements
- Include settings/preferences access

### Form Controls

**Current Patterns**:

- **Input Styling**: Consistent border, padding, and focus states
- **Labels**: Clear labeling with semantic HTML structure
- **Button Styling**: Primary blue button with hover states
- **Validation**: Inline error messaging with color coding

**Enhancement Opportunities**:

- Extract reusable input components
- Add loading states for buttons
- Implement consistent validation patterns
- Add form field help text/tooltips

### Data Display

**Current Patterns**:

- **Table Structure**: Clean, readable table with header and data rows
- **Card Design**: Summary cards with clear hierarchy
- **Currency Formatting**: Consistent RM formatting with 2 decimal places
- **Date Display**: Simple date string format

**Enhancement Opportunities**:

- Create reusable table component
- Add sorting functionality
- Implement consistent loading skeletons
- Add empty state illustrations

## Data Integration Patterns

### Supabase Client Setup (`src/lib/supabase.ts`)

**Current Implementation**:

- Simple Supabase client initialization
- Environment variable configuration for URL and anon key
- Exported client for use across components

**Enhancement Opportunities**:

- Add TypeScript types for database schema
- Implement authentication integration
- Add connection error handling
- Create custom hooks for common queries

### CRUD Operations

**Current Patterns**:

- **Read**: Dashboard uses SELECT with ordering and limiting
- **Create**: Add Income form uses INSERT with error handling
- **State Management**: Local component state with useEffect for data fetching

**Enhancement Opportunities**:

- Implement optimistic updates
- Add caching strategies
- Create custom hooks for data operations
- Add real-time subscriptions for live updates

### Error Handling Strategies

**Current Implementation**:

- Basic try-catch in async operations
- User-friendly error message display
- Component-level error state management

**Enhancement Opportunities**:

- Implement global error boundary
- Add retry mechanisms
- Create centralized error logging
- Add offline functionality

## Component Reusability Analysis

### High Reusability Potential

1. **Input Field Component**: Date, number, and text inputs share similar styling
2. **Button Component**: Form submission and navigation buttons could be standardized
3. **Loading Component**: Loading states could be centralized
4. **Error Message Component**: Error display patterns are consistent

### Medium Reusability Potential

1. **Card Component**: Summary card pattern could be extracted
2. **Table Component**: Data table structure could be reusable
3. **Form Wrapper**: Common form layout and validation patterns

### Enhancement Recommendations

- Extract common UI patterns into reusable components
- Implement consistent design system with Tailwind CSS utilities
- Create custom hooks for data fetching and form handling
- Establish consistent naming and file organization patterns

## Future Scalability Considerations

### Architecture Readiness

- **Component Structure**: Current flat structure works for current scope, could benefit from feature-based organization
- **State Management**: Local state sufficient for now, consider context or external state management as features grow
- **Data Layer**: Supabase integration is scalable, could benefit from typed schemas and custom hooks

### Performance Considerations

- **Bundle Size**: Currently minimal, good foundation for growth
- **Data Loading**: Consider implementing pagination and virtualization for large datasets
- **Caching**: Implement query caching for better user experience

This documentation reflects the current state of Merci Tracker and provides a solid foundation for future development while maintaining the application's core strength of simplicity and usability.
