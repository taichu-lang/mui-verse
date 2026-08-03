import { cloneElement } from "react";

export type TriggerProps = {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

export function extendClickable(
  element: React.ReactElement<TriggerProps>,
  onClick: (e: React.MouseEvent<HTMLElement>) => void,
) {
  return cloneElement(element, {
    onClick: (e) => {
      element.props.onClick?.(e);
      if (e.defaultPrevented) {
        return;
      }

      onClick(e);
    },
  });
}

export type HoverProps = {
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
};

export function extendHover(
  element: React.ReactElement<HoverProps>,
  onEnter: (e: React.MouseEvent<HTMLElement>) => void,
  onLevel?: (e: React.MouseEvent<HTMLElement>) => void,
) {
  return cloneElement(element, {
    onMouseEnter: (e) => {
      element.props.onMouseEnter?.(e);
      if (e.defaultPrevented) {
        return;
      }

      onEnter(e);
    },
    onMouseLeave: (e) => {
      element.props.onMouseLeave?.(e);
      if (e.defaultPrevented) {
        return;
      }

      onLevel?.(e);
    },
  });
}
