import {
  Pagination as MuiPagination,
  PaginationProps,
  SxProps,
  Theme,
} from "@mui/material";

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
