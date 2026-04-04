import { Typography } from "@mui/material";

export default function Home() {
  return (
    <div className="flex justify-center">
      <main className="flex w-full max-w-5xl flex-1 flex-col items-center justify-between px-16 py-32 sm:items-start">
        <Typography variant="h1" component={"h1"}>
          An example of mui-verse
        </Typography>
      </main>
    </div>
  );
}
