import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { NumericFormat } from "react-number-format";

export default function DecimalField(
  props: TextFieldProps & { decimalScale?: number },
) {
  return (
    <NumericFormat
      customInput={TextField}
      fixedDecimalScale
      decimalScale={props.decimalScale ?? 2}
      valueIsNumericString
      {...(props as any)}
    />
  );
}
