import { cn } from "@mui-verse/ui/utils/cn";
import {
  Pagination as MuiPagination,
  PaginationProps,
  SxProps,
  Theme,
} from "@mui/material";
import { useTableContext } from "./TableContext";

declare module "@mui/material/Pagination" {
  interface PaginationPropsColorOverrides {
    error: true;
  }
}

export const Pagination = (props: PaginationProps) => {
  const styles: SxProps<Theme> =
    props.color === "error"
      ? {
          "& .MuiPaginationItem-root.Mui-selected": {
            bgcolor: "error.400",
          },
          "& .MuiPaginationItem-root.Mui-selected:hover": {
            bgcolor: "error.main",
          },
          "& .MuiPaginationItem-root:hover": {
            bgcolor: "error.200",
          },
        }
      : {};

  return <MuiPagination {...props} sx={styles} />;
};

interface TablePaginationProps {
  color?: "standard" | "primary" | "secondary" | "error";
  shape?: "rounded" | "circular";
  placement?: "start" | "center" | "end";
  className?: string;
}

export function TablePagination({
  color = "standard",
  shape = "circular",
  placement = "end",
  className,
}: TablePaginationProps) {
  const { page, setPage, pages } = useTableContext();

  return (
    <div
      className={cn(
        "flex w-full",
        {
          "justify-start": placement === "start",
          "justify-center": placement === "center",
          "justify-end": placement === "end",
        },
        className,
      )}
    >
      <Pagination
        count={pages}
        color={color}
        page={page}
        onChange={(_, page) => setPage(page)}
        shape={shape}
        size="medium"
      />
    </div>
  );
}
