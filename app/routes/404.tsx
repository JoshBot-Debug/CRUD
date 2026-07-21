import { Box } from "@mui/material";
import Lottie from "lottie-react";
import * as React from "react";
import AppAppBar from "~/components/AppAppBar";
import notFoundAnimation from "~/assets/404.lottie.json";

export default function NotFound() {
  return (
    <>
      <AppAppBar goBack />
      <Box
        sx={{ position: "relative", flex: 1, width: "100%", height: "100vh" }}
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
    </>
  );
}
