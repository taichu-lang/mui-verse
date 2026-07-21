// Section with the default background.
export function Section({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-landing-navbar flex justify-center">
      <div className="w-landing-width mt-12.5 mb-15 flex flex-col items-center">
        {children}
      </div>
    </section>
  );
}

export function WhiteSection({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-landing-navbar flex justify-center bg-white"
    >
      <div className="w-landing-width mt-12.5 mb-15 flex flex-col items-center">
        {children}
      </div>
    </section>
  );
}
