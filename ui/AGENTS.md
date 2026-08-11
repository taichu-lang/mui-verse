<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Component ref conventions

This project uses React 19 + React Compiler. `React.forwardRef` is deprecated — accept `ref` as a regular prop instead:

```tsx
export function MyComponent({
  ref,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return <div ref={ref} className={className} {...rest} />;
}
```

Do NOT wrap components in `React.forwardRef` — the result is a `ForwardRefExoticComponent` object (not a function), which breaks patterns like `const Comp = condition ? MyComponent : OtherComponent` with "Component is not a function" errors, and conflicts with React Compiler.

## When a component MUST accept `ref` + spread `...rest`

Any leaf component that renders a DOM element should accept `ref` and spread remaining props by default. Required when the component may be used as:

- A child of MUI's `Tooltip`, `Popover`, `Popper`, `Menu`, `Modal` (needs `ref` for anchorEl + receives injected `onMouseEnter` / `onMouseLeave` / `onFocus` / `onBlur` via cloneElement)
- A trigger for Radix / Headless UI / `react-aria` / Floating UI
- A drag handle for `dnd-kit` / `react-dnd`
- A form field registered with `react-hook-form` (`register()` needs the underlying DOM ref)
- Anything else that uses `cloneElement` to inject handlers or needs DOM measurement

If a custom component doesn't spread `...rest`, injected event handlers are silently dropped — the parent library appears broken with no error. This is the most common cause of "Tooltip / Popover not showing up" in this codebase.

Pure layout/container components that won't be wrapped by such libraries can skip `ref` until needed.

# Design System

## Use `box-shadow` instead of `border` for 1px hairlines

`border` is part of the box model — it sits between `padding` and `margin`, so a 1px border shifts the inner content in by 1px. Figma specs measure padding from the **outer** edge of the border, but CSS `padding` is measured from the **inner** edge. Every time you use `border`, you either have to subtract 1px from every padding value or accept a 1px visual drift.

Prefer an inset `box-shadow` (via Tailwind's `ring-inset`), which is painted, not laid out — padding values map 1:1 with the design spec.

```tsx
// Avoid — padding must compensate for the border
<div className="border-divider border rounded-3xl px-6" />

// Prefer — padding matches the Figma spec exactly
<div className="ring-divider ring-1 ring-inset rounded-3xl px-6" />
```

### Combining with other shadows

Tailwind's `ring` is implemented as `box-shadow`, and raw `box-shadow` in a custom utility will overwrite it. When a component needs both a hairline and a drop shadow, merge them into a single multi-value `box-shadow` in the utility — first the inset hairline, then the outer shadow:

```css
@utility chat-sender {
  box-shadow:
    inset 0 0 0 1px var(--mui-palette-divider),
    0 0 80px 26px hsla(0, 0%, 89%, 0.25);
}
```

Then drop `ring-*` and `border` from the component — the utility alone provides both.

### Using in sx props

```
sx: {
  boxShadow: "inset 0 0 0 1px var(--color-divider)";
}
```

## No border on `Card`, only shadow.
