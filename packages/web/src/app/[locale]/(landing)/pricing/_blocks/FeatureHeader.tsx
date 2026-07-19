export function FeatureHeader() {
  return (
    <div className="mt-10 flex items-start">
      <div className="w-landing-feature-left flex flex-col gap-2.5">
        <p className="text-2xl">Plan</p>
        <span className="text-base">One year</span>
      </div>
      <div className="w-landing-feature-mid flex flex-col gap-2.5">
        <p className="text-2xl">Free</p>
        <span className="text-text-secondary text-base">$0</span>
      </div>
      <div className="w-landing-feature-right flex flex-col gap-2.5">
        <p className="text-2xl">Pro</p>
        <span className="text-text-secondary text-base">$5.9</span>
      </div>
    </div>
  );
}
