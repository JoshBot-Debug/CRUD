import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useOutletContext, useSearchParams } from "react-router";
import LazySelect from "~/components/LazySelect";
import UnsavedChanges from "~/components/UnsavedChanges";

export default function UpsertComponent() {
  const outlet = useOutletContext<any>();
  const [searchParams] = useSearchParams();
  const state = outlet?.loaderData?.one ?? {};

  const isUpdating = searchParams.get("update") === outlet?.formId;
  const isCreating = searchParams.get("create") === outlet?.formId;
  const isReadonly = !isUpdating && !isCreating;

  return (
    <Box
      id={outlet?.formId}
      key={state.id}
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      <UnsavedChanges />
      {state.id && <input type="hidden" name="id" value={state.id} />}
      <Card sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardHeader title="Permission" />

        <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid
              size={12}
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
              <LazySelect
                path="/v1/security/roles"
                name="roles"
                label="Roles"
                disabled={isReadonly}
                parseResult={(result) =>
                  result.map((r: any) => ({ label: r.name, value: r.id }))
                }
                defaultValue={state.roles?.map((o: any) => ({
                  label: o.name,
                  value: o.id,
                }))}
                multiple
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
