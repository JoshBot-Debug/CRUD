import * as React from "react";
import dayjs from "dayjs";
import { useForkRef } from "@mui/material/utils";
import Button from "@mui/material/Button";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type {
  DatePickerFieldProps,
  DatePickerProps,
} from "@mui/x-date-pickers/DatePicker";
import {
  useParsedFormat,
  usePickerContext,
  useSplitFieldProps,
} from "@mui/x-date-pickers";

type Dayjs = ReturnType<typeof dayjs>;

interface ButtonFieldProps extends DatePickerFieldProps {}

function ButtonField(props: ButtonFieldProps) {
  const { forwardedProps } = useSplitFieldProps(props, "date");
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  const { slotProps, inputRef, ...buttonProps } = forwardedProps as any;

  const hideIcon =
    "openPickerIcon" in ((forwardedProps as any)?.slotProps ?? {}) &&
    (forwardedProps as any)?.slotProps?.openPickerIcon === undefined;

  return (
    <Button
      {...buttonProps}
      variant="outlined"
      ref={handleRef}
      size="small"
      startIcon={
        hideIcon ? undefined : <CalendarTodayRoundedIcon fontSize="small" />
      }
      sx={{
        minWidth: "fit-content",
        ...((forwardedProps as any)?.slotProps?.openPickerButton?.sx ?? {}),
      }}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ?? valueStr}
    </Button>
  );
}

export default function CustomDatePicker(
  props: DatePickerProps & { name?: string },
) {
  const [_value, setValue] = React.useState<Dayjs | null>(dayjs());

  const value = props.value ?? _value;

  const fieldName = props.name ?? "date";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <DatePicker
          value={value}
          onChange={(newValue) => setValue(newValue)}
          slots={{ field: ButtonField }}
          views={["day", "month", "year"]}
          {...props}
          label={value == null ? props.label : value.format("MMM DD, YYYY")}
          slotProps={{
            nextIconButton: { size: "small" },
            previousIconButton: { size: "small" },
            ...(props.slotProps ?? {}),
          }}
        />
        <input
          type="hidden"
          name={fieldName}
          value={value ? value.format("YYYY-MM-DD") : ""}
        />
      </React.Fragment>
    </LocalizationProvider>
  );
}
