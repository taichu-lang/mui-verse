import { createContext, useCallback, useContext, useState } from "react";
import { DesktopMenu } from "./Menu";

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

  const handleClick = () => {
    onClick(tabValue);
    setTitle(title);
  };

  return (
    <DesktopMenu
      title={title}
      icon={icon}
      controlled={{
        active: value === tabValue,
        onClick: handleClick,
      }}
    />
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
