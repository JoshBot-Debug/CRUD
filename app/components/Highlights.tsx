import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: "Adaptive Workflow",
    description:
      "Our software adjusts to your business processes, streamlining invoicing, payroll, and reporting for maximum efficiency.",
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: "Robust Accounting Engine",
    description:
      "Built to handle complex financial operations with accuracy, ensuring your ledgers, transactions, and reports are always reliable.",
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: "Intuitive Interface",
    description:
      "Navigate your accounting tasks effortlessly with a clean, user-friendly interface designed for both beginners and professionals.",
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: "Smart Automation",
    description:
      "Automate recurring invoices, tax calculations, and expense tracking to save time and reduce errors across your business.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "Trusted Customer Support",
    description:
      "Our knowledgeable support team is ready to assist you with any accounting or software queries, ensuring smooth operations.",
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: "Accurate Insights",
    description:
      "Gain precise, real-time financial analytics and reports that help you make informed decisions and track your business performance.",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "grey.900",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Explore the key features and benefits that set our platform apart,
            empowering teams with efficiency, insight, and tools to achieve
            remarkable results.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: "inherit",
                  p: 3,
                  height: "100%",
                  borderColor: "hsla(220, 25%, 25%, 0.3)",
                  backgroundColor: "grey.800",
                }}
              >
                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: "medium" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
