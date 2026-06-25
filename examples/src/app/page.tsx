import { Button } from "@mui/material";
import Link from "next/link";
import LandingLayout from "./_components/LandingLayout";

export default function LandingPage() {
  return (
    <LandingLayout>
      <div className="flex justify-center">
        <Link href={"/workbench"}>
          <Button>Get Started</Button>
        </Link>
      </div>
    </LandingLayout>
  );
}
