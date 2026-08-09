import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { cn } from "../../utils/cn";

export function DatePicker({
  value,
  onChange,
  className,
}: {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}) {
  const [date, setDate] = useState<Dayjs | null>(
    value ? dayjs(value * 1000) : null,
  );

  const handleDateChange = (d: Dayjs | null) => {
    setDate(d);
    onChange?.(d?.unix() || 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        value={date}
        onChange={handleDateChange}
        className={cn("-mt-1", className)}
        slotProps={{
          openPickerIcon: { fontSize: "small" },
          textField: {
            size: "small",
            variant: "outlined",
            sx: {
              "& .MuiOutlinedInput-root": {
                fontSize: "14px",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
