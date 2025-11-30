import * as React from "react";
import type { Address } from "~/types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import AddCircleRounded from "@mui/icons-material/AddCircleRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import OptionsMenu from "./OptionsMenu";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import useDialog from "~/hooks/useDialog";
import LazySelect from "./LazySelect";
import Grid from "@mui/material/Grid";
import {
  EmailTextInputProps,
  GSTTextInputProps,
  MobileTextInputProps,
  PincodeTextInputProps,
} from "~/validation";
import { Form } from "react-router";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { merge } from "~/helper";

const CARD_SIZE_W = 200;
const CARD_SIZE_H = 100;

const INITIAL_ADDRESS_STATE: Partial<Address> = {
  address1: "",
  address2: "",
  city: "",
  stateId: "",
  districtId: "",
  countryId: "",
  email: "",
  mobile: "",
  pinCode: "",
  gstVatNo: "",
  isBilling: "" as any,
  isPrimary: "" as any,
};

interface Props {
  onChange?: (addresses: Address[]) => void;
  gstApplicable: boolean;
  defaultValue?: Address[];
  name?: string;
  required?: boolean;
}

export default function MultiAddressForm({
  onChange,
  defaultValue = [],
  gstApplicable,
  name,
  required,
}: Props) {
  const [overlay, setOverlay] = React.useState(false);
  const [editAddress, setEditAddress] = React.useState<Address | null>(null);

  const [addresses, setAddresses] = React.useState<Address[]>(
    defaultValue.map((a) => ({ ...a, rowStatus: 2 })),
  );

  const dialog = useDialog();

  function onAddressSaved(address: Address) {
    if (editAddress) onAddressEdited(address);
    else onAddressCreated(address);

    setOverlay(false);
    setEditAddress(null);
  }

  function onAddressCreated(address: Address) {
    const next = [...addresses, address];
    const existingAddresses = next.filter((n) => n.rowStatus !== 3);
    const i = next.length - 1;
    if (existingAddresses.length === 1) {
      dialog.show({
        title: "Shipping address",
        message: "Copy billing to shipping address?",
        onConfirm: (close) => {
          setAddresses((prev) => {
            const next = [...prev];
            next.push({
              ...(next[next.length - 1] ?? {}),
              id: generateTemporaryID(next[next.length - 1]) as any,
              isBilling: false,
              isPrimary: true,
            });
            if (onChange) onChange(next.map(removeTemporaryIDs));
            return next;
          });
          close();
        },
      });

      next[i].isBilling = true;
      next[i].isPrimary = true;
    }
    if (existingAddresses.length > 1) {
      next[i].isBilling = false;
      next[i].isPrimary = existingAddresses.length === 2;
    }
    if (!existingAddresses.find((a) => a.isBilling)) {
      next[i].isBilling = true;
      next[i].isPrimary = true;
    }
    setAddresses(next);
    if (onChange) onChange(next.map(removeTemporaryIDs));
  }

  function onAddressEdited(address: Address) {
    if (!editAddress) return;
    const next = [...addresses];
    const i = next.findIndex((n) => n.id === editAddress.id);
    next[i] = address;
    setAddresses(next);
    if (onChange) onChange(next.map(removeTemporaryIDs));
  }

  function onEditAddress(id: number) {
    const edit = addresses.find((a) => a.id === id);
    if (!edit) return;
    setEditAddress(edit);
    setOverlay(true);
  }

  function onRemoveAddress(id: number) {
    const next = [...addresses];
    const i = next.findIndex((n) => n.id === id);
    next[i].rowStatus = 3;
    // Auto select the primary shipping address
    if (!next.find((n) => n.rowStatus !== 3 && !n.isBilling && n.isPrimary)) {
      const i = next.findIndex(
        (a) => a.rowStatus !== 3 && !a.isBilling && !a.isPrimary,
      );
      if (i > -1) next[i].isPrimary = true;
    }
    setAddresses(next);
    if (onChange) onChange(next.map(removeTemporaryIDs));
  }

  function handleCloseOverlay() {
    setOverlay(false);
  }

  const serializedAddresses =
    addresses.length === 0
      ? ""
      : JSON.stringify(
          addresses.reduce((a, c) => {
            if (!c) return a;
            const next = { ...c };
            // @ts-ignore
            if (next.id?.toString().startsWith("#temp")) delete next.id;
            return [...a, next];
          }, [] as Address[]),
        );

  return (
    <Card>
      {!!name && (
        <input
          name={name}
          style={{
            zIndex: -99,
            position: "absolute",
            pointerEvents: "none",
            userSelect: "none",
          }}
          type="text"
          value={serializedAddresses}
          required={required}
          onChange={() => {}}
        />
      )}

      <CardHeader title="Addresses" />

      <CardContent
        sx={{ display: "flex", gap: 2, flexWrap: "wrap", boxShadow: "none" }}
      >
        <Button
          variant="text"
          onClick={() => {
            setEditAddress(null);
            setOverlay((p) => !p);
          }}
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 2,
            height: CARD_SIZE_H,
            width: CARD_SIZE_H,
          }}
        >
          <AddCircleRounded />
        </Button>

        {addresses
          .filter((a) => a.rowStatus !== 3)
          .sort((a, b) =>
            b.isBilling && b.isPrimary ? 1 : b.isBilling ? 1 : -1,
          )
          .map((address) => (
            <AddressDisplayCard
              key={address.id}
              address={address}
              action={[
                {
                  Icon: DeleteIcon,
                  onClick: () => {
                    dialog.show({
                      title: "Delete Address",
                      message: "Are you sure you want to delete this address?",
                      onConfirm: (close) => {
                        onRemoveAddress(address.id);
                        close();
                      },
                    });
                  },
                  hidden: address.isBilling,
                },
                { Icon: EditIcon, onClick: () => onEditAddress(address.id) },
              ]}
            />
          ))}
      </CardContent>

      <Dialog
        scroll="body"
        open={overlay}
        onClose={handleCloseOverlay}
        fullWidth
        maxWidth="lg"
      >
        <AddressForm
          key={editAddress?.id ?? "none"}
          copy={addresses}
          defaultValue={editAddress}
          gstApplicable={gstApplicable}
          onAddressSaved={onAddressSaved}
          handleCloseOverlay={handleCloseOverlay}
        />
      </Dialog>
    </Card>
  );
}

type Action = {
  onClick: (address: Address) => void;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  hidden?: boolean;
};

export function AddressDisplayCard({
  address,
  action,
  responsive,
  noShadow,
}: {
  address: Address;
  action?: Action[] | React.ReactNode;
  responsive?: boolean;
  noShadow?: boolean;
}) {
  return (
    <Card
      sx={{
        height: responsive ? "100%" : CARD_SIZE_H,
        width: responsive ? "100%" : CARD_SIZE_W,
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <CardHeader
        title={address.isBilling ? "Billing Address" : "Shipping Address"}
        action={
          Array.isArray(action)
            ? action
                ?.filter((a) => !a.hidden)
                .map(({ Icon, onClick }, i) => (
                  <IconButton
                    key={i}
                    onClick={() => onClick(address)}
                    component={Icon}
                    sx={{ border: "none", p: 0, width: 20, height: 20 }}
                  />
                ))
            : action
        }
        sx={{ pb: 0 }}
        slotProps={{
          title: {
            sx: { fontSize: "14px !important" },
          },
        }}
      />

      <CardContent sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          title={address.address1}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: 12,
          }}
        >
          {address.address1}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 12 }}>
          {(address.state || "") +
            (address.state && address.pinCode
              ? `, ${address.pinCode}`
              : (address.pinCode ?? ""))}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 12 }}>
          {address.mobile}
        </Typography>
      </CardContent>
    </Card>
  );
}

function AddressForm({
  copy,
  defaultValue = null,
  gstApplicable,
  onAddressSaved,
  handleCloseOverlay,
}: {
  copy?: Address[];
  defaultValue?: Address | null;
  gstApplicable: boolean;
  onAddressSaved: (address: Address) => void;
  handleCloseOverlay: () => void;
}) {
  const [state, setState] = React.useState<Partial<Address>>(
    defaultValue ?? INITIAL_ADDRESS_STATE,
  );

  const copyableAddresses = React.useMemo(
    () =>
      copy
        ?.filter((a) => a.id !== state.id && a.rowStatus !== 3 && a.isBilling)
        .map((address) => ({
          label: (
            <>
              <b>Billing address:&nbsp;</b>
              {getAddressDisplayName(address)}
            </>
          ),
          onClick: () =>
            setState({
              ...address,
              isBilling: "" as any,
              isPrimary: "" as any,
              id: generateTemporaryID() as any,
            }),
        })) ?? [],
    [state.id],
  );

  function onCancel() {
    setState(defaultValue ?? INITIAL_ADDRESS_STATE);
    handleCloseOverlay();
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const id = generateTemporaryID(data);
    onAddressSaved({
      ...merge((state ?? {}) as any, data),
      id,
      rowStatus: typeof id === "string" ? 1 : 2,
    } as Address);
  }

  return (
    <Form onSubmit={onSubmit}>
      {defaultValue?.id && (
        <input type="hidden" value={defaultValue.id} name="id" />
      )}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <IconButton
                component={ArrowBackRounded}
                onClick={onCancel}
                size="small"
                sx={{ border: "none" }}
              />
              <Typography variant="h6">
                New{" "}
                {typeof state.isBilling !== "boolean"
                  ? ""
                  : state.isBilling
                    ? "Billing"
                    : "Shipping"}{" "}
                Address
              </Typography>
            </Box>
          }
          action={
            !!copyableAddresses.length && (
              <OptionsMenu label="Copy address" menuItems={copyableAddresses} />
            )
          }
        />

        <CardContent>
          <Grid container spacing={2} sx={{ flex: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="address1"
                label="Address 1"
                multiline
                fullWidth
                minRows={2}
                defaultValue={state?.address1}
                sx={{ flex: 1 }}
                slotProps={{
                  htmlInput: { maxLength: 200 },
                  inputLabel: { shrink: !!state?.address1 },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="address2"
                label="Address 2"
                multiline
                fullWidth
                minRows={2}
                defaultValue={state?.address2}
                sx={{ flex: 1 }}
                slotProps={{
                  htmlInput: { maxLength: 200 },
                  inputLabel: { shrink: !!state?.address1 },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LazySelect
                name="countryId"
                label="Country"
                path="/api/company-accounts/metadata"
                defaultValue={
                  state?.countryId ||
                  ((result) => {
                    const india = result.countriesMaster.find(
                      (o: any) => o.name.toLowerCase() === "india",
                    );
                    if (!india) return null;
                    const option = { label: india.name, value: india.id };
                    setState((prev) => ({
                      ...prev,
                      country: option.label,
                      countryId: option.value,
                    }));
                    return option;
                  })
                }
                parseResult={(result) =>
                  result.countriesMaster.map((r: any) => ({
                    label: r.name,
                    value: r.id,
                  }))
                }
                onChange={(option) =>
                  option &&
                  setState((prev) => ({
                    ...prev,
                    country: option.label,
                    countryId: option.value,
                  }))
                }
                sx={{ flex: 1 }}
                required
                enableFetchOnMount
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LazySelect
                name="stateId"
                label="State"
                path={`/api/states/by-country/${state?.countryId}`}
                disableFetch={!state?.countryId}
                defaultValue={state?.stateId}
                parseResult={(result) =>
                  result.map((r: any) => ({ label: r.name, value: r.id }))
                }
                onChange={(option) =>
                  option &&
                  setState((prev) => ({
                    ...prev,
                    state: option.label,
                    stateId: option.value,
                  }))
                }
                sx={{ flex: 1 }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LazySelect
                name="districtId"
                label="District"
                path={`/api/districts/by-state/${state?.stateId}`}
                disableFetch={!state?.stateId}
                defaultValue={state?.districtId}
                parseResult={(result) =>
                  result.map((r: any) => ({ label: r.name, value: r.id }))
                }
                onChange={(option) =>
                  option &&
                  setState((prev) => ({
                    ...prev,
                    district: option.label,
                    districtId: option.value,
                  }))
                }
                sx={{ flex: 1 }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="city"
                label="City"
                defaultValue={state?.city}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: !!state?.city },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="pinCode"
                label="Pin code"
                defaultValue={state?.pinCode}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: !!state?.pinCode },
                  htmlInput: PincodeTextInputProps,
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="mobile"
                label="Mobile"
                defaultValue={state?.mobile}
                fullWidth
                slotProps={{
                  htmlInput: MobileTextInputProps,
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">+91</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="email"
                label="Email"
                defaultValue={state?.email}
                fullWidth
                slotProps={{
                  htmlInput: EmailTextInputProps,
                  inputLabel: { shrink: !!state?.email },
                }}
              />
            </Grid>

            {gstApplicable && !state.isBilling && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="gstVatNo"
                  label="GST No"
                  defaultValue={state?.gstVatNo}
                  fullWidth
                  slotProps={{
                    inputLabel: { shrink: !!state?.gstVatNo },
                    htmlInput: GSTTextInputProps,
                  }}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>

        <CardActions
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
        >
          <Button onClick={onCancel}>Cancel</Button>
          <Button color="success" type="submit">
            Save
          </Button>
        </CardActions>
      </Card>
    </Form>
  );
}

function generateTemporaryID(address?: Partial<Address>) {
  if (!isNaN(parseInt((address?.id as any) ?? "")))
    return parseInt(address?.id as any);
  return `#temp-${Date.now()}`;
}

function removeTemporaryIDs(address: Partial<Address>) {
  const result = { ...address } as Record<string, any>;
  if (typeof result.id === "string") {
    const [first] = result.id.split("-");
    if (first === "#temp") delete result.id;
  }
  return result as Address;
}

function truncate(str: string, length: number) {
  if (!str || str.length === 0) return "";
  if (length >= str.length) return str;
  return str.slice(0, length) + "...";
}

export function getAddressDisplayName(address: Address) {
  return `${truncate(address.address1, 30)}${address.address1 && address.state ? ", " : ""}${address.state ?? ""}${(address.state && address.pinCode) || (!address.state && address.address1 && address.pinCode) ? ", " : ""}${address.pinCode ?? ""}`;
}
