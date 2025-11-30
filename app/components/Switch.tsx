import FormControlLabel from "@mui/material/FormControlLabel";
import { type SxProps, type Theme } from "@mui/material/styles";
import MUISwitch, { type SwitchProps } from "@mui/material/Switch";
import { useCallback, useMemo, useState } from "react";

export default function Switch({
  name,
  label,
  labelSx = {},
  ...props
}: SwitchProps & {
  label?: string | ((checked: boolean) => string);
  name?: string;
  labelSx?: SxProps<Theme>;
}) {
  const [_checked, setChecked] = useState(!!props.defaultChecked);

  const checked = props.value ? !!props.value : _checked;

  const formLabel = useMemo(
    () => (typeof label === "function" ? label(checked) : label),
    [checked],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
      setChecked(checked),
    [],
  );

  return (
    <>
      <FormControlLabel
        label={formLabel}
        sx={{ mx: 0, gap: 1, ...labelSx }}
        control={
          <MUISwitch
            checked={checked}
            value={checked ? "true" : "false"}
            onChange={onChange}
            {...props}
          />
        }
      />
    </>
  );
}
