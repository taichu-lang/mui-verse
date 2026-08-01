import {
  FormControlLabel as MuiFormControlLabel,
  type FormControlLabelProps,
} from "@mui/material";

export function FormControlLabel({
  label,
  className,
  ...props
}: FormControlLabelProps) {
  return (
    <MuiFormControlLabel
      {...props}
      label={<div className={className}>{label}</div>}
    />
  );
}
