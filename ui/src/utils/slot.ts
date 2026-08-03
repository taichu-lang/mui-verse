export function Slot({
  asChild = false,
  wrap,
  children,
}: {
  asChild?: boolean;
  wrap: (child: React.ReactElement) => React.ReactElement;
  children: React.ReactElement;
}) {
  return asChild ? children : wrap(children);
}
