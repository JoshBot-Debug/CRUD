import InputAdornment from "@mui/material/InputAdornment";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import * as React from "react";
import {
  NumericFormat,
  type NumberFormatValues,
  type NumericFormatProps,
} from "react-number-format";

export default function MoneyField({
  name,
  value,
  onChange,
  ...props
}: Omit<NumericFormatProps<TextFieldProps>, "onChange"> & {
  onChange?: (value: NumberFormatValues) => void;
}) {
  const [rawValue, setRawValue] = React.useState(value ?? "");

  React.useEffect(() => {
    setRawValue(value as any);
  }, [value]);

  return (
    <>
      <NumericFormat
        customInput={TextField}
        thousandSeparator
        thousandsGroupStyle="lakh"
        fixedDecimalScale
        decimalScale={2}
        valueIsNumericString
        value={rawValue}
        onValueChange={(values) => {
          setRawValue(values.value);
          if (onChange) (onChange as any)(values);
        }}
        {...(props as any)}
        slotProps={{
          ...(props?.slotProps ?? {}),
          input: {
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            ...(props?.slotProps?.input ?? {}),
          },
        }}
      />
      <input type="hidden" name={name} value={rawValue} />
    </>
  );
}
