import type { Route } from "../+types/root";
import { isRouteErrorResponse } from "react-router";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Lottie from "lottie-react";
import errorAnimation from "~/assets/error.lottie.json";
import notFoundAnimation from "~/assets/404.lottie.json";
import type { APIError } from "~/.server/helper";

export default function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    if (error.status == 404)
      return (
        <Box
          sx={{ position: "relative", flex: 1, width: "100%", height: "100%" }}
        >
          <Lottie
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            animationData={notFoundAnimation}
            loop={true}
          />
        </Box>
      );

    const e = error.data as unknown as APIError;

    return (
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography variant="h1">{e.title}</Typography>
        <Box
          sx={{ position: "relative", flex: 1, width: "100%", height: "100%" }}
        >
          <Lottie
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            animationData={errorAnimation}
            loop={true}
          />
        </Box>
      </Box>
    );
  } else if (error instanceof Error) {
    return (
      <Box>
        <Typography variant="h1">{error.name}</Typography>
        <Typography variant="body1">{error.message}</Typography>
      </Box>
    );
  } else {
    return <Typography>Unknown Error</Typography>;
  }
}
