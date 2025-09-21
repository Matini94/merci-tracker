# Components Documentation

This directory contains all reusable UI components for the Merci Tracker application.

## Directory Structure

```
src/components/
├── ui/                     # Basic UI components
│   ├── Card.tsx           # Container component for content sections
│   ├── ErrorMessage.tsx   # Error display component with accessibility
│   ├── LoadingSkeleton.tsx # Loading placeholders
│   └── LoadingSpinner.tsx # Animated loading indicators
├── forms/                 # Form-related components
│   └── FormInput.tsx      # Reusable form input with validation
├── data/                  # Data display components
│   └── DataTable.tsx      # Generic table component
├── ErrorBoundary.tsx      # React Error Boundary
└── README.md             # This file
```

## UI Components

### Card

A container component for wrapping content with consistent styling.

```tsx
import Card from "@/components/ui/Card";

<Card padding="md" className="custom-class">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>;
```

**Props:**

- `children`: React.ReactNode - Content to display inside the card
- `className?`: string - Additional CSS classes
- `padding?`: 'sm' | 'md' | 'lg' - Padding size (default: 'md')

### ErrorMessage

Displays error messages with proper accessibility attributes.

```tsx
import ErrorMessage from "@/components/ui/ErrorMessage";

<ErrorMessage message="Something went wrong" />;
```

**Props:**

- `message`: string - Error message to display
- `className?`: string - Additional CSS classes

**Accessibility:**

- Uses `role="alert"` for screen reader announcements
- Includes `aria-live="polite"` for dynamic updates
- Error icon has `aria-hidden="true"`

### LoadingSpinner

Animated spinner for loading states.

```tsx
import LoadingSpinner from "@/components/ui/LoadingSpinner";

<LoadingSpinner size="lg" className="text-blue-500" />;
```

**Props:**

- `size?`: 'sm' | 'md' | 'lg' - Spinner size (default: 'md')
- `className?`: string - Additional CSS classes

### LoadingSkeleton

Skeleton placeholders for loading states.

```tsx
import LoadingSkeleton, { CardSkeleton, TableRowSkeleton } from '@/components/ui/LoadingSkeleton';

// Basic skeleton
<LoadingSkeleton width="w-32" height="h-4" variant="text" />

// Predefined patterns
<CardSkeleton />
<TableRowSkeleton />
```

**Props:**

- `className?`: string - Additional CSS classes
- `width?`: string - Width using Tailwind classes (default: 'w-full')
- `height?`: string - Height using Tailwind classes (default: 'h-4')
- `variant?`: 'text' | 'rectangular' | 'circular' - Shape variant

## Form Components

### FormInput

Reusable form input with built-in validation and accessibility.

```tsx
import FormInput from "@/components/forms/FormInput";

<FormInput
  label="Amount (RM)"
  type="number"
  value={amount}
  onChange={setAmount}
  error={amountError}
  required
/>;
```

**Props:**

- `label`: string - Input label text
- `type`: 'text' | 'number' | 'date' | 'email' - Input type
- `value`: string - Current input value
- `onChange`: (value: string) => void - Change handler
- `placeholder?`: string - Placeholder text
- `required?`: boolean - Whether field is required
- `error?`: string - Error message to display
- Additional HTML input attributes (min, max, step, inputMode)

**Accessibility:**

- Proper label association with `htmlFor` and `id`
- Error messages linked with `aria-describedby`
- `aria-invalid` when error is present
- Focus management with visual indicators

## Data Components

### DataTable

Generic table component for displaying tabular data.

```tsx
import DataTable from "@/components/data/DataTable";

const columns = [
  { key: "date", header: "Date", render: (value) => formatDate(value) },
  { key: "amount", header: "Amount", render: (value) => formatCurrency(value) },
];

<DataTable data={entries} columns={columns} emptyMessage="No entries found" />;
```

**Props:**

- `data`: T[] - Array of data objects (must have 'id' property)
- `columns`: Column<T>[] - Column configuration
- `className?`: string - Additional CSS classes
- `emptyMessage?`: string - Message when data is empty

**Column Configuration:**

- `key`: keyof T - Property key to display
- `header`: string - Column header text
- `render?`: (value, row) => ReactNode - Custom render function
- `className?`: string - Cell CSS classes

## Error Boundary

### ErrorBoundary

React Error Boundary for graceful error handling.

```tsx
import ErrorBoundary from "@/components/ErrorBoundary";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>;
```

**Props:**

- `children`: ReactNode - Components to wrap
- `fallback?`: ReactNode - Custom error UI

**Features:**

- Catches JavaScript errors in component tree
- Displays user-friendly error message
- Provides "Try again" functionality
- Console logging for development
- Production-ready error reporting hooks

## Usage Guidelines

### Styling

- All components use Tailwind CSS classes
- Consistent color scheme: blue for primary actions, red for errors
- Responsive design principles applied
- Focus states for accessibility

### Accessibility

- WCAG 2.1 AA compliance
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Semantic HTML structure

### Testing

- Unit tests for all components
- Accessibility testing included
- Mock data patterns provided
- Jest and React Testing Library setup

## Future Enhancements

Potential improvements for these components:

1. **Theming System**: Add support for light/dark themes
2. **Animation Library**: Enhanced transitions and micro-interactions
3. **Form Validation**: Built-in validation schemas
4. **Internationalization**: Multi-language support
5. **Advanced Data Table**: Sorting, filtering, pagination
6. **Component Variants**: More style variations for different contexts
