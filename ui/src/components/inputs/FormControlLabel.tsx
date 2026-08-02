import {
  CSSProperties,
  FormControlLabel as MuiFormControlLabel,
  type FormControlLabelProps as MuiFormControlLabelProps,
} from "@mui/material";

type Placement = "start" | "end" | "bottom-start" | "bottom-end";

interface FormControlLabelProps extends Omit<
  MuiFormControlLabelProps,
  "labelPlacement"
> {
  labelPlacement?: Placement;
}

export function FormControlLabel({
  label,
  className,
  labelPlacement = "start",
  sx,
  ...props
}: FormControlLabelProps) {
  const presets: Record<Placement, CSSProperties> = {
    start: {
      display: "inline-flex",
      flexDirection: "row-reverse",
      alignItems: "center",
    },
    end: {
      display: "inline-flex",
      flexDirection: "row",
      alignItems: "center",
    },
    "bottom-start": {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      gap: "2px",
    },
    "bottom-end": {
      display: "flex",
      flexDirection: "column",
      alignItems: "end",
      gap: "2px",
    },
  };

  const preset = presets[labelPlacement];

  return (
    <MuiFormControlLabel
      {...props}
      label={<div className={className}>{label}</div>}
      sx={{
        p: 0,
        m: 0,
        ...preset,
        ...sx,
      }}
    />
  );
}
