import { Link } from "react-router";
import { ArrowForward, AutoAwesome, History, RateReview } from "@mui/icons-material";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", py: { xs: 5, md: 10 } }}>
      <Container maxWidth="md">
        <Stack spacing={2} sx={{ mb: 6 }}>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".16em" }}>
            Prep-Period
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.7rem", md: "4.5rem" }, lineHeight: 1.05 }}>
            What would you like to do?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 520 }}>
            Plan, revisit, and improve your lessons in one place.
          </Typography>
        </Stack>

        <Stack component="nav" aria-label="Lesson menu" spacing={1.5}>
          {[
            { to: "/generate", number: "01", title: "Generate Lesson", detail: "Build a fresh lesson plan", icon: <AutoAwesome /> },
            { to: "/history", number: "02", title: "Past Lessons", detail: "Browse your saved plans", icon: <History /> },
            { to: "/reflection", number: "03", title: "Lesson Reflection", detail: "Reflect on what worked", icon: <RateReview /> },
          ].map((item) => (
            <Paper key={item.to} component={Link} to={item.to} elevation={0} sx={{ display: "flex", alignItems: "center", gap: 2, p: { xs: 2, md: 2.5 }, textDecoration: "none", color: "inherit", transition: "transform .2s, border-color .2s", "&:hover": { transform: "translateX(6px)", borderColor: "primary.main" } }}>
              <Box sx={{ color: "primary.main", display: "flex" }}>{item.icon}</Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                <Typography color="text.secondary">{item.detail}</Typography>
              </Box>
              <Typography color="text.secondary" sx={{ display: { xs: "none", sm: "block" }, fontWeight: 700 }}>{item.number}</Typography>
              <ArrowForward color="primary" />
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}