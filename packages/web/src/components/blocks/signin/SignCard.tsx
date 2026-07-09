import { Card, CardContent } from "@mui/material";

export function SignCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-sign-width card-shadow rounded-3xl bg-white">
      <CardContent className="mx-8 mt-7.5 mb-8 flex flex-col">
        <span className="mx-auto flex text-2xl font-semibold">Anna</span>
        {children}
      </CardContent>
    </Card>
  );
}
