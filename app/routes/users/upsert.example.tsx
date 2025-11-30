import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useRouteLoaderData, useSearchParams } from "react-router";
import LazySelect from "~/components/LazySelect";
import MoneyField from "~/components/MoneyField";
import Switch from "~/components/Switch";
import ToggleButton from "~/components/ToggleButton";
import UnsavedChanges from "~/components/UnsavedChanges";

export default function UpsertComponent(props: any) {
  const loaderData = useRouteLoaderData("layouts/AuthenticatedLayout");
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<any>(props);

  const isReadonly = !searchParams.has("update") && !searchParams.has("create");
  const isService = state.itemType == "Service";

  useEffect(() => {
    setState(props);
  }, [props]);

  return (
    <Box
      key={state.id}
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      <UnsavedChanges />
      {state.id && <input type="hidden" name="id" value={state.id} />}
      <Card sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardHeader
          title="Item"
          action={
            <ToggleButton
              name="itemType"
              defaultValue={state.itemType || "Goods"}
              disabled={isReadonly}
              onChange={(itemType) =>
                setState((prev: any) => ({ ...prev, itemType }))
              }
              options={[
                { label: "Goods", value: "Goods" },
                { label: "Services", value: "Service" },
              ]}
            />
          }
        />

        <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                name="name"
                label="Name"
                disabled={isReadonly}
                fullWidth
                defaultValue={state.name}
                required
              />
              <TextField
                name="description"
                label="Description"
                disabled={isReadonly}
                fullWidth
                multiline
                rows={4}
                defaultValue={state.description}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                name="itemCode"
                label={isService ? "Service Code" : "Item Code"}
                disabled={isReadonly}
                fullWidth
                defaultValue={state.itemCode}
                required
              />
              <TextField
                name="hsnCode"
                label={isService ? "SAC Code" : "HSN Code"}
                disabled={isReadonly}
                fullWidth
                defaultValue={state.hsnCode}
                required
              />
              <TextField
                name="godownLocation"
                label="Godown location"
                disabled={isReadonly}
                fullWidth
                defaultValue={state.godownLocation}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="taxPercentage"
                label="Tax Rate"
                disabled={isReadonly}
                fullWidth
                type="number"
                defaultValue={state.taxPercentage}
                required
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 100,
                    step: "any",
                  },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                name="openingStock"
                label="Opening stock"
                disabled={isReadonly}
                fullWidth
                hidden={isService}
                type="number"
                defaultValue={state.openingStock}
                required
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
              <TextField
                name="physicalStock"
                label="Physical stock"
                disabled={isReadonly}
                fullWidth
                hidden={isService}
                type="number"
                defaultValue={state.physicalStock}
                required
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", gap: 2 }}>
              <LazySelect
                path="/api/units"
                name="unitId"
                label="Unit"
                disabled={isReadonly}
                parseResult={(result) =>
                  result.map((r: any) => ({ label: r.name, value: r.id }))
                }
                defaultValue={
                  state.unit && { label: state.unit.name, value: state.unit.id }
                }
                required
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardHeader title="Price" />
        <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <MoneyField
                name="sRate"
                label={isService ? "Service Charge" : "Selling Price"}
                disabled={isReadonly}
                fullWidth
                defaultValue={state.sRate}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <MoneyField
                name="pRate"
                label="Purchase Price"
                disabled={isReadonly}
                fullWidth
                defaultValue={state.pRate}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  },
                }}
                hidden={isService}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardHeader
          title="Assign to account"
          action={
            <Switch
              disabled={isReadonly}
              checked={state.assignToAccount}
              onChange={(e: any) =>
                setState((prev: any) => ({
                  ...prev,
                  assignToAccount: e.target.checked,
                }))
              }
            />
          }
        />
        <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <LazySelect
                path={`/api/items/metadata/company/${loaderData.user.companyId}`}
                name="ledgerId"
                label="Account"
                disabled={isReadonly || !state.assignToAccount}
                parseResult={(result) =>
                  result.companyAccounts.map((r: any) => ({
                    label: r.accountName,
                    value: r.id,
                  }))
                }
                defaultValue={
                  state.ledgerId && { label: "-", value: state.ledgerId }
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
