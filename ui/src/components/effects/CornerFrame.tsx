export function CornerFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const corner = "absolute w-5 h-5 border-gray-300";
  return (
    <div className={`relative rounded-xl p-2 shadow-md ${className}`}>
      <span
        className={`${corner} top-0 left-0 rounded-tl-xl border-t border-l`}
      />
      <span
        className={`${corner} top-0 right-0 rounded-tr-xl border-t border-r`}
      />
      <span
        className={`${corner} bottom-0 left-0 rounded-bl-xl border-b border-l`}
      />
      <span
        className={`${corner} right-0 bottom-0 rounded-br-xl border-r border-b`}
      />
      {children}
    </div>
  );
}
