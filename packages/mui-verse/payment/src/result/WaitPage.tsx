import { AnimatedSpinner } from "@mui-verse/ui/components/effects";

export function WaitPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-4 flex w-md flex-col items-center gap-10 sm:mx-0">
        <AnimatedSpinner />
        <p className="text-2xl">Please wait</p>
        <p className="text-base">
          If you&apos;ve made a payment, please stay on this page. Order
          confirmation may take 3–5 minutes.
        </p>
      </div>
    </div>
  );
}
