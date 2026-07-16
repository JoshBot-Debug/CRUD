import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    question: "What is a Sales & Orders CRM?",
    answer: (
      <>
        A Sales & Orders CRM helps you manage leads, customers, quotations,
        sales orders, follow-ups, and customer interactions from a single
        platform, making your sales process more organized and efficient.
      </>
    ),
  },
  {
    question: "Can I manage my quotations and sales orders?",
    answer: (
      <>
        Yes. You can create professional quotations, convert them into sales
        orders, track their status, and maintain a complete history of every
        customer transaction.
      </>
    ),
  },
  {
    question: "Can multiple team members use the CRM?",
    answer: (
      <>
        Absolutely. Your sales team can collaborate by managing leads, updating
        customer information, assigning tasks, and tracking progress together in
        real time.
      </>
    ),
  },
  {
    question: "Is my customer data secure?",
    answer: (
      <>
        Yes. We follow industry best practices to protect your data with secure
        authentication, encrypted communication, and role-based access control.
      </>
    ),
  },
  {
    question: "Can I import my existing customers?",
    answer: (
      <>
        Yes. Existing customer and product data can be imported, making it easy
        to migrate from spreadsheets or another CRM with minimal downtime.
      </>
    ),
  },
  {
    question: "How do I contact support?",
    answer: (
      <>
        Our support team is here to help. You can contact us anytime at{" "}
        <Link href="mailto:support@iotafox.com">
          support@iotafox.com
        </Link>{" "}
        for assistance.
      </>
    ),
  },
];

export default function FAQ() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Container
      id="faq"
      sx={{
        py: { xs: 8, sm: 16 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "text.primary",
        }}
      >
        Frequently Asked Questions
      </Typography>

      <Typography
        sx={{
          textAlign: "center",
          color: "text.secondary",
          mb: 6,
          maxWidth: 700,
          mx: "auto",
        }}
      >
        Everything you need to know about our Sales & Orders CRM.
      </Typography>

      <Box display="flex" flexDirection="column">
        {faqs.map((faq, index) => (
          <Accordion
            key={faq.question}
            expanded={expanded === `panel-${index}`}
            onChange={handleChange(`panel-${index}`)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" fontWeight={600}>
                {faq.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}