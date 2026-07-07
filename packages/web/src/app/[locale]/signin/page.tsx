import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  InputBase,
} from "@mui/material";

export default function SigninPage() {
  return (
    <Card className="h-signin-height w-signin-width rounded-3xl bg-white">
      <CardContent className="mx-8 mt-7.5 mb-8 flex flex-col">
        <span className="mx-auto flex text-2xl font-semibold">Anna</span>
        <span className="mt-9 text-start text-base">
          Sign in or signup with email
        </span>
        <InputBase
          placeholder="Email address"
          className="ring-divider mt-2.5 rounded-[10px] px-4 py-3.25 text-sm ring-1 ring-inset"
          endAdornment={<InputAdornment position="end">$</InputAdornment>}
        />
        <Button className="mt-4 py-2.5 text-base shadow-none">Next</Button>
      </CardContent>
    </Card>
  );
}
