/**
 * Thin API client for the AgriQR v2 backend (FastAPI + PostgreSQL).
 * Base URL comes from REACT_APP_API_URL, falling back to the local dev
 * server (see backend/README.md).
 *
 * This file currently only covers what's built so far: company
 * registration + session storage. Login, plan selection, billing, etc.
 * get added here as those endpoints land.
 */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(status: number, detail: unknown, message?: string) {
    super(message || "Request failed");
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message =
      body?.detail && typeof body.detail === "string" ? body.detail : "Something went wrong. Please try again.";
    throw new ApiError(res.status, body?.detail, message);
  }

  return body as T;
}

// ---------------------------------------------------------------------
// Company registration
// ---------------------------------------------------------------------
export type OnboardingState =
  | "awaiting_plan"
  | "trialing"
  | "trial_expired"
  | "subscribed"
  | "self_host_requested";

/**
 * Where a signed-in user should land right after login/registration/plan
 * changes, based purely on their company's onboarding_state. Centralized
 * here so Login, CompanyRegister, PlanChoice, and RequireAuth all agree.
 */
export function resolvePostAuthRoute(company: AuthResponse["company"]): string {
  switch (company.onboarding_state) {
    case "trialing":
    case "subscribed":
      return "/dashboard/overview";
    case "self_host_requested":
      return "/onboarding/self-host";
    case "awaiting_plan":
    case "trial_expired":
    default:
      return "/onboarding/plan";
  }
}

export interface AddressInput {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface RegisterCompanyPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  company_name: string;
  logo_url?: string;
  address: AddressInput;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export function loginUser(payload: LoginPayload) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
  user: AuthResponse["user"];
}

export function changePassword(payload: ChangePasswordPayload) {
  const session = getSession();
  return request<ChangePasswordResponse>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
  });
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return request<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export function resetPassword(payload: ResetPasswordPayload) {
  return request<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function authHeaders(): Record<string, string> {
  const session = getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

export interface TrialUsage {
  seconds_remaining: number | null;
  products_used: number;
  products_cap: number;
  static_qr_used: number;
  static_qr_cap: number | null;
  dynamic_qr_used: number;
  dynamic_qr_cap: number | null;
  limiting_factor: "time" | "products" | "static_qr" | "dynamic_qr" | null;
  is_exhausted: boolean;
}

export interface PlanResponse {
  company: AuthResponse["company"];
  trial_usage?: TrialUsage | null;
}

export function startTrial() {
  return request<PlanResponse>("/plan/start-trial", {
    method: "POST",
    headers: authHeaders(),
  });
}

export function subscribePlan() {
  return request<PlanResponse>("/plan/subscribe", {
    method: "POST",
    headers: authHeaders(),
  });
}

export function getPlanStatus() {
  return request<PlanResponse>("/plan/status", {
    method: "GET",
    headers: authHeaders(),
  });
}

export interface SelfHostRequestPayload {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  team_size?: string;
  infrastructure_preference?: string;
  message?: string;
}

export interface SelfHostRequestResponse {
  company: AuthResponse["company"];
  message: string;
}

export function requestSelfHost(payload: SelfHostRequestPayload) {
  return request<SelfHostRequestResponse>("/plan/self-host-request", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authHeaders(),
  });
}

export function updateSessionCompany(company: AuthResponse["company"]) {
  const session = getSession();
  if (session) {
    session.company = company;
    saveSession(session);
  }
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  company: {
    id: number;
    name: string;
    onboarding_state: OnboardingState;
    trial_ends_at: string | null;
    logo_url: string | null;
  };
  user: {
    id: number;
    email: string;
    full_name: string;
    role: "subscriber";
    must_change_password: boolean;
  };
}

export function registerCompany(payload: RegisterCompanyPayload) {
  return request<AuthResponse>("/auth/company/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

const SESSION_KEY = "agriqr_auth";

export function saveSession(auth: AuthResponse) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(auth));
}

export function markPasswordChanged() {
  const session = getSession();
  if (session) {
    session.user.must_change_password = false;
    saveSession(session);
  }
}

export function getSession(): AuthResponse | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}