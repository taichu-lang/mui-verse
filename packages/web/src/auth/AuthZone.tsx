export function AuthZone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        className="z-navbar absolute inset-0 cursor-progress bg-transparent"
        role="button"
        tabIndex={0}
      />
      {children}
    </div>
  );
}
