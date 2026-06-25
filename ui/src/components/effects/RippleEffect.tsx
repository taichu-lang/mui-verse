import { Box, BoxProps } from "@mui/material";
import React from "react";

interface RippleEffectProps extends BoxProps {
  children: React.ReactNode;
  rippleSize?: string;
  rippleDelay?: string;
  rippleDuration?: string;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  rippleSize = "40px",
  rippleDelay = "0.3s",
  rippleDuration = "1.2s",
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: "4px",
        cursor: "pointer",
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "0",
          height: "0",
          borderRadius: "50%",
          border: "2px solid",
          borderColor: "secondary.main",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          pointerEvents: "none",
        },
        "&:hover::before": {
          animation: `ripple ${rippleDuration} ease-out`,
        },
        "&:hover::after": {
          animation: `ripple ${rippleDuration} ease-out ${rippleDelay}`,
        },
        "@keyframes ripple": {
          "0%": {
            width: "0",
            height: "0",
            opacity: 0.8,
            borderWidth: "3px",
          },
          "50%": {
            opacity: 0.4,
            borderWidth: "2px",
          },
          "100%": {
            width: rippleSize,
            height: rippleSize,
            opacity: 0,
            borderWidth: "1px",
          },
        },
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
