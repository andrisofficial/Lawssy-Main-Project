# LegalEase Frontend Development Guidelines

**Version:** 1.1
**Date:** April 1, 2023
**Author:** LegalEase Development Team
**Status:** Approved

---

## 1. Introduction

This document provides guidelines and best practices for developing the frontend of the LegalEase SaaS platform. Adhering to these guidelines ensures consistency, maintainability, performance, and a high-quality user experience.

The frontend is built using React.js, TypeScript, Material-UI, Redux, React Hook Form, Zod, and NextAuth.js. All development should align with the technical stack defined in [technical-stack.md](technical-stack.md).

> **For implementation timelines and phases, see [frontend-implementation-plan.md](frontend-implementation-plan.md)**  
> **For file organization structure, see [file-structure.md](file-structure.md)**

---

## 2. Core Principles

*   **Consistency:** Maintain a consistent coding style, architectural patterns, and UI design across the application, ensuring LegalEase's professional legal appearance.
*   **Readability:** Write clear, concise, and well-documented code. Use meaningful variable and function names that reflect legal industry terminology.
*   **Maintainability:** Design components and features in a modular and reusable way. Follow SOLID principles where applicable, especially for complex legal workflows.
*   **Performance:** Optimize for speed and efficiency. Pay attention to bundle size, rendering performance, and network requests. Legal professionals require immediate access to case information.
*   **Accessibility (a11y):** Ensure the application meets WCAG 2.1 AA standards. Use semantic HTML and ARIA attributes correctly, important for legal industry compliance.
*   **Security:** Implement security best practices, especially regarding authentication, data handling, and dependency management. Attorney-client privilege requires the highest standards of data protection.
*   **Testability:** Write code that is easily testable. Aim for high unit test coverage as specified in [technical-stack.md](technical-stack.md) (80% goal with Jest).

---

## 3. Code Style and Formatting

*   **Linter & Formatter:** Use ESLint and Prettier configured for the project (typically via `.eslintrc.js` and `.prettierrc.js`). Ensure code is linted and formatted before committing.
*   **TypeScript:** Adhere strictly to TypeScript. Avoid using `any` whenever possible. Define clear interfaces and types for props, state, API responses, and Redux state.
*   **Naming Conventions:**
    *   Components: PascalCase (e.g., `CaseDetailView.tsx`, `ClientIntakeForm.tsx`)
    *   Functions/Variables: camelCase (e.g., `fetchCaseDetails`, `calculateBillableHours`)
    *   Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_PAGE_SIZE`, `BILLING_RATE_TYPES`)
    *   Interfaces/Types: PascalCase with optional 'I' prefix (e.g., `interface ICaseData` or `type CaseData`)
    *   Legal-specific naming: Use industry-standard terminology consistently (e.g., "matter" vs "case", "billing" vs "invoice")
*   **Comments:** Add comments to explain complex logic, assumptions, or workarounds. Avoid redundant comments.

> **Code style should align with patterns demonstrated in [app-flow-document.md](app-flow-document.md) to ensure consistency.**

---

## 4. Directory Structure

*   Follow the established directory structure as defined in [file-structure.md](file-structure.md).
*   Organize code by feature or domain (e.g., `src/features/cases/`, `src/features/billing/`).
*   Group related files (component, styles, tests, types) together within feature directories.
*   Use shared directories for common components, hooks, utils, and types (`src/components/`, `src/hooks/`, `src/utils/`, `src/types/`).
*   LegalEase-specific modules should be organized as follows:
    * `src/features/matters/` - All matter management functionality
    * `src/features/documents/` - Document management, templates, and generation
    * `src/features/billing/` - Time tracking, invoicing, and trust accounting
    * `src/features/clients/` - Client management and portal access
    * `src/features/calendar/` - Scheduling, deadlines, and court dates

---

## 5. React Components

*   **Functional Components:** Use functional components with React Hooks exclusively. Avoid class components.
*   **Props:**
    *   Define props using TypeScript interfaces or types.
    *   Use destructuring for accessing props.
    *   Provide default values for optional props where appropriate.
    *   Example for a matter component:
    ```typescript
    interface MatterCardProps {
      matter: IMatter;
      onView?: (matterId: string) => void;
      onEdit?: (matterId: string) => void;
      isExpanded?: boolean;
    }
    ```
*   **Hooks:**
    *   Follow the Rules of Hooks.
    *   Create custom hooks (`use[Feature]`) for reusable logic (e.g., `useMatterData`, `useTimeTracking`).
    *   Implement LegalEase-specific hooks for common workflows:
        * `useTimerControl` - For managing billable time tracking
        * `useMatterStatus` - For handling matter status transitions
        * `useDocumentAccess` - For managing document permissions
*   **Component Size:** Keep components small and focused on a single responsibility. Decompose large components into smaller, reusable ones.
*   **Memoization:** Use `React.memo`, `useCallback`, and `useMemo` judiciously to optimize performance, especially for computationally expensive operations or to prevent unnecessary re-renders in large matter lists or document repositories.

> **Component implementation examples can be found in the user flows documented in [app-flow-document.md](app-flow-document.md).**

---

## 6. State Management (Redux)

*   **When to Use Redux:** Use Redux for global state that needs to be accessed or modified by multiple parts of the application:
    * Current user and authentication state
    * Active matters list and selected matter
    * Global time tracking data
    * Notification center state
    * Application settings and preferences
*   **Avoid Overuse:** For state local to a component or its immediate children, prefer React's built-in `useState` or `useReducer` hooks.
*   **Structure:**
    *   Organize Redux logic by feature (slices) using Redux Toolkit (`@reduxjs/toolkit`).
    *   Define slices including reducers, actions, and selectors.
    *   Use `createSlice` for defining reducers and actions.
    *   Use `configureStore` to set up the store.
    *   Example slices for LegalEase:
        ```
        auth/authSlice.ts
        matters/mattersSlice.ts
        documents/documentsSlice.ts
        billing/billingSlice.ts
        timeTracking/timeTrackingSlice.ts
        ```
*   **Selectors:** Use Reselect or simple selector functions to derive data from the Redux store, memoizing complex computations.
*   **Immutability:** Reducers must be pure functions and treat state immutably. Redux Toolkit's Immer integration helps manage immutability within `createSlice`.
*   **Asynchronous Logic:** Use Redux Toolkit's `createAsyncThunk` for handling asynchronous operations like API calls to the LegalEase backend.

> **State management patterns should support the user flows defined in [app-flow-document.md](app-flow-document.md).**

---

## 7. Styling (Material-UI)

*   **Component Library:** Use Material-UI (MUI) as the primary component library (`@mui/material`).
*   **Theming:**
    *   Utilize the central LegalEase theme provider defined in `src/styles/theme.ts`.
    *   The theme implements a professional legal color palette:
        * Primary: Pentonay 19-4052 classic blue (#244F80)
        * Secondary: Gold accent (#BFA181)
        * Neutral tones: Various grays (#F7F7F7, #E5E5E5, #333333)
        * Semantic colors: Success green (#2E7D32), Warning amber (#FF8F00), Error red (#C62828)
    *   Use theme values (palette, typography, spacing, breakpoints) for consistency.
    *   Avoid hardcoding colors, font sizes, or spacing values directly in components.
*   **Customization:**
    *   Prefer the `sx` prop for instance-specific overrides or simple style adjustments.
    *   Use MUI's `styled` utility for creating reusable styled components or more complex style logic.
    *   Example of a styled component for LegalEase:
    ```typescript
    const MatterCard = styled(Card)(({ theme }) => ({
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      transition: 'all 0.2s ease',
      '&:hover': {
        boxShadow: theme.shadows[3],
      },
    }));
    ```
*   **Layout:** Use MUI's layout components (`Grid`, `Stack`, `Box`) for structuring pages and components.
*   **Responsiveness:** Design components to be responsive using MUI's breakpoint helpers, ensuring the application works well on tablets used by attorneys in courtrooms.

> **The LegalEase UI design follows patterns established in [product-requirement.md](product-requirement.md).**

---

## 8. Form Handling (React Hook Form + Zod)

*   **Library:** Use React Hook Form (`react-hook-form`) for managing form state, validation, and submission.
*   **Validation:** Use Zod (`zod`) for defining validation schemas.
    *   Define Zod schemas for form data structures.
    *   Use the `@hookform/resolvers/zod` adapter to integrate Zod schemas with React Hook Form.
    *   Implement legal-specific validators for:
        * Bar numbers
        * Matter IDs
        * Jurisdictional date formats
        * Tax ID numbers
*   **Error Handling:** Display validation errors clearly to the user, associated with the specific input fields.
*   **Submission:** Handle form submission logic within the `onSubmit` handler provided by `useForm`.
*   **LegalEase Form Examples:**
    ```typescript
    // Matter creation form schema
    const matterSchema = z.object({
      matterName: z.string().min(3, "Matter name must be at least 3 characters"),
      clientId: z.string().uuid("Please select a valid client"),
      practiceArea: z.enum(PRACTICE_AREAS, "Please select a valid practice area"),
      openDate: z.date(),
      statutes: z.array(z.string()).optional(),
      responsibleAttorneyId: z.string().uuid("Please select a responsible attorney"),
      billingType: z.enum(["hourly", "contingency", "fixed"]),
      billingRate: z.number().min(0).optional(),
    });
    ```
*   **Accessibility:** Ensure forms are accessible, using correct labels, ARIA attributes, and focus management.

> **Form implementation should follow the flows defined in [app-flow-document.md](app-flow-document.md).**

---

## 9. API Interaction

*   **Communication:** Interact with the LegalEase backend RESTful API for all data operations.
*   **Fetching:**
  *   Use standard `fetch` or a library like `axios` configured consistently across the project.
    *   Consider using a dedicated data-fetching library integrated with React (e.g., React Query/TanStack Query, SWR) if not already using Redux Toolkit's `createAsyncThunk` for data fetching.
    *   Encapsulate API call logic within dedicated service files or custom hooks (e.g., `src/services/caseService.ts`, `useCaseData`).
    *   Use Axios for API requests, configured in `src/services/api/apiClient.ts`.
    *   Utilize Redux Toolkit's `createAsyncThunk` for API calls that update global state.
    *   Encapsulate API call logic within dedicated service files or custom hooks (e.g., `src/services/matterService.ts`, `useMatterData`).
*   **State Handling:** Manage loading, success, and error states explicitly for API requests. Provide feedback to the user (e.g., loading spinners, error messages, success notifications).
*   **Error Handling:** Catch API errors gracefully. Display user-friendly error messages and log detailed errors to Sentry.
*   **Typing:** Use TypeScript interfaces/types for API request payloads and response data, matching the backend data models.
*   **LegalEase API Services:**
    ```typescript
    // Example Matter service
    export const matterService = {
      getMatters: (filters?: MatterFilters) => 
        apiClient.get<Matter[]>('/matters', { params: filters }),
      
      getMatterById: (matterId: string) => 
        apiClient.get<MatterDetail>(`/matters/${matterId}`),
      
      createMatter: (matterData: CreateMatterDto) => 
        apiClient.post<Matter>('/matters', matterData),
      
      updateMatter: (matterId: string, matterData: UpdateMatterDto) => 
        apiClient.put<Matter>(`/matters/${matterId}`, matterData),
    };
    ```

> **API integration should support all user flows described in [app-flow-document.md](app-flow-document.md).**

---

## 10. Authentication (NextAuth.js)

*   **Integration:** Utilize NextAuth.js with Supabase for handling user authentication flows as specified in [technical-stack.md](technical-stack.md).
*   **Session Access:** Use NextAuth.js `useSession` hook to access user session data and authentication status.
*   **Protected Routes:** Implement `ProtectedRoute` component to secure pages requiring authentication, redirecting unauthenticated users to the login page.
*   **Role-Based Access:** Implement role-based access control (RBAC) based on user roles:
    * Attorney
    * Paralegal
    * Administrative staff
    * Billing specialist
    * Client (portal access only)
*   **Token Handling:** Allow NextAuth.js to manage JWTs securely, ensuring tokens contain necessary claims for role-based permissions.

> **Authentication flows should match those detailed in [app-flow-document.md](app-flow-document.md) section 2.**

---

## 11. Testing (Jest & Cypress)

*   **Unit Tests (Jest):**
    *   Write unit tests for components, hooks, utility functions, and Redux reducers/selectors.
    *   Use React Testing Library (`@testing-library/react`) for testing components from a user's perspective.
    *   Mock dependencies (API calls, hooks, modules) where necessary.
    *   Aim for the 80% coverage goal defined in [technical-stack.md](technical-stack.md).
*   **End-to-End Tests (Cypress):**
    *   Write E2E tests for critical legal workflows:
        * Matter creation and management
        * Document upload and management
        * Time tracking and billing
        * Client portal access
    *   Focus on testing user interactions and verifying application behavior across different parts of the system.
*   **Test Structure:** Place test files alongside the code they are testing (e.g., `MatterList.test.tsx` next to `MatterList.tsx`).
*   **LegalEase-Specific Test Examples:**
    ```typescript
    // Example of a matter component test
    describe('MatterList', () => {
      it('should display a list of matters', async () => {
        // Arrange
        render(<MatterList matters={mockMatters} />);
        
        // Assert
        expect(screen.getAllByTestId('matter-card')).toHaveLength(mockMatters.length);
      });
      
      it('should filter matters by practice area', async () => {
        // Arrange
        render(<MatterList matters={mockMatters} />);
        
        // Act
        fireEvent.click(screen.getByTestId('filter-button'));
        fireEvent.click(screen.getByText('Family Law'));
        
        // Assert
        const familyLawMatters = mockMatters.filter(m => m.practiceArea === 'Family Law');
        expect(screen.getAllByTestId('matter-card')).toHaveLength(familyLawMatters.length);
      });
    });
    ```

---

## 12. Performance Optimization

*   **Code Splitting:** Leverage Next.js dynamic imports to split code by route or feature, reducing initial load times.
*   **Lazy Loading:** Lazy load heavy components like document viewers or rich text editors.
*   **Memoization:** Use `React.memo`, `useCallback`, `useMemo` appropriately for components rendering large datasets like matter lists or document repositories.
*   **Bundle Size:** Regularly monitor bundle size using Webpack Bundle Analyzer. Avoid large dependencies where possible.
*   **Network Requests:** Minimize unnecessary API calls. Implement caching strategies for:
    * Matter list data
    * Document metadata
    * User preferences
    * Lookup data (court information, practice areas, etc.)
*   **Debouncing/Throttling:** Apply debouncing for search inputs in matter or document finders, and throttling for real-time billing calculators.
*   **Critical Path Optimization:**
    * Prioritize loading the core UI shell
    * Defer loading of non-critical data
    * Implement skeleton loaders for common components

> **Performance requirements are defined in [product-requirement.md](product-requirement.md) under non-functional requirements.**

---

## 13. Accessibility (a11y)

*   **Semantic HTML:** Use appropriate HTML5 elements (`<nav>`, `<main>`, `<article>`, `<button>`, etc.).
*   **ARIA Attributes:** Use ARIA roles and attributes correctly when semantic HTML is insufficient, especially for custom components like the timer control or document viewer.
*   **Keyboard Navigation:** Ensure all interactive elements are reachable and operable via keyboard, particularly important for legal professionals who may rely on keyboard navigation for efficiency.
*   **Focus Management:** Manage focus appropriately, especially in modals, forms, and after async operations.
*   **Color Contrast:** Ensure sufficient color contrast between text and background according to WCAG guidelines (minimum 4.5:1 for normal text).
*   **Testing:** Use automated accessibility testing tools (Axe) and perform manual checks with screen readers.
*   **Legal-Specific Accessibility:**
    * Ensure all legal jargon can be accessed by screen readers with correct pronunciation
    * Provide appropriate text alternatives for legal document previews
    * Implement keyboard shortcuts for common legal workflows

---

## 14. Documentation

*   **Code Comments:** Add JSDoc-style comments for complex functions, custom hooks, and components, explaining their purpose, parameters, and return values.
*   **Component Documentation:** Use Storybook for documenting reusable UI components in isolation, especially for the shared component library.
*   **Workflow Documentation:** Implement thorough documentation for complex legal workflows, connecting code implementation to requirements in [product-requirement.md](product-requirement.md).
*   **Repository Documentation:** Maintain up-to-date README files and developer guides to ensure new team members can quickly understand codebase organization.

---

## 15. Legal-Specific Development Considerations

*   **Client Confidentiality:** Implement strict data compartmentalization to prevent any possibility of data leakage between law firm clients.
*   **Billing Precision:** Time tracking components must capture time with second-level precision, while displaying in the format preferred by legal industry (usually 0.1 hour increments).
*   **Document Security:** Implement secure document handling with watermarking, access controls, and audit logging.
*   **Jurisdictional Variations:** Design components to accommodate different jurisdictional requirements for date formats, court rules, and statutory references.
*   **Audit Trail:** Ensure all user actions that modify case data, documents, or billing records create appropriate audit log entries.

---

> **Related Documentation:**
> - [product-requirement.md](product-requirement.md) - Detailed feature requirements
> - [technical-stack.md](technical-stack.md) - Technical implementation details
> - [app-flow-document.md](app-flow-document.md) - User workflow specifications
> - [frontend-implementation-plan.md](frontend-implementation-plan.md) - Implementation plan
> - [file-structure.md](file-structure.md) - Project organization

*This document is subject to updates as the project evolves.* 