import * as React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import Autocomplete, {
  createFilterOptions,
  type AutocompleteOwnerState,
  type AutocompleteRenderInputParams,
  type AutocompleteRenderOptionState,
} from "@mui/material/Autocomplete";
import { debounce } from "@mui/material/utils";
import { API } from "~/.client/helper";
import type { SxProps, Theme } from "@mui/material/styles";
import type { AutocompleteProps } from "node_modules/@mui/x-data-grid/esm/models/gridBaseSlots";
import { merge } from "~/helper";
import useFetchAPI from "~/hooks/useFetchAPI";
import type { FilterOptionsState } from "@mui/material";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const lazy = debounce(async (callback: () => Promise<any>) => callback(), 400);

type SlotProps = AutocompleteProps<any, any, any, any>["slotProps"];
type SlotPropsTextField = TextFieldProps<any>["slotProps"];

export type Option = { label: string; value: any; data?: any };

type Value<M extends boolean> = M extends true ? Option[] : Option | null;

interface Props<M extends boolean> {
  name?: string;
  label?: string | React.ReactNode;
  disabled?: boolean;
  disableFetch?: boolean;
  enableCache?: boolean;
  enableClientFilter?: boolean;
  disableFetchOnMount?: boolean;
  filterMatch?: "any" | "start";
  path: `/${string}`;
  parseResult: (result: any) => Option[];
  required?: boolean;
  limit?: number;
  sx?: SxProps<Theme>;
  searchKey?: string;

  multiple?: M;
  value?: Value<M>;
  defaultValue?: M extends true
  ? Value<M> | ((result: any) => Value<M>)
  : Value<M> | string | number | ((result: any) => Value<M>);
  onChange?: (value: Value<M>) => void;
  renderOption?: (
    props: any,
    option: Option,
    state: AutocompleteRenderOptionState,
    ownerState: AutocompleteOwnerState<Value<M>, M, boolean, boolean, "div">,
  ) => React.ReactNode;
  slotProps?: SlotProps;
  textFieldSlotProps?: SlotPropsTextField;
}

function getSafeValue<M extends boolean>(value: Value<M>) {
  if (isOption(value) && typeof value.value !== "undefined")
    return value as Value<M>;
  if (Array.isArray(value)) return value as Value<M>;
  return null as Value<M>;
}

export default function LazySelect<M extends boolean = false>(props: Props<M>) {
  const [_value, setValue] = React.useState<Value<M>>(() => {
    const dv = props.defaultValue;
    if (!props.defaultValue) return (props.multiple ? [] : null) as Value<M>;

    if (props.multiple) {
      if (
        Array.isArray(props.defaultValue) &&
        props.defaultValue.every(isOption)
      )
        return props.defaultValue as Value<M>;
      return [] as unknown as Value<M>;
    }

    if (isOption(dv)) return dv as Value<M>;

    return null as Value<M>;
  });
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<Option[]>(
    isOption(props.defaultValue)
      ? [props.defaultValue]
      : Array.isArray(props.defaultValue) && props.defaultValue.every(isOption)
        ? props.defaultValue
        : [],
  );

  const value = getSafeValue(props.value ?? _value);

  const [loading, setLoading] = React.useState(false);

  const fetch = useFetchAPI();

  async function getData(search?: string): Promise<Option[]> {
    if (props.disableFetch) return [];
    setLoading(true);
    try {
      const url = new URL(API + props.path);
      if (search) url.searchParams.set(props.searchKey ?? "search", search);
      const result = await fetch<any>(url, { headers: { "content-type": "application/json" }, enableCache: props.enableCache });
      setOptions(props.parseResult(result));
      return result;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    return [];
  }

  React.useEffect(() => {
    if (props.disableFetchOnMount || props.disableFetch) return;
    getData();
  }, []);

  React.useEffect(() => {
    if (!props.defaultValue || isOption(props.defaultValue)) return;
    getData().then((result) => {
      if (!result) return;
      const results = props.parseResult(result);
      const value =
        typeof props.defaultValue === "function"
          ? (props.defaultValue(result) as Value<M>)
          : ((results.find((r) => r.value == props.defaultValue) ??
            null) as Value<M>);
      if (value && !props.value) setValue(value);
    });
  }, [props.defaultValue, props.disableFetch, !!props.value]);

  const onChange = React.useCallback(
    (_: any, next: Value<M>) => {
      if (!props.value) setValue(next);
      if (props.onChange) props.onChange(next);
    },
    [setValue, props.onChange, !!props.value],
  );

  const onFocus = React.useCallback(
    () => getData(inputValue),
    [inputValue, props.path, props.disableFetch],
  );

  const onInputChange = React.useCallback(
    (_: React.SyntheticEvent<Element, Event>, value: string) => {
      setInputValue(value)
      lazy(async () => getData(value));
    },
    [],
  );

  const getOptionLabel = React.useCallback(
    (option: Option | string) =>
      typeof option === "string" ? option : option.label,
    [],
  );

  const getOptionKey = React.useCallback(
    (option: Option | string) =>
      typeof option === "string" ? option : option.value,
    [],
  );

  const isOptionEqualToValue = React.useCallback(
    (option: Option, value: Option) => option.value == value.value,
    [],
  );

  const filterOptions = React.useCallback((options: Option[], state: FilterOptionsState<Option>) => props.enableClientFilter ? createFilterOptions<Option>({ matchFrom: props.filterMatch || "start", limit: props.limit || 50 })(options, state) : options, [props.enableClientFilter]);

  const renderInput = React.useCallback(
    (params: AutocompleteRenderInputParams) => {
      const inputValue = Array.isArray(value)
        ? value.map((v) => v.label).join(",")
        : value?.label;
      return (
        <TextField
          {...params}
          label={props.label}
          fullWidth
          size="small"
          required={props.required && !inputValue}
          slotProps={props.textFieldSlotProps}
          autoComplete="off"
        />
      );
    },
    [value],
  );

  const renderOption = React.useCallback((props: any, option: Option, { inputValue }: AutocompleteRenderOptionState) => {
    if (props?.renderOption) return props?.renderOption;
    const { key, ...optionProps } = props;
    const matches = match(option.label, inputValue, { insideWords: true });
    const parts = parse(option.label, matches);
    return (
      <li key={key} {...optionProps}>
        <div>
          {parts.map((part, index) => (
            <span
              key={index}
              style={{
                fontWeight: part.highlight ? 800 : 400,
              }}
            >
              {part.text}
            </span>
          ))}
        </div>
      </li>
    );
  }, [props?.renderOption])

  const hiddenValue = Array.isArray(value)
    ? JSON.stringify(value.map((v) => v.value))
    : value?.value;

  return (
    <>
      <Autocomplete
        key={props.path}
        disabled={props.disabled}
        getOptionLabel={getOptionLabel}
        getOptionKey={getOptionKey}
        filterOptions={filterOptions}
        isOptionEqualToValue={isOptionEqualToValue}
        onInputChange={onInputChange}
        options={options}
        loading={loading}
        autoComplete
        includeInputInList
        autoHighlight
        value={value}
        noOptionsText="No options..."
        fullWidth
        onFocus={onFocus}
        onChange={onChange as any}
        renderInput={renderInput}
        renderOption={renderOption}
        slotProps={merge(slotProps, props.slotProps)}
        sx={props.sx}
        multiple={props.multiple}
      />
      {props.name && (
        <input name={props.name} value={hiddenValue} type="hidden" />
      )}
    </>
  );
}

function isOption(obj: any): obj is Option {
  return (
    obj != null && typeof obj === "object" && "label" in obj && "value" in obj
  );
}

const slotProps: any = {
  popupIndicator: {
    size: "small",
    sx: {
      border: "none",
      height: 30,
      width: 30,
    },
  },
  clearIndicator: {
    size: "small",
    sx: {
      border: "none",
      mr: "2px",
      height: 30,
      width: 30,
    },
  },
  chip: {
    size: "small",
    sx: { my: 0 },
  },
};
