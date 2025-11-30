import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { useOutletContext, useSearchParams } from "react-router";
import LazySelect from "~/components/LazySelect";
import UnsavedChanges from "~/components/UnsavedChanges";

export default function UpsertComponent(props: any) {
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
        <CardHeader title="Role" />

        <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid
              size={12}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <LazySelect
                path="/v1/security/roles"
                name="role"
                label="Roles"
                disabled={isReadonly}
                parseResult={(result) =>
                  result.map((r: any) => ({ label: r.name, value: r.id }))
                }
                defaultValue={{
                  label: state.role?.name,
                  value: state.role?.id,
                }}
                required
              />
              <LazySelect
                path="/v1/security/permissions"
                name="permission"
                label="Permissions"
                disabled={isReadonly}
                parseResult={(result) =>
                  result.map((r: any) => ({ label: r.name, value: r.id }))
                }
                defaultValue={{
                  label: state.permission?.name,
                  value: state.permission?.id,
                }}
                required
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
