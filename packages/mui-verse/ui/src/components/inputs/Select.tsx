"use client";

import {
  Align,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  MenuItem,
  Side,
} from "@mui-verse/ui/components/navigation";
import { Select as MuiSelect, SelectProps } from "@mui/material";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useState,
} from "react";

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

interface DropdownSelectValue {
  value: string | null;
  label: React.ReactNode;
  setValue: (value: string, label: React.ReactNode) => void;
}

const DropdownSelectContext = createContext<DropdownSelectValue | null>(null);

function useDropdownSelectContext() {
  const ctx = useContext(DropdownSelectContext);
  if (!ctx) {
    throw new Error(
      "DropdownSelect compound components must be used within <DropdownSelect>",
    );
  }

  return ctx;
}

export interface DropdownSelectProps {
  defaultValue?: string;
  align?: Align;
  side?: Side;
  IconComponent?: React.ComponentType;
  className?: string;
  children: React.ReactNode;
  onChange?: (value: string) => void;
}

export function DropdownSelect({
  defaultValue,
  align = "center",
  side = "bottom",
  IconComponent,
  className,
  children,
  onChange,
}: DropdownSelectProps) {
  const [value, setValueState] = useState<string | null>(defaultValue ?? null);
  const [label, setLabelState] = useState<React.ReactNode>(() => {
    let found: React.ReactNode = null;
    Children.forEach(children, (child) => {
      if (
        isValidElement<{ value: string; children: React.ReactNode }>(child) &&
        child.props.value === defaultValue
      ) {
        found = child.props.children;
      }
    });
    return found;
  });

  const setValue = useCallback(
    (value: string, label: React.ReactNode) => {
      setValueState(value);
      setLabelState(label);
      onChange?.(value);
    },
    [onChange],
  );

  return (
    <DropdownSelectContext.Provider value={{ value, label, setValue }}>
      <DropdownMenu side={side} align={align}>
        <DropdownMenuTrigger>
          <MenuItem
            role="combobox"
            aria-expanded="false"
            aria-haspopup="listbox"
            className={className}
          >
            {label}
            {IconComponent ? (
              <IconComponent />
            ) : (
              <ChevronsUpDownIcon className="h-4 w-4" />
            )}
          </MenuItem>
        </DropdownMenuTrigger>
        <DropdownMenuContent role="listbox">{children}</DropdownMenuContent>
      </DropdownMenu>
    </DropdownSelectContext.Provider>
  );
}

export function DropdownSelectOption({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { value: contextValue, setValue } = useDropdownSelectContext();
  const selected = value === contextValue;

  const handleSelected = () => {
    setValue(value, children);
  };

  return (
    <DropdownMenuItem
      value={value}
      role="option"
      onClick={handleSelected}
      selected={selected}
      className={className}
    >
      {children}
      <div className="flex-1" />
      {selected && <CheckIcon className="h-4 w-4" />}
    </DropdownMenuItem>
  );
}
