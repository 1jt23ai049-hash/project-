/**
 * API client for the superadmin console. Deliberately separate from
 * lib/api.ts and uses its own storage key (agriqr_admin_auth) so a
 * browser tab can stay logged into a company dashboard and the admin
 * console at the same time without either one logging the other out.
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

const SESSION_KEY = "agriqr_admin_auth";

export interface AdminOut {
    id: number;
    email: string;
    full_name: string;
}

export interface AdminAuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: "bearer";
    admin: AdminOut;
}

export function saveAdminSession(auth: AdminAuthResponse) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(auth));
}

export function getAdminSession(): AdminAuthResponse | null {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function clearAdminSession() {
    localStorage.removeItem(SESSION_KEY);
}

function authHeaders(): Record<string, string> {
    const session = getAdminSession();
    return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

export interface AdminLoginPayload {
    email: string;
    password: string;
}

export function adminLogin(payload: AdminLoginPayload) {
    return request<AdminAuthResponse>("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function getAdminMe() {
    return request<AdminOut>("/admin/me", { headers: authHeaders() });
}

// ---------------------------------------------------------------------
// Platform overview
// ---------------------------------------------------------------------
export interface PlatformOverview {
    total_companies: number;
    trialing_count: number;
    subscribed_count: number;
    trial_expired_count: number;
    self_host_pending_count: number;
    suspended_count: number;
    total_products: number;
    total_static_qr: number;
    total_dynamic_qr: number;
    total_batches: number;
    total_active_licenses: number;
}

export function getPlatformOverview() {
    return request<PlatformOverview>("/admin/overview", { headers: authHeaders() });
}

// ---------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------
export interface CompanySummary {
    id: number;
    name: string;
    email: string;
    onboarding_state: string;
    is_verified: boolean;
    account_status: "active" | "suspended";
    trial_ends_at: string | null;
    created_at: string;
    products_count: number;
    active_licenses_count: number;
    static_qr_count: number;
    dynamic_qr_count: number;
    batches_count: number;
}

export interface CompanyListResponse {
    items: CompanySummary[];
    total: number;
    page: number;
    page_size: number;
}

export function listCompanies(params: { q?: string; onboarding_state?: string; page?: number; page_size?: number } = {}) {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.onboarding_state) qs.set("onboarding_state", params.onboarding_state);
    if (params.page) qs.set("page", String(params.page));
    if (params.page_size) qs.set("page_size", String(params.page_size));
    const query = qs.toString();
    return request<CompanyListResponse>(`/admin/companies${query ? `?${query}` : ""}`, { headers: authHeaders() });
}

export interface AdminLicense {
    license_id: number;
    license_type: string;
    status: string;
    product_id: number | null;
    product_name: string | null;
    sku_code: string | null;
    starts_at: string | null;
    ends_at: string | null;
    static_qr_cap: number | null;
    static_qr_used: number;
    dynamic_qr_cap: number | null;
    dynamic_qr_used: number;
    created_at: string;
}

export interface AdminProduct {
    product_id: number;
    sku_code: string;
    name: string;
    category: string;
    is_active: boolean;
    created_at: string;
}

export interface AdminAddress {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface SelfHostRequest {
    request_id: number;
    company_id: number;
    company_name?: string | null;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    team_size?: string | null;
    infrastructure_preference?: string | null;
    message?: string | null;
    status: "new" | "contacted" | "closed";
    created_at: string;
    updated_at: string;
}

export interface CompanyDetail {
    id: number;
    name: string;
    email: string;
    mobile_number: string;
    onboarding_state: string;
    is_verified: boolean;
    account_status: "active" | "suspended";
    trial_ends_at: string | null;
    created_at: string;
    gst_number: string | null;
    pan_number: string | null;
    fco_license_number: string | null;
    address: AdminAddress | null;
    products_count: number;
    static_qr_count: number;
    dynamic_qr_count: number;
    batches_count: number;
    licenses: AdminLicense[];
    products: AdminProduct[];
    self_host_request: SelfHostRequest | null;
}

export function getCompanyDetail(companyId: number) {
    return request<CompanyDetail>(`/admin/companies/${companyId}`, { headers: authHeaders() });
}

export interface CompanyStatusUpdatePayload {
    is_verified?: boolean;
    account_status?: "active" | "suspended";
}

export function updateCompanyStatus(companyId: number, payload: CompanyStatusUpdatePayload) {
    return request<CompanySummary>(`/admin/companies/${companyId}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: authHeaders(),
    });
}

export interface LicenseUpdatePayload {
    static_qr_cap?: number;
    dynamic_qr_cap?: number;
    ends_at?: string;
    status?: "pending_assignment" | "active" | "expired" | "cancelled";
}

export function updateLicense(licenseId: number, payload: LicenseUpdatePayload) {
    return request<AdminLicense>(`/admin/licenses/${licenseId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: authHeaders(),
    });
}

// ---------------------------------------------------------------------
// Self-host requests
// ---------------------------------------------------------------------
export function listSelfHostRequests(statusFilter?: string) {
    const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
    return request<SelfHostRequest[]>(`/admin/self-host-requests${qs}`, { headers: authHeaders() });
}

export function updateSelfHostRequestStatus(requestId: number, statusValue: "new" | "contacted" | "closed") {
    return request<SelfHostRequest>(`/admin/self-host-requests/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: statusValue }),
        headers: authHeaders(),
    });
}