import { MenuItem } from "@mui-verse/ui/components/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface TabMenuContextValue {
  value: string;
  onClick: (value: string) => void;
  title: string | null;
  setTitle: (title: string) => void;
}

const TabMenuContextProvider = createContext<TabMenuContextValue | null>(null);

export function useTabMenuContext() {
  const ctx = useContext(TabMenuContextProvider);
  if (!ctx) {
    throw new Error(
      "TabMenu compound components must be used within <TabMenuContext>",
    );
  }

  return ctx;
}

export function TabMenuContext({
  defaultIndex,
  children,
}: {
  defaultIndex: string;
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<string>(defaultIndex);
  const [title, setTitle] = useState<string | null>(null);

  const handleClick = useCallback((value: string) => {
    setSelected(value);
  }, []);

  const handleTitleChange = useCallback((title: string) => {
    setTitle(title);
  }, []);

  return (
    <TabMenuContextProvider.Provider
      value={{
        value: selected,
        onClick: handleClick,
        title,
        setTitle: handleTitleChange,
      }}
    >
      {children}
    </TabMenuContextProvider.Provider>
  );
}

export interface TabMenuProps {
  title: string;
  value: string;
  icon?: React.ReactElement;
}

export function TabMenu({ title, icon, value: tabValue }: TabMenuProps) {
  const { value, onClick, setTitle } = useTabMenuContext();

  useEffect(() => {
    if (value === tabValue) {
      setTitle(title);
    }
  }, [value, tabValue, title, setTitle]);

  const handleClick = () => {
    onClick(tabValue);
    setTitle(title);
  };

  return (
    <MenuItem onClick={handleClick} selected={value === tabValue}>
      {icon}
      {title}
    </MenuItem>
  );
}

export function TabMenuPanel({
  value: tabValue,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { value } = useTabMenuContext();
  if (value === tabValue) {
    return children;
  }

  return null;
}
