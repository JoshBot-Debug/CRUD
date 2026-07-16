import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";

interface Item {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Features() {
  const section = (title: string, subtitle: string, items: Item[]) => (
    <Box sx={{ mt: { xs: 6, sm: 10 } }}>
      <Typography
        component="h2"
        variant="h4"
        gutterBottom
        sx={{ color: "text.primary" }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mb: { xs: 2, sm: 4 } }}
        >
          {subtitle}
        </Typography>
      )}

      <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
        {items.map(({ icon, title, description }, index) => (
          <Grid size={1} key={index}>
            <Button
              variant="outlined"
              sx={[
                (theme) => ({
                  p: 2,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  textAlign: "left",
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }),
              ]}
            >
              {icon}
              <Typography variant="h6" sx={{ mt: 1 }}>
                {title}
              </Typography>
              <Typography variant="body2">{description}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      {section(
        "Everything Your Sales Team Needs",
        "Manage leads, customers, quotations, orders, and follow-ups from one modern CRM platform.",
        [
          {
            icon: <BusinessCenterRoundedIcon />,
            title: "Lead Management",
            description:
              "Capture leads from multiple sources, assign them to your sales team, and track every opportunity from first contact to conversion.",
          },
          {
            icon: <ReceiptLongRoundedIcon />,
            title: "Quotations & Orders",
            description:
              "Create professional quotations, convert them into sales orders with one click, and manage the entire sales process.",
          },
          {
            icon: <InventoryRoundedIcon />,
            title: "Product Catalog",
            description:
              "Maintain products, pricing, and stock availability so your sales team always has accurate information.",
          },
          {
            icon: <AccountBalanceRoundedIcon />,
            title: "Customer Management",
            description:
              "Store customer details, communication history, documents, and purchase records in one centralized location.",
          },
          {
            icon: <ViewQuiltRoundedIcon />,
            title: "Sales Dashboard",
            description:
              "Monitor sales performance, conversion rates, pending quotations, and team activity with real-time insights.",
          },
          {
            icon: <SchoolRoundedIcon />,
            title: "Tasks & Follow-ups",
            description:
              "Schedule calls, meetings, reminders, and follow-ups so no opportunity is ever missed.",
          },
        ],
      )}

      {section(
        "Perfect For",
        "Built for businesses that want to organize their sales process and grow customer relationships.",
        [
          {
            icon: <BusinessCenterRoundedIcon />,
            title: "Sales Teams",
            description:
              "Track every lead, manage customer interactions, and close deals more efficiently.",
          },
          {
            icon: <InventoryRoundedIcon />,
            title: "Retail & Distribution",
            description:
              "Manage customers, product catalogs, quotations, and orders across multiple sales channels.",
          },
          {
            icon: <ViewQuiltRoundedIcon />,
            title: "Service Businesses",
            description:
              "Organize clients, proposals, projects, and recurring business from a single platform.",
          },
        ],
      )}
    </Container>
  );
}
