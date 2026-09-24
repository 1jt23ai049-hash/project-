import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { ShieldCheck, QrCode, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../../theme/brand";
import Logo from "../../components/Logo";

const SIDE_POINTS = [
  { icon: <QrCode size={16} />, text: "Static & Dynamic QR codes for every batch and lot" },
  { icon: <Sprout size={16} />, text: "Built for crops, farms, and agricultural traceability" },
  { icon: <ShieldCheck size={16} />, text: "Choose a free trial or subscribe — you decide after signup" },
];

interface AuthLayoutProps {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  maxWidth?: "xs" | "sm";
}

/**
 * Split-screen shell shared by /company/register and /auth/login.
 * Left panel carries the brand gradient + orientation copy (same tone as
 * the marketing site); right panel is a plain white card for the form.
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ children, eyebrow, title, subtitle, maxWidth = "xs" }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: BRAND.bg }}>
      {/* Left: brand panel */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          width: "42%",
          minWidth: 420,
          p: 6,
          background: BRAND.gradient,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* soft ambient blobs, matches the site's morph/float motifs */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            animation: "float 9s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            animation: "float 11s ease-in-out infinite",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ cursor: "pointer", display: "inline-flex" }} onClick={() => navigate("/")}>
            <Logo light size={32} />
          </Box>

          <Typography sx={{ mt: 8, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)" }}>
            {eyebrow}
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              fontFamily: '"Sora", "Inter", sans-serif',
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 1rem + 1.6vw, 2.1rem)",
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ mt: 2, fontSize: 14.5, color: "rgba(255,255,255,0.85)", maxWidth: 380, lineHeight: 1.6 }}>
            {subtitle}
          </Typography>
        </Box>

        <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
          {SIDE_POINTS.map((p) => (
            <Stack key={p.text} direction="row" spacing={1.4} alignItems="flex-start">
              <Box
                sx={{
                  mt: 0.2,
                  width: 26,
                  height: 26,
                  borderRadius: "8px",
                  bgcolor: "rgba(255,255,255,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {p.icon}
              </Box>
              <Typography sx={{ fontSize: 13.5, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
                {p.text}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* Right: form panel */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2.5, sm: 4 } }}>
        <Container maxWidth={maxWidth} disableGutters>
          <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center", mb: 4, cursor: "pointer" }} onClick={() => navigate("/")}>
            <Logo size={30} />
          </Box>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;
