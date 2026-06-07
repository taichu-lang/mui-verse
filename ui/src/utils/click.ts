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
