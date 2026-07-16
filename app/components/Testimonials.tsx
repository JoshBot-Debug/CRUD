import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
const userTestimonials = [
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        A
      </Avatar>
    ),
    name: "Arjun Mehta",
    occupation: "Sales Manager, Vertex Distributors",
    testimonial:
      "Our sales team finally has a single place to manage leads, quotations, and customer follow-ups. We've reduced response times significantly and never lose track of an opportunity anymore.",
  },
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        S
      </Avatar>
    ),
    name: "Sarah Wilson",
    occupation: "Business Development Lead, Nexa Solutions",
    testimonial:
      "Creating quotations takes minutes instead of hours, and converting them into sales orders is effortless. The entire sales workflow feels much more organized.",
  },
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        R
      </Avatar>
    ),
    name: "Rahul Sharma",
    occupation: "Director, Sharma Electronics",
    testimonial:
      "The customer history and order tracking features have completely changed how we work. Every interaction is recorded, making it easy for our team to provide consistent service.",
  },
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        E
      </Avatar>
    ),
    name: "Emily Johnson",
    occupation: "Operations Manager, BrightLine Retail",
    testimonial:
      "Our sales representatives can instantly see product information, customer history, and pending orders. It has improved communication across the entire company.",
  },
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        M
      </Avatar>
    ),
    name: "Michael Chen",
    occupation: "Founder, Apex Industrial Supplies",
    testimonial:
      "The dashboards give us a clear picture of our pipeline, pending quotations, and sales performance. We can make decisions much faster with real-time insights.",
  },
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        P
      </Avatar>
    ),
    name: "Priya Nair",
    occupation: "Customer Success Manager, Nova Services",
    testimonial:
      "Follow-up reminders and customer timelines ensure nothing slips through the cracks. It's become an essential part of how we build long-term customer relationships.",
  },
];

export default function Testimonials() {
  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
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
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: "text.primary" }}
        >
          Testimonials
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Discover how our customers transformed their operations with smarter
          invoicing, effortless accounting, and real-time insights — driving
          growth and lasting success.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {userTestimonials.map((testimonial, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            key={index}
            sx={{ display: "flex" }}
          >
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
              }}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: "text.secondary" }}
                >
                  {testimonial.testimonial}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <CardHeader
                  avatar={testimonial.avatar}
                  title={testimonial.name}
                  subheader={testimonial.occupation}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
