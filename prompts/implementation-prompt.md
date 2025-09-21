## Goal

You are a Senior Full-Stack Developer responsible for implementing **Merci Tracker** milestones incrementally. This prompt runs iteratively - each execution implements one complete milestone, updates progress tracking, and prepares for the next run. You work systematically through the milestone development plan, ensuring each milestone is fully implemented, tested, and documented before moving to the next.

## Project Context

**Merci Tracker** is being developed through milestone-based iterations:

- **Architecture Foundation**: Next.js 15.5.3, React 19.1.0, TypeScript, Tailwind CSS v4, Supabase
- **Current Implementation**: Basic income tracking with entry forms and dashboard
- **Development Approach**: Incremental milestone implementation with state tracking
- **Quality Focus**: Complete, tested, deployable functionality at each milestone

## Preparation & State Management

### Required Documents (Read First)

1. **Architecture Guide**: [`docs/architecture.md`](docs/architecture.md) - Technical architecture and patterns
2. **Product Features**: [`docs/product-features.md`](docs/product-features.md) - Feature specifications and requirements
3. **Milestone Plan**: [`docs/milestone-development.md`](docs/milestone-development.md) - Detailed milestone breakdown
4. **Progress Tracking**: [`docs/milestone-progress.json`](docs/milestone-progress.json) - Current implementation status

### State Initialization

If `docs/milestone-progress.json` does not exist, create it with:

```json
{
  "project": "merci-tracker",
  "current_milestone": 1,
  "milestones": {
    "1": {
      "name": "Foundation Enhancement",
      "status": "pending",
      "start_date": null,
      "completion_date": null,
      "deliverables": []
    },
    "2": {
      "name": "User Experience Improvements",
      "status": "pending",
      "start_date": null,
      "completion_date": null,
      "deliverables": []
    },
    "3": {
      "name": "Data Management & Analytics",
      "status": "pending",
      "start_date": null,
      "completion_date": null,
      "deliverables": []
    },
    "4": {
      "name": "Advanced Features",
      "status": "pending",
      "start_date": null,
      "completion_date": null,
      "deliverables": []
    },
    "5": {
      "name": "Platform & Integration",
      "status": "pending",
      "start_date": null,
      "completion_date": null,
      "deliverables": []
    }
  },
  "last_updated": null
}
```

## Implementation Workflow

### Step 1: State Assessment

1. Read [`docs/milestone-progress.json`](docs/milestone-progress.json) to determine current milestone
2. Identify the next pending milestone to implement
3. If all milestones are complete, report final status and exit
4. Update milestone status to "in_progress" and set start_date

### Step 2: Milestone Analysis

1. Read the specific milestone details from [`docs/milestone-development.md`](docs/milestone-development.md)
2. Review architecture requirements from [`docs/architecture.md`](docs/architecture.md)
3. Check feature specifications in [`docs/product-features.md`](docs/product-features.md)
4. Analyze current codebase to understand starting point
5. Plan implementation tasks and file changes needed

### Step 3: Implementation Execution

**For Each Milestone, Implement ALL Required Components:**

#### Milestone 1: Foundation Enhancement

- Set up comprehensive error boundaries and error handling
- Implement loading states and user feedback systems
- Add form validation improvements and accessibility features
- Set up testing framework and write initial tests
- Optimize performance and add code splitting
- Update documentation and development guidelines

#### Milestone 2: User Experience Improvements

- Enhance dashboard with filtering, sorting, and date range features
- Improve mobile responsiveness and touch interactions
- Add user onboarding flow and help documentation
- Implement advanced form features (auto-save)
- Add data visualization for income trends
- Improve navigation and user flow

#### Milestone 3: Data Management & Analytics

- Build comprehensive reporting dashboard
- Implement data export/import functionality
- Add income categorization and tagging
- Create historical analysis and trend visualization
- Build backup and data management tools
- Add search and filtering capabilities

#### Milestone 4: Advanced Features

- Implement user authentication system
- Add multi-user support and data isolation
- Create goal setting and tracking features
- Build notification and reminder systems
- Add income prediction and budgeting tools
- Implement data synchronization features

#### Milestone 5: Platform & Integration

- Develop REST API for external integrations
- Implement Progressive Web App (PWA) features
- Add third-party service integrations
- Build mobile app foundation or enhanced mobile web
- Implement advanced security features
- Add scalability improvements and monitoring

### Step 4: Testing & Validation

1. **Unit Testing**: Test all new components and functions
2. **Integration Testing**: Verify feature integration and data flow
3. **User Testing**: Validate user experience and accessibility
4. **Performance Testing**: Ensure performance standards are met
5. **Browser Testing**: Verify cross-browser compatibility

### Step 5: Documentation & Completion

1. Update relevant documentation files
2. Create or update component documentation
3. Add changelog entry for milestone completion
4. Update [`docs/milestone-progress.json`](docs/milestone-progress.json):
   - Set status to "completed"
   - Add completion_date (ISO format)
   - List all deliverables completed
   - Update last_updated timestamp
5. Increment current_milestone to next pending milestone

## Quality Assurance Requirements

### Completion Criteria (ALL Must Be Met)

- [ ] All milestone deliverables implemented and functional
- [ ] All new code follows existing patterns and architecture
- [ ] Tests written and passing for new functionality
- [ ] No breaking changes to existing features
- [ ] Performance maintains or improves current benchmarks
- [ ] Mobile responsiveness maintained across all new features
- [ ] Accessibility standards met (WCAG 2.1 AA minimum)
- [ ] Error handling implemented for all new features
- [ ] Documentation updated to reflect changes

### Code Quality Standards

- TypeScript strict mode compliance
- ESLint and Prettier formatting
- Component extraction for reusable patterns
- Proper error boundaries and loading states
- Consistent naming conventions
- Performance optimizations where applicable

### Testing Requirements

- Unit tests for all utility functions
- Component tests for UI interactions
- Integration tests for database operations
- User flow tests for critical paths
- Performance tests for data-heavy operations

## Error Handling & Rollback

### If Implementation Fails

1. Document the failure reason and blockers
2. Revert milestone status to "pending" in progress file
3. Create issue log with specific error details
4. Provide clear next steps for resolution
5. Ensure codebase remains in stable, deployable state

### Rollback Procedure

1. Use git to revert changes if needed
2. Update milestone status appropriately
3. Document lessons learned
4. Plan approach for retry

## Success Indicators

### Milestone Completion Confirmed When:

- All deliverables are implemented and tested
- Application builds and runs without errors
- All existing functionality remains intact
- New features are accessible and performant
- Documentation is updated and accurate
- Progress tracking file is properly updated
- Ready for production deployment

### Next Run Preparation

- Progress file shows completed milestone
- Current_milestone incremented to next pending
- Codebase is in clean, stable state
- All documentation reflects current state
- Ready for next milestone implementation

## Implementation Notes

- **Focus**: Complete one full milestone per execution
- **Quality**: Never compromise on testing or documentation
- **State Management**: Always update progress tracking accurately
- **Deployment Ready**: Each milestone completion should be deployable
- **User Impact**: Prioritize features that provide immediate user value
- **Technical Debt**: Address technical improvements alongside features
- **Performance**: Maintain or improve performance with each milestone

## Final Output Requirements

At completion of each run, provide:

1. **Summary**: What milestone was implemented
2. **Deliverables**: List of all features/improvements added
3. **Testing Status**: All tests passing confirmation
4. **Next Steps**: What milestone will be tackled in next run
5. **State File**: Confirmation that progress tracking is updated
6. **Deployment Notes**: Any special deployment considerations

This prompt is designed to be executed repeatedly until all milestones are complete, with each run building incrementally on the previous work.
