"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

// ── Login ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({ message: res.statusText }));
      if (!res.ok) throw new ApiError(res.status, json.message ?? "Login failed");
      return json as LoginResponse;
    },
    onSuccess: () => {
      router.push("/");
    },
  });
}

// ── Signup ────────────────────────────────────────────────────────────────────

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupPayload) =>
      api.post<SignupResponse>("/api/v1/auth/signup", data),
    onSuccess: () => {
      router.push("/");
    },
  });
}
