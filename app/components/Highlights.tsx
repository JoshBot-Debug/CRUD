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
    title: "Streamlined Sales Workflow",
    description:
      "Manage leads, quotations, sales orders, and customer interactions in one connected workflow from first contact to closing the deal.",
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: "Centralized Customer Data",
    description:
      "Keep customer profiles, contact details, communication history, and purchase records organized in a single location.",
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: "Simple & Intuitive",
    description:
      "Designed for busy sales teams with a clean interface that makes managing customers and orders fast and effortless.",
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: "Sales Automation",
    description:
      "Automate follow-up reminders, quotation generation, order processing, and repetitive tasks to improve productivity.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "Team Collaboration",
    description:
      "Assign leads, track ownership, share customer updates, and keep everyone aligned throughout the sales process.",
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: "Real-Time Sales Insights",
    description:
      "Monitor your sales pipeline, conversion rates, pending quotations, and team performance with live dashboards and analytics.",
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
