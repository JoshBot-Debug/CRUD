import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "~/components/ForgotPassword";
import Logo from "~/components/Logo";
import ColorModeIconDropdown from "~/theme/ColorModeIconDropdown";
import { data, Form, redirect } from "react-router";
import type { Route } from "./+types/signIn";
import { createHeaders, fetchAPI } from "~/.server/helper";
import { getSession } from "~/.server/session";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export async function action({ request }: Route.ActionArgs) {

  // return redirect("/dashboard");

  const session = await getSession(request);

  const formData: any = Object.fromEntries(await request.formData());

  const [result, commit] = await fetchAPI<any>("/v1/authentication.login", {
    session,
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (!result)
    return data(null, { headers: await createHeaders(session, { commit }) });

  if (!result?.token) return result;

  session.set("token", result.token);
  session.set("email", result.email);

  return redirect("/dashboard", {
    headers: await createHeaders(session, { commit: true }),
  });
}

export default function SignIn({ actionData }: Route.ComponentProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <ColorModeIconDropdown
        sx={{ position: "fixed", top: "1rem", right: "1rem" }}
      />
      <Card variant="outlined">
        <Box sx={{ maxWidth: 300, mx: "auto" }}>
          <Logo />
        </Box>
        <Typography variant="h3" textAlign="center">
          Sign in
        </Typography>
        <Form method="POST">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={actionData?.error?.email}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={!!actionData?.error?.email ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={actionData?.error?.password}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={!!actionData?.error?.password ? "error" : "primary"}
              />
            </FormControl>
            <FormControlLabel
              name="rememberMe"
              label="Remember me"
              control={<Checkbox value="true" color="primary" />}
            />
            <ForgotPassword open={open} handleClose={() => setOpen(false)} />
            <Button type="submit" fullWidth variant="contained">
              Sign in
            </Button>
            <Link
              component="button"
              type="button"
              onClick={() => setOpen(true)}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Forgot your password?
            </Link>
          </Box>
        </Form>
        {/* <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/material-ui/getting-started/templates/sign-in/"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign up
              </Link>
            </Typography>
          </Box> */}
      </Card>
    </SignInContainer>
  );
}
