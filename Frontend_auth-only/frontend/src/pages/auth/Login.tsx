import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { BRAND, BRAND_SHADOW } from "../../theme/brand";
import AuthLayout from "./AuthLayout";
import { loginUser, saveSession, ApiError, resolvePostAuthRoute } from "../../lib/api";
import { adminLogin, saveAdminSession, ApiError as AdminApiError } from "../../lib/admin-api";

interface FormState {
  email: string;
  password: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "&.Mui-focused fieldset": { borderColor: BRAND.primary },
  },
  "& label.Mui-focused": { color: BRAND.primary },
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const v: Partial<FormState> = {};
    if (!EMAIL_RE.test(form.email)) v.email = "Enter a valid email";
    if (!form.password) v.password = "Enter your password";
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    const email = form.email.trim().toLowerCase();
    try {
      const auth = await loginUser({ email, password: form.password });
      saveSession(auth);
      navigate(resolvePostAuthRoute(auth.company));
      return;
    } catch (err) {
      // Only fall through to an admin-login attempt when this specifically
      // looks like "wrong credentials" — any other tenant-login error
      // (network, 5xx, etc.) should surface as-is, not get masked.
      const isTenantAuthFailure = err instanceof ApiError && err.status === 401;
      if (!isTenantAuthFailure) {
        setServerError(err instanceof ApiError ? err.message : "Couldn't reach the server. Please try again.");
        setSubmitting(false);
        return;
      }
    }

    try {
      const adminAuth = await adminLogin({ email, password: form.password });
      saveAdminSession(adminAuth);
      navigate("/admin/overview");
    } catch (err) {
      if (err instanceof AdminApiError) {
        setServerError(err.status === 401 ? "Incorrect email or password." : err.message);
      } else {
        setServerError("Couldn't reach the server. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="CLOUD MANAGED · LOG IN"
      title="Log in to your dashboard"
      subtitle="Enter the email and password we sent you to get started."
      maxWidth="xs"
    >
      <Typography sx={{ fontFamily: '"Sora","Inter",sans-serif', fontWeight: 800, fontSize: 24, color: BRAND.ink }}>
        Log In
      </Typography>
      <Typography sx={{ mt: 0.8, fontSize: 14, color: BRAND.muted }}>
        New to AgriQR?{" "}
        <Box component={RouterLink} to="/company/register" sx={{ color: BRAND.primary, fontWeight: 700 }}>
          Create an account
        </Box>
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} noValidate>
        <Stack spacing={2.5}>
          {serverError && <Alert severity="error" sx={{ borderRadius: "10px" }}>{serverError}</Alert>}

          <TextField
            label="Work email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={set("email")}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            sx={inputSx}
            autoFocus
          />

          <Box>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              sx={inputSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ mt: 0.8, textAlign: "right" }}>
              <Box
                component={RouterLink}
                to="/auth/forgot-password"
                sx={{ fontSize: 13, fontWeight: 700, color: BRAND.primary, textDecoration: "none" }}
              >
                Forgot password?
              </Box>
            </Box>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: BRAND.primary,
              "&:hover": { bgcolor: BRAND.primaryDark },
              py: 1.4,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: 15,
              boxShadow: BRAND_SHADOW.primary,
            }}
          >
            {submitting ? "Logging in…" : "Log In"}
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default Login;