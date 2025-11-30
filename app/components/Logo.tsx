import { useColorScheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

import logoLight from "~/assets/logo-light.webp";
import logoDark from "~/assets/logo-dark.webp";

export default function Logo() {
  const { mode, systemMode } = useColorScheme();
  const theme = mode == "system" ? systemMode : mode;
  const isDark = theme === "dark";

  return (
    <Box
      component="img"
      src={isDark ? logoLight : logoDark}
      alt="Logo"
      sx={{ height: "100%", width: "100%", objectFit: "contain" }}
    />
  );
}
