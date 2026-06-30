import { CircleIcon } from "lucide-react";

export function StreamingIcon() {
  return (
    <CircleIcon
      className="h-3 w-3 fill-gray-950"
      style={{ animation: "breathe 2s ease-in-out infinite" }}
    />
  );
}
