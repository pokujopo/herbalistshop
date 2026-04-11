# Admin Dashboard UI Redesign

Premium SaaS-style redesign of the admin dashboard. All API logic, endpoints, and axios configuration are untouched.

---

## Files Changed / Added

### New
- `admin/components/ui.jsx` — Shared components: Toast, Badge, Spinner, SkeletonTable, EmptyState, Card, Button, Input, Select, Table, Modal, PageHeader, Label

### Replaced (UI only — API logic preserved)
- `admin/layout/AdminLayout.jsx`
- `admin/layout/AdminSidebar.jsx`
- `admin/layout/AdminTopbar.jsx`
- `admin/pages/AdminHome.jsx`
- `admin/pages/AdminProducts.jsx`
- `admin/pages/AdminOrders.jsx`
- `admin/pages/AdminUsers.jsx`
- `admin/pages/AdminCoupons.jsx`
- `admin/pages/AdminSettings.jsx`

### Unchanged
- `admin/services/adminApi.js`
- `admin/AdminRoute.jsx`
- `admin/pages/AdminCategories.jsx`
- `admin/pages/AdminNewsletters.jsx`
- `admin/pages/AdminCreateProduct.jsx`

---

## Required: tailwind.config.js update

Add the slide-in animation for toast notifications:

```js
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
```

---

## Features Added

### Layout
- Fixed dark sidebar (w-240px) with icons, active indicator, collapsible on mobile
- Sticky top navbar: greeting, date, avatar, notifications bell, logout
- Mobile hamburger + overlay dismiss

### Components (ui.jsx)
- **ToastProvider + toast** — success/error notifications, auto-dismiss at 3.5s
- **Badge** — 6 color variants (success, warning, danger, info, purple, gray)
- **Spinner** — animated circular loader (sm/md/lg)
- **SkeletonTable** — shimmer loading for tables
- **EmptyState** — icon + title + description
- **Card** — soft shadow + ring
- **Button** — primary/secondary/danger/ghost/outline variants + sizes
- **Input / Select** — focus rings, consistent sizing
- **Table / Thead / Th / Tbody / Tr / Td** — striped hover rows
- **Modal** — backdrop blur, centered, scrollable, focus-trapped body scroll
- **PageHeader** — title + subtitle + action slot
- **Label** — uppercase tracking form labels

### Pages
- **Dashboard** — KPI cards with icons + colors, bar chart for monthly sales, recent orders with badges, low stock alert panel, skeleton loading
- **Products** — image preview, search with icon, filter dropdown, status/flag badges, delete confirm modal, toast feedback
- **Orders** — status badges (color-coded), detail modal with address + summary + items, inline status editing, toast feedback
- **Users** — avatar circles with initials + color hash, role + status badges, manage modal with order history, toast feedback
- **Coupons** — grouped form (2-col grid), coupon cards with icon, delete confirm modal, toast feedback
- **Settings** — grouped section cards (Store Info / Social / Logo), drag-to-upload logo with preview, toast feedback

### UX
- All destructive actions use confirm modals (no window.confirm)
- All success/error feedback via toast (no alert())
- Skeleton loaders on all data tables
- Empty states on all lists
- Horizontal scroll on tables for mobile
- Smooth hover transitions throughout
