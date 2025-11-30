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
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(-1);

  const onClickItem = (index: number) => setSelectedItemIndex(index);

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
              onClick={() => onClickItem(index)}
              sx={[
                (theme) => ({
                  p: 2,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  textAlign: "left",
                  textTransform: "none",
                  color: "text.secondary",
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: (theme.vars || theme).palette.action.hover,
                    transform: "translateY(-2px)",
                  },
                }),
                selectedItemIndex === index && {
                  backgroundColor: "action.selected",
                  color: "text.primary",
                },
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
        "Our Features",
        "Empower your business with powerful tools that simplify operations and accelerate growth.",
        [
          {
            icon: <ReceiptLongRoundedIcon />,
            title: "E-Invoicing",
            description:
              "Generate and send GST-compliant invoices instantly with automated tax handling and digital records.",
          },
          {
            icon: <InventoryRoundedIcon />,
            title: "Inventory Management",
            description:
              "Track stock levels in real time, manage suppliers, and receive alerts before you run out of key items.",
          },
          {
            icon: <BusinessCenterRoundedIcon />,
            title: "Project Tracking",
            description:
              "Plan, assign, and monitor tasks across teams with full visibility into progress and costs.",
          },
          {
            icon: <AccountBalanceRoundedIcon />,
            title: "Corporate Accounting",
            description:
              "Manage ledgers, reconcile transactions, and generate detailed financial reports effortlessly.",
          },
          {
            icon: <AccountBalanceRoundedIcon />,
            title: "Certified Compliance",
            description:
              "Verified by Chartered Accountants and certified by the Tax Department for trusted compliance.",
          },
        ],
      )}

      {section(
        "Designed For",
        "Tailored solutions for every type of organization — built to fit your unique needs.",
        [
          {
            icon: <ViewQuiltRoundedIcon />,
            title: "Manufacturers",
            description:
              "Streamline production, track raw materials, and manage costs with precision and control.",
          },
          {
            icon: <SchoolRoundedIcon />,
            title: "Schools & Institutions",
            description:
              "Simplify fee management, payroll, and resource tracking with a user-friendly dashboard.",
          },
          {
            icon: <VolunteerActivismRoundedIcon />,
            title: "Non-Profit Organizations",
            description:
              "Manage donations, grants, and community programs with transparency and accountability.",
          },
        ],
      )}
    </Container>
  );
}
