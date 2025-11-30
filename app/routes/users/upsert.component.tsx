import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import {
  useOutletContext,
  useSearchParams,
} from "react-router";
import LazySelect from "~/components/LazySelect";
import UnsavedChanges from "~/components/UnsavedChanges";

export default function UpsertComponent(props: any) {
  const outlet = useOutletContext<any>();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<any>(outlet?.loaderData?.one);

  const isCreate = searchParams.has("create");
  const isReadonly = !searchParams.has("update") && !isCreate;

  return (
    <Box
      id={outlet.formId}
      component="form"
      key={state?.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: theme.spacing(150),
      }}
    >
      <UnsavedChanges />
      {!!state?.id && <input type="hidden" name="id" value={state?.id} />}

      <Card>
        <CardHeader title="User" />

        <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", gap: 2 }}
            >
              <TextField
                name="firstName"
                label="First name"
                disabled={isReadonly}
                fullWidth
                defaultValue={state?.firstName}
                required
              />
              <TextField
                name="middleName"
                label="Middle name"
                disabled={isReadonly}
                fullWidth
                defaultValue={state?.middleName}
                required
              />

              <TextField
                name="lastName"
                label="Last name"
                disabled={isReadonly}
                fullWidth
                defaultValue={state?.lastName}
                required
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                name="email"
                label="Email"
                type="email"
                disabled={isReadonly}
                fullWidth
                multiline
                rows={1}
                defaultValue={state?.email}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                name="country"
                label="Country"
                disabled={isReadonly}
                fullWidth
                defaultValue={state?.country}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                name="phone"
                label="Phone number"
                type="tel"
                disabled={isReadonly}
                fullWidth
                defaultValue={state?.phone}
              />
            </Grid>
            <Grid
              hidden={!isCreate}
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                name="password"
                label="Password"
                type="password"
                disabled={isReadonly || !isCreate}
                fullWidth
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <LazySelect
                path="/api/users"
                name="user"
                label="User"
                required
                enableCache
                cacheInvalidationTimeout={30000}
                // enableClientFilter
                disableFetchOnMount
                disabled={isReadonly}
                parseResult={(result) => result.rows.map((r: any) => ({ label: `${r.firstName} ${r.middleName} ${r.lastName}`, value: r.id }))}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}