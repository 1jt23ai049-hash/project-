import React, { useState } from "react";
import { Box, Button, Stack, TextField, Typography, Alert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { BRAND, BRAND_SHADOW } from "../../theme/brand";
import AuthLayout from "./AuthLayout";
import { forgotPassword, ApiError } from "../../lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "&.Mui-focused fieldset": { borderColor: BRAND.primary },
    },
    "& label.Mui-focused": { color: BRAND.primary },
};

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!EMAIL_RE.test(email)) {
            setError("Enter a valid email");
            return;
        }
        setError(null);

        setSubmitting(true);
        setServerError(null);
        try {
            // The backend always returns the same generic message here,
            // whether or not the email is registered — that's intentional, so
            // this form can't be used to check which emails have accounts.
            await forgotPassword({ email: email.trim().toLowerCase() });
            setSubmitted(true);
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
            eyebrow="CLOUD MANAGED · RESET PASSWORD"
            title="Forgot your password?"
            subtitle="Enter your account email and we'll send you a link to set a new password."
            maxWidth="xs"
        >
            <Typography sx={{ fontFamily: '"Sora","Inter",sans-serif', fontWeight: 800, fontSize: 24, color: BRAND.ink }}>
                Reset password
            </Typography>
            <Typography sx={{ mt: 0.8, fontSize: 14, color: BRAND.muted }}>
                Remembered it after all?{" "}
                <Box component={RouterLink} to="/auth/login" sx={{ color: BRAND.primary, fontWeight: 700 }}>
                    Back to log in
                </Box>
            </Typography>

            {submitted ? (
                <Alert severity="success" sx={{ borderRadius: "10px", mt: 3 }}>
                    If an account exists for that email, we've sent password reset instructions.
                    The link is valid for 30 minutes.
                </Alert>
            ) : (
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} noValidate>
                    <Stack spacing={2.5}>
                        {serverError && <Alert severity="error" sx={{ borderRadius: "10px" }}>{serverError}</Alert>}

                        <TextField
                            label="Work email"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError(null);
                            }}
                            error={!!error}
                            helperText={error}
                            fullWidth
                            sx={inputSx}
                            autoFocus
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
                            {submitting ? "Sending…" : "Send reset link"}
                        </Button>
                    </Stack>
                </Box>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;