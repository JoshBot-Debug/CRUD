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
        J
      </Avatar>
    ),
    name: "Joshua Myers",
    occupation: "Senior Engineer",
    testimonial:
      "I absolutely love how versatile this product is! Whether I'm tackling work projects or indulging in my favorite hobbies, it seamlessly adapts to my changing needs. Its intuitive design has truly enhanced my daily routine, making tasks more efficient and enjoyable.",
  },
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        P
      </Avatar>
    ),
    name: "Priya Desai",
    occupation: "Operations Manager, Nexora Tech",
    testimonial:
      "Our team switched over a few months ago, and the improvement has been remarkable. The automation tools save us hours every week, and the reports are clear and actionable. It feels like we’ve gained an extra team member!",
  },
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        L
      </Avatar>
    ),
    name: "Liam Carter",
    occupation: "Founder, CloudFin Solutions",
    testimonial:
      "What impressed me most is the attention to detail. Every feature feels thoughtfully designed, and the support team genuinely cares about helping you succeed. It’s rare to find this level of quality and reliability.",
  },
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        S
      </Avatar>
    ),
    name: "Sophia Nguyen",
    occupation: "Finance Director, BrightWorks Manufacturing",
    testimonial:
      "I was skeptical at first, but the setup was effortless and the learning curve almost nonexistent. Within days, our accounting process became smoother and far more transparent. I can’t imagine going back.",
  },
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        D
      </Avatar>
    ),
    name: "Daniel Thompson",
    occupation: "Chief Operating Officer, Aegis Group",
    testimonial:
      "We needed something flexible enough to handle our projects, payroll, and compliance — this platform delivered all that and more. It’s efficient, modern, and keeps our entire organization in sync.",
  },
  {
    avatar: (
      <Avatar variant="rounded" sx={{ bgcolor: "primary.dark" }}>
        I
      </Avatar>
    ),
    name: "Isabella Romero",
    occupation: "Program Coordinator, Helping Hands Foundation",
    testimonial:
      "As a small non-profit, we needed software that simplified our finances without feeling overwhelming. This solution gave us structure, accuracy, and peace of mind — all in one elegant package.",
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
