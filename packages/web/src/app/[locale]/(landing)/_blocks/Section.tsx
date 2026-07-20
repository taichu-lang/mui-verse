// Section with the default background.
export function Section({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="w-landing-width anchor-offset mx-auto mt-12.5 mb-15 flex w-full flex-col items-center"
    >
      {children}
    </section>
  );
}

export function WhiteSection({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="anchor-offset flex justify-center bg-white">
      <div className="w-landing-width mt-12.5 mb-15 flex flex-col items-center">
        {children}
      </div>
    </section>
  );
}
