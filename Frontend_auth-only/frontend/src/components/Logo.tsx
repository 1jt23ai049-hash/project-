import React from "react";
import { Box, Typography } from "@mui/material";
import { BRAND } from "../theme/brand";

/**
 * AgriQR mark.
 * The signature idea: the QR "finder pattern" (the square-in-square corner
 * markers every scanner recognises) is redrawn so the inner square is a
 * sprout. It reads as a QR code at a glance, but the mark at its center
 * is unmistakably agricultural — the same trick the product itself performs
 * (turn a scan into a field-level fact).
 */
const Mark: React.FC<{ size?: number; light?: boolean }> = ({ size = 34, light = false }) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: light ? "rgba(255,255,255,0.14)" : BRAND.gradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
      {/* finder-pattern ring */}
      <rect x="1" y="1" width="22" height="22" rx="5" stroke="#fff" strokeWidth="2.1" />
      {/* sprout in place of the usual solid finder square */}
      <path
        d="M12 17.5V11.8"
        stroke="#fff"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M12 12.2C12 9.4 9.9 7.4 6.6 7.1C6.4 10.4 8.4 12.4 12 12.2Z"
        fill="#fff"
      />
      <path
        d="M12 10.6C12 7.9 14 6 17.1 5.7C17.3 8.9 15.4 10.8 12 10.6Z"
        fill="#fff"
      />
    </svg>
  </Box>
);

const Logo: React.FC<{ size?: number; light?: boolean; wordmark?: boolean }> = ({
  size = 34,
  light = false,
  wordmark = true,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
    <Mark size={size} light={light} />
    {wordmark && (
      <Typography
        sx={{
          fontFamily: '"Sora", "Inter", sans-serif',
          fontWeight: 800,
          fontSize: size * 0.53,
          letterSpacing: "-0.01em",
          color: light ? "#fff" : BRAND.ink,
          lineHeight: 1,
        }}
      >
        Agri<Box component="span" sx={{ color: light ? BRAND.accent : BRAND.primary }}>QR</Box>
      </Typography>
    )}
  </Box>
);

export default Logo;
