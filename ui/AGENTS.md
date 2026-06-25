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
