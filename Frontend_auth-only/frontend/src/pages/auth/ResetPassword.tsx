import React, { useMemo, useState } from "react";
import { Box, Button, Stack, TextField, Typography, Alert, InputAdornment, IconButton } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import { BRAND, BRAND_SHADOW } from "../../theme/brand";
import AuthLayout from "./AuthLayout";
import { resetPassword, ApiError } from "../../lib/api";

interface FormState {
    newPassword: string;
    confirmPassword: string;
}

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "&.Mui-focused fieldset": { borderColor: BRAND.primary },
    },
    "& label.Mui-focused": { color: BRAND.primary },
};

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

    const [form, setForm] = useState<FormState>({ newPassword: "", confirmPassword: "" });
    const [errors, setErrors] = useState<Partial<FormState>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const v: Partial<FormState> = {};
        if (form.newPassword.length < 8) v.newPassword = "At least 8 characters";
        if (form.confirmPassword !== form.newPassword) v.confirmPassword = "Passwords don't match";
        setErrors(v);
        if (Object.keys(v).length > 0) return;

        setSubmitting(true);
        setServerError(null);
        try {
            await resetPassword({ token, new_password: form.newPassword });
            setDone(true);
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

    if (!token) {
        return (
            <AuthLayout
                eyebrow="CLOUD MANAGED · RESET PASSWORD"
                title="Reset link missing"
                subtitle="This page needs a reset link from your email to work."
                maxWidth="xs"
            >
                <Alert severity="error" sx={{ borderRadius: "10px" }}>
                    This link is missing its reset token. Please use the link from your email, or request a new one.
                </Alert>
                <Box sx={{ mt: 2.5, textAlign: "center" }}>
                    <Box component={RouterLink} to="/auth/forgot-password" sx={{ color: BRAND.primary, fontWeight: 700, fontSize: 14 }}>
                        Request a new reset link
                    </Box>
                </Box>
            </AuthLayout>
        );
    }

    if (done) {
        return (
            <AuthLayout
                eyebrow="CLOUD MANAGED · RESET PASSWORD"
                title="Password updated"
                subtitle="Your password has been reset — you can now log in with your new password."
                maxWidth="xs"
            >
                <Alert severity="success" sx={{ borderRadius: "10px" }}>
                    Your password has been reset successfully.
                </Alert>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate("/auth/login")}
                    sx={{
                        mt: 3,
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
                    Go to log in
                </Button>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            eyebrow="CLOUD MANAGED · RESET PASSWORD"
            title="Choose a new password"
            subtitle="This reset link is valid for 30 minutes and can only be used once."
            maxWidth="xs"
        >
            <Typography sx={{ fontFamily: '"Sora","Inter",sans-serif', fontWeight: 800, fontSize: 24, color: BRAND.ink }}>
                Set a new password
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} noValidate>
                <Stack spacing={2.5}>
                    {serverError && <Alert severity="error" sx={{ borderRadius: "10px" }}>{serverError}</Alert>}

                    <TextField
                        label="New password"
                        type={showPassword ? "text" : "password"}
                        value={form.newPassword}
                        onChange={set("newPassword")}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword || "At least 8 characters"}
                        fullWidth
                        sx={inputSx}
                        autoFocus
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

                    <TextField
                        label="Confirm new password"
                        type={showPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={set("confirmPassword")}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        fullWidth
                        sx={inputSx}
                    />

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
                        {submitting ? "Updating…" : "Reset password"}
                    </Button>
                </Stack>
            </Box>
        </AuthLayout>
    );
};

export default ResetPassword;