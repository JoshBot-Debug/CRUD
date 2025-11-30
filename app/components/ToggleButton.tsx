import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MuiToggleButton from "@mui/material/ToggleButton";
import { useState } from "react";

interface Props<T> {
  name?: string;
  disabled?: boolean;
  defaultValue?: T;
  onChange?: (value: T) => void;
  options: Array<{
    label: string;
    value: T;
  }>;
}

export default function ToggleButton<T>(props: Props<T>) {
  const [value, setValue] = useState<T | null>(props.defaultValue ?? null);

  return (
    <>
      <ToggleButtonGroup
        exclusive
        color="primary"
        value={value}
        disabled={props.disabled}
        onChange={(e, value) => {
          setValue(value);
          if (props.onChange) props.onChange(value);
        }}
      >
        {props.options.map(({ label, value }) => (
          <MuiToggleButton value={value as any}>{label}</MuiToggleButton>
        ))}
      </ToggleButtonGroup>
      <input type="hidden" value={value as any} name={props.name} />
    </>
  );
}
