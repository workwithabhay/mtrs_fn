# Design System & Token Specification

Comprehensive design tokens and reusable UI component primitives established for Review Management SaaS.

---

## 1. Color Palette Tokens

All colors are stored centrally in `src/app/globals.css` using Tailwind v4 `@theme` directives:

| Token Name | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| `--color-brand-primary` | `#4F46E5` | Primary buttons, brand accents, active states |
| `--color-brand-primary-hover` | `#4338CA` | Hover and active button states |
| `--color-brand-background` | `#F8FAFC` | Main application background (Slate 50) |
| `--color-brand-surface` | `#FFFFFF` | Card, container, and dialog background |
| `--color-brand-text-primary` | `#0F172A` | Primary headings, prominent body copy (Slate 900) |
| `--color-brand-text-secondary` | `#64748B` | Subheadings, helper text, labels (Slate 500) |
| `--color-brand-text-muted` | `#94A3B8` | Input placeholders, disabled hints (Slate 400) |
| `--color-brand-border` | `#E2E8F0` | Dividers, card borders, input borders (Slate 200) |
| `--color-brand-border-subtle` | `#F1F5F9` | Inner separators, subtle dividers (Slate 100) |
| `--color-brand-success` | `#15803D` | Positive ratings, success notifications (Emerald 700) |
| `--color-brand-warning` | `#B45309` | Caution states, cooldown timers, medium ratings (Amber 700) |
| `--color-brand-error` | `#B91C1C` | Form validation errors, destructive actions (Red 700) |
| `--color-brand-info` | `#0369A1` | Informational hints, probe badges (Sky 700) |

---

## 2. Typography Strategy (Non-Circular Resolution)

- **Primary Typeface**: **Inter** via `next/font/google` (OFL licensed), configured via CSS variable `--font-inter` in `src/app/layout.tsx`.
- **Theme Definition**:
  ```css
  --font-sans: var(--font-inter), "Google Sans", "Google Sans Flex", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  ```
  This guarantees **zero circular variable dependencies** in CSS while seamlessly prioritizing Google Sans if installed locally on the host machine.

---

## 3. Elevation & Shadows

- `--shadow-subtle`: `0 1px 2px 0 rgb(15 23 42 / 0.05)` (small buttons, chips)
- `--shadow-card`: `0 4px 6px -1px rgb(15 23 42 / 0.06), 0 2px 4px -2px rgb(15 23 42 / 0.04)` (dashboard cards, table containers)
- `--shadow-elevated`: `0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.04)` (popovers, dropdowns, toasts)
- `--shadow-modal`: `0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.05)` (dialogs, full modals)

---

## 4. Reusable UI Primitives (`src/components/ui/`)

### 1. `Button` (`src/components/ui/button.tsx`)
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `destructive`, `link`
- **Sizes**: `sm` (32px), `md` (40px), `lg` (48px), `icon` (40x40px)
- **Features**: Semantic `<button>`, accessible focus rings, loading state with spinner (`aria-busy`), icon slots.

### 2. `Input` (`src/components/ui/input.tsx`)
- **Features**: Label, helperText, error message with `role="alert"`, programmatic `aria-describedby` & `aria-invalid`, leading/trailing icons.

### 3. `Textarea` (`src/components/ui/textarea.tsx`)
- **Features**: Accessible label, helperText, error message, resize controls, optional character counter (`showCount` & `maxLength`).

### 4. `Select` (`src/components/ui/select.tsx`)
- **Features**: Accessible native select with custom chevron wrapper and focus rings.

### 5. `Badge` (`src/components/ui/badge.tsx`)
- **Variants**: `default`, `secondary`, `success`, `warning`, `destructive`, `info`
- **Features**: Compact sizing (`sm`, `md`), optional indicator dot (`hasDot`).

### 6. `Card` (`src/components/ui/card.tsx`)
- **Composable Parts**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Features**: Interactive hover elevation (`isInteractive`).

### 7. `Dialog` (`src/components/ui/dialog.tsx`)
- **Powered by**: `@radix-ui/react-dialog`
- **Composable Parts**: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`
- **Features**: Focus trap, Escape-key dismissal, backdrop blur, scroll handling.

### 8. `Toast` & `Toaster` (`src/components/ui/toast.tsx`)
- **Powered by**: `sonner`
- **Features**: Programmatic `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()`, accessible ARIA live regions.

### 9. `Skeleton` (`src/components/ui/skeleton.tsx`)
- **Variants**: `rounded`, `rectangular`, `circular`
- **Features**: Pulse placeholder, reduced-motion compliance.

### 10. `GlowCard` (`src/components/effects/glow-card.tsx`)
- **Purpose**: ReactBits-inspired micro-interaction providing subtle mouse-follow radial highlight. Automatically disabled under `prefers-reduced-motion`.

---

## 5. Component Showcase Route (`/design-system`)

The application includes an internal showcase route at **`/design-system`**:
- Demonstrates all component variants, sizes, and interaction states.
- Internal preview route: does not expose secrets. In production, this route can be gated with an environment flag (`if (process.env.NODE_ENV === 'production') notFound()`) or protected via middleware.
