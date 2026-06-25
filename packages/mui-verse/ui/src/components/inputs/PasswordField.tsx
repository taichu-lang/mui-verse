"use client";

import { IconButton } from "@mui/material";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { TextField, TextFieldProps } from "./TextField";

export const PasswordField = (props: TextFieldProps) => {
  const [show, setShow] = useState<boolean>(false);

  const handleSwitch = () => {
    setShow(!show);
  };

  return (
    <TextField
      {...props}
      type={show ? "text" : "password"}
      endIcon={
        <IconButton onClick={handleSwitch}>
          {show ? (
            <EyeClosed className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </IconButton>
      }
    />
  );
};
