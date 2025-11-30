import type { Theme } from "@emotion/react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import type { SxProps } from "@mui/material/styles";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { useState } from "react";
import { merge } from "~/helper";

export default function ToggleTextField({
  tooltip,
  boxSx = {},
  onChecked,
  ...props
}: TextFieldProps & {
  onChecked?: (checked: boolean) => void;
  tooltip?: string;
  boxSx?: SxProps<Theme>;
}) {
  const [checked, setChecked] = useState(!!props.defaultValue);

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 1, ...boxSx }}
      title={tooltip}
    >
      <Checkbox
        checked={checked}
        disabled={props.disabled}
        onChange={(e, value) => {
          setChecked(value);
          if (onChecked) onChecked(value);
        }}
        sx={{
          m: 0,
          p: 2,
          "& .MuiSvgIcon-root": { width: 30, height: 30 },
        }}
      />
      <TextField
        {...merge(props, {
          disabled: props.disabled || !checked,
          slotProps: { htmlInput: { readOnly: !checked } },
          sx: (theme: any) => ({
            "& .MuiOutlinedInput-input": {
              color: !checked
                ? theme.palette.grey[400] + " !important"
                : undefined,
              WebkitTextFillColor: !checked
                ? theme.palette.grey[400] + " !important"
                : undefined,
            },
            [theme.getColorSchemeSelector("dark")]: {
              "& .MuiOutlinedInput-input": {
                color: !checked
                  ? theme.palette.grey[600] + " !important"
                  : undefined,
                WebkitTextFillColor: !checked
                  ? theme.palette.grey[600] + " !important"
                  : undefined,
              },
            },
          }),
        })}
      />
    </Box>
  );
}
