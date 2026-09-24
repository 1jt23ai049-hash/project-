import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
  Alert,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff, Link as LinkIcon, UploadCloud, ImagePlus } from "lucide-react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { BRAND, BRAND_SHADOW } from "../../theme/brand";
import AuthLayout from "./AuthLayout";
import { registerCompany, saveSession, ApiError, resolvePostAuthRoute } from "../../lib/api";

interface FormState {
  // account
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  // company
  companyName: string;
  logoUrl: string;
  logoMode: "url" | "upload";
  // address
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  agree: boolean;
}

const INITIAL: FormState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  logoUrl: "",
  logoMode: "url",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  agree: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PINCODE_RE = /^[0-9]{6}$/;
// Letters, spaces, apostrophes, hyphens and periods only — 2 to 50 chars.
const NAME_RE = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
// 10-digit Indian mobile number, must start 6-9.
const PHONE_RE = /^[6-9]\d{9}$/;
// 8+ chars, at least one uppercase, one lowercase, one digit, one symbol.
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const MAX_LOGO_BYTES = 3 * 1024 * 1024; // 3MB

function validate(f: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (!NAME_RE.test(f.fullName.trim())) errors.fullName = "Enter your full name (letters only, 2–50 characters)";
  if (!EMAIL_RE.test(f.email)) errors.email = "Enter a valid work email";
  if (!PHONE_RE.test(f.phone)) errors.phone = "Enter a valid 10-digit mobile number";
  if (!PASSWORD_RE.test(f.password))
    errors.password = "8+ characters with an uppercase letter, lowercase letter, number and symbol";
  if (f.confirmPassword !== f.password) errors.confirmPassword = "Passwords don't match";

  if (!f.companyName.trim()) errors.companyName = "Enter your company name";

  if (!f.line1.trim()) errors.line1 = "Enter the address line";
  if (!f.city.trim()) errors.city = "Enter a city";
  if (!f.state.trim()) errors.state = "Enter a state";
  if (!PINCODE_RE.test(f.pincode)) errors.pincode = "6-digit PIN code";

  if (!f.agree) errors.agree = "Required to continue";
  return errors;
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "&.Mui-focused fieldset": { borderColor: BRAND.primary },
  },
  "& label.Mui-focused": { color: BRAND.primary },
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", color: BRAND.primary, textTransform: "uppercase" }}>
    {children}
  </Typography>
);

// Red asterisk suffix for mandatory-field labels.
const req = (label: string) => (
  <>
    {label} <Box component="span" sx={{ color: "error.main" }}>*</Box>
  </>
);

const CompanyRegister: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = key === "agree" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value as never }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // Phone gets its own handler: strip anything that isn't a digit and cap
  // at 10 characters as the person types, instead of only catching it on submit.
  const setPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, phone: digits }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const setLogoMode = (mode: "url" | "upload") => {
    setLogoError(null);
    setForm((prev) => ({ ...prev, logoMode: mode }));
  };

  const handleLogoFileSelected = (file: File | null) => {
    setLogoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Image is too large. Please choose a file under 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, logoUrl: String(reader.result || "") }));
    reader.onerror = () => setLogoError("Could not read that file. Please try another image.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const auth = await registerCompany({
        full_name: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        company_name: form.companyName.trim(),
        logo_url: form.logoUrl.trim() || undefined,
        address: {
          line1: form.line1.trim(),
          line2: form.line2.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          country: "India",
        },
      });
      saveSession(auth);
      navigate(resolvePostAuthRoute(auth.company));
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("Couldn't reach the server. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="CLOUD MANAGED · CREATE ACCOUNT"
      title="Set up your company account"
      subtitle="Create your account, then choose a free trial or subscribe on the next screen — nothing starts automatically."
      maxWidth="sm"
    >
      <Typography sx={{ fontFamily: '"Sora","Inter",sans-serif', fontWeight: 800, fontSize: 24, color: BRAND.ink }}>
        Create Your Account
      </Typography>
      <Typography sx={{ mt: 0.8, fontSize: 14, color: BRAND.muted }}>
        Already on AgriQR?{" "}
        <Box component={RouterLink} to="/auth/login" sx={{ color: BRAND.primary, fontWeight: 700 }}>
          Log in
        </Box>
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} noValidate>
        <Stack spacing={3}>
          {serverError && <Alert severity="error" sx={{ borderRadius: "10px" }}>{serverError}</Alert>}

          {/* --- Your account --- */}
          <Stack spacing={2}>
            <SectionLabel>Your account</SectionLabel>
            <TextField
              label={req("Your full name")}
              placeholder="e.g. Rashmi K"
              value={form.fullName}
              onChange={set("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName || "Letters only, 2–50 characters"}
              fullWidth
              sx={inputSx}
            />
            <TextField
              label={req("Work email")}
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={set("email")}
              error={!!errors.email}
              helperText={errors.email || "This is also your login username"}
              fullWidth
              sx={inputSx}
            />
            <TextField
              label={req("Phone number")}
              placeholder="9876543210"
              value={form.phone}
              onChange={setPhone}
              error={!!errors.phone}
              helperText={errors.phone || "10-digit mobile number, no spaces or country code"}
              fullWidth
              sx={inputSx}
              inputProps={{ maxLength: 10, inputMode: "numeric" }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={req("Password")}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  error={!!errors.password}
                  helperText={errors.password || "8+ chars, upper, lower, number & symbol"}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={req("Confirm password")}
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  fullWidth
                  sx={inputSx}
                />
              </Grid>
            </Grid>
          </Stack>

          <Divider sx={{ borderColor: BRAND.border }} />

          {/* --- Company & address --- */}
          <Stack spacing={2}>
            <SectionLabel>Company details</SectionLabel>
            <TextField
              label={req("Company name")}
              placeholder="e.g. Green Valley Agro Pvt Ltd"
              value={form.companyName}
              onChange={set("companyName")}
              error={!!errors.companyName}
              helperText={errors.companyName}
              fullWidth
              sx={inputSx}
            />

            {/* --- Company logo: URL or upload from device --- */}
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: BRAND.ink }}>Company logo (optional)</Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  type="button"
                  size="small"
                  onClick={() => setLogoMode("url")}
                  startIcon={<LinkIcon size={14} />}
                  variant={form.logoMode === "url" ? "contained" : "outlined"}
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    ...(form.logoMode === "url"
                      ? { bgcolor: BRAND.primary, "&:hover": { bgcolor: BRAND.primaryDark } }
                      : { borderColor: BRAND.border, color: BRAND.muted }),
                  }}
                >
                  Image URL
                </Button>
                <Button
                  type="button"
                  size="small"
                  onClick={() => setLogoMode("upload")}
                  startIcon={<UploadCloud size={14} />}
                  variant={form.logoMode === "upload" ? "contained" : "outlined"}
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    ...(form.logoMode === "upload"
                      ? { bgcolor: BRAND.primary, "&:hover": { bgcolor: BRAND.primaryDark } }
                      : { borderColor: BRAND.border, color: BRAND.muted }),
                  }}
                >
                  Upload from device
                </Button>
              </Stack>

              {form.logoMode === "url" ? (
                <TextField
                  placeholder="https://..."
                  value={form.logoUrl.startsWith("data:") ? "" : form.logoUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
                  fullWidth
                  sx={inputSx}
                />
              ) : (
                <Box
                  onClick={() => logoFileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleLogoFileSelected(e.dataTransfer.files?.[0] || null);
                  }}
                  sx={{
                    border: `1.5px dashed ${BRAND.border}`,
                    borderRadius: "10px",
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    color: BRAND.muted,
                    fontSize: 13,
                    "&:hover": { borderColor: BRAND.primary },
                  }}
                >
                  <Stack alignItems="center" spacing={0.5}>
                    <UploadCloud size={18} />
                    <span>Click to choose, or drag an image here (max 3MB)</span>
                  </Stack>
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      handleLogoFileSelected(e.target.files?.[0] || null);
                      e.target.value = ""; // clear so re-selecting the same file still triggers onChange
                    }}
                  />
                </Box>
              )}

              {logoError && (
                <Typography sx={{ fontSize: 12, color: "error.main" }}>{logoError}</Typography>
              )}

              {form.logoUrl ? (
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box
                    component="img"
                    src={form.logoUrl}
                    alt="Logo preview"
                    sx={{ width: 44, height: 44, borderRadius: "8px", objectFit: "cover", border: `1px solid ${BRAND.border}` }}
                  />
                  <Button
                    type="button"
                    size="small"
                    color="error"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, logoUrl: "" }));
                      if (logoFileInputRef.current) logoFileInputRef.current.value = "";
                    }}
                    sx={{ textTransform: "none" }}
                  >
                    Remove logo
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: BRAND.muted, fontSize: 12.5 }}>
                  <ImagePlus size={14} />
                  <span>No logo selected — you can add or change this later from the dashboard.</span>
                </Stack>
              )}
            </Stack>

            <TextField
              label={req("Registered address — line 1")}
              value={form.line1}
              onChange={set("line1")}
              error={!!errors.line1}
              helperText={errors.line1}
              fullWidth
              sx={inputSx}
            />
            <TextField
              label="Address line 2 (optional)"
              value={form.line2}
              onChange={set("line2")}
              fullWidth
              sx={inputSx}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  label={req("City")}
                  value={form.city}
                  onChange={set("city")}
                  error={!!errors.city}
                  helperText={errors.city}
                  fullWidth
                  sx={inputSx}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label={req("State")}
                  value={form.state}
                  onChange={set("state")}
                  error={!!errors.state}
                  helperText={errors.state}
                  fullWidth
                  sx={inputSx}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label={req("PIN code")}
                  value={form.pincode}
                  onChange={set("pincode")}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                  fullWidth
                  sx={inputSx}
                  inputProps={{ maxLength: 6, inputMode: "numeric" }}
                />
              </Grid>
            </Grid>
          </Stack>

          <Box>
            <FormControlLabel
              control={<Checkbox checked={form.agree} onChange={set("agree")} sx={{ color: BRAND.border, "&.Mui-checked": { color: BRAND.primary } }} />}
              label={
                <Typography sx={{ fontSize: 12.8, color: BRAND.muted }}>
                  I agree to the Terms of Service and Privacy Policy.
                </Typography>
              }
            />
            {errors.agree && (
              <Typography sx={{ fontSize: 12, color: "error.main", ml: 1.7 }}>{errors.agree}</Typography>
            )}
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
            {submitting ? "Creating your account…" : "Create Account"}
          </Button>

          <Typography sx={{ fontSize: 11.5, color: BRAND.muted, textAlign: "center" }}>
            Need a self-hosted licence instead?{" "}
            <Box component={RouterLink} to="/#pricing" sx={{ color: BRAND.primary, fontWeight: 700 }}>
              Talk to sales
            </Box>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default CompanyRegister;