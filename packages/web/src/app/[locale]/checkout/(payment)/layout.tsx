import { ChevronLeftIcon } from "@/components/icons";

export default function CheckoutLayout({
  plan,
  children,
}: {
  plan: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full">
      <div className="mx-auto mt-15 flex w-219.5 flex-col">
        <div className="flex items-center gap-5">
          <ChevronLeftIcon />
          <span className="text-2xl">Configure your plan</span>
        </div>
        <div className="mt-10 flex w-full gap-10">
          <div className="flex-1">{children}</div>
          <div className="w-84.25">{plan}</div>
        </div>
      </div>
    </div>
  );
}
