import {
  MenuItem,
  MenuItemProps,
  Select as MuiSelect,
  SelectProps,
} from "@mui/material";
import { ChevronsUpDownIcon } from "lucide-react";

export function SelectMenuItem({ sx, ...props }: MenuItemProps) {
  return (
    <MenuItem
      sx={{
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "20px",
        letterSpacing: "0.0025em",
        borderRadius: "8px",
        py: 0.75,
        minHeight: "unset",
        display: "flex",
        alignItems: "center",
        gap: 1,
        ...sx,
      }}
      {...props}
    ></MenuItem>
  );
}

export function Select<T>({ sx, ...props }: SelectProps<T>) {
  return (
    <MuiSelect
      IconComponent={ChevronsUpDownIcon}
      sx={{
        ".MuiSelect-icon": {
          width: 16,
          height: 16,
        },
        ...sx,
      }}
      {...props}
    ></MuiSelect>
  );
}
