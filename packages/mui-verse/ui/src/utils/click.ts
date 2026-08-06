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
      onClick(e);
      if (e.defaultPrevented) {
        return;
      }

      element.props.onClick?.(e);
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
  onLevel: (e: React.MouseEvent<HTMLElement>) => void,
) {
  return cloneElement(element, {
    onMouseEnter: (e) => {
      onEnter(e);
      if (e.defaultPrevented) {
        return;
      }

      element.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e) => {
      onLevel(e);
      if (e.defaultPrevented) {
        return;
      }

      element.props.onMouseLeave?.(e);
    },
  });
}
