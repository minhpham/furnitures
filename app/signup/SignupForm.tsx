"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useSignup } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";

// ── Inline SVG icons ─────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-125.8c-43-81.9-83.6-209.2-83.6-330.4 0-199.3 132.3-304.8 262.3-304.8 64.4 0 118.1 42.4 157.9 42.4 37.5 0 96.9-45 169.1-45 34.1 0 105 7.8 162 65.4zM546.4 167.3c26.3-34.7 44.9-83.2 44.9-131.7 0-6.8-.6-13.6-1.9-19.1-42.3 1.9-91.9 28.2-122.7 65.4-24.9 30-49.3 79.9-49.3 130.9 0 7.1 1.3 14.1 1.9 16.4 3.2.6 8.4 1.3 13.6 1.3 37.6 0 87.8-25.2 113.5-63.2z" />
    </svg>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type FieldErrors = Partial<Record<keyof FormFields | "terms", string>>;

// ── Component ────────────────────────────────────────────────────────────────

export function SignupForm() {
  const { mutate: signup, isPending, error } = useSignup();

  const [fields, setFields] = useState<FormFields>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Derive API error message
  const apiErrorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "Something went wrong. Please try again."
        : null;

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!fields.firstName.trim()) errors.firstName = "First name is required";
    if (!fields.lastName.trim()) errors.lastName = "Last name is required";
    if (!fields.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errors.email = "Enter a valid email address";
    }
    if (!fields.password) {
      errors.password = "Password is required";
    } else if (fields.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!agreedToTerms) errors.terms = "You must agree to the terms";
    return errors;
  }

  function handleChange(field: keyof FormFields) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    signup(fields);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h1
          className="text-[36px] leading-tight text-black"
          style={{ fontFamily: "Instrument Serif", fontStyle: "italic" }}
        >
          Create Account
        </h1>
        <p className="text-sm text-[#888888]" style={{ fontFamily: "Inter" }}>
          Start your journey with Milan
        </p>
      </div>

      {/* API Error Banner */}
      {apiErrorMessage && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm" style={{ fontFamily: "Inter" }}>
          {apiErrorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="First Name" error={fieldErrors.firstName}>
            <input
              type="text"
              value={fields.firstName}
              onChange={handleChange("firstName")}
              placeholder="John"
              className={inputCls(!!fieldErrors.firstName)}
            />
          </FieldGroup>
          <FieldGroup label="Last Name" error={fieldErrors.lastName}>
            <input
              type="text"
              value={fields.lastName}
              onChange={handleChange("lastName")}
              placeholder="Doe"
              className={inputCls(!!fieldErrors.lastName)}
            />
          </FieldGroup>
        </div>

        {/* Email */}
        <FieldGroup label="Email Address" error={fieldErrors.email}>
          <input
            type="email"
            value={fields.email}
            onChange={handleChange("email")}
            placeholder="john.doe@example.com"
            className={inputCls(!!fieldErrors.email)}
          />
        </FieldGroup>

        {/* Password */}
        <FieldGroup label="Password" error={fieldErrors.password}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={fields.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              className={`${inputCls(!!fieldErrors.password)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#666666] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </FieldGroup>

        {/* Terms */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={agreedToTerms}
              onClick={() => {
                setAgreedToTerms((v) => !v);
                setFieldErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              className={`w-5 h-5 flex-shrink-0 border flex items-center justify-center transition-colors ${
                agreedToTerms
                  ? "bg-black border-black"
                  : fieldErrors.terms
                    ? "bg-white border-red-400"
                    : "bg-white border-[#CCCCCC]"
              }`}
            >
              {agreedToTerms && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
            <span className="text-xs text-[#666666]" style={{ fontFamily: "Inter" }}>
              I agree to the{" "}
              <Link href="/terms" className="text-black underline underline-offset-2">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-black underline underline-offset-2">
                Privacy Policy
              </Link>
            </span>
          </div>
          {fieldErrors.terms && (
            <p className="text-xs text-red-500 pl-8" style={{ fontFamily: "Inter" }}>{fieldErrors.terms}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-black text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#111111] active:bg-[#333333] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: "Inter" }}
        >
          {isPending ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Creating account…
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[#DDDDDD]" />
        <span className="text-xs text-[#AAAAAA]" style={{ fontFamily: "Inter" }}>or</span>
        <div className="flex-1 h-px bg-[#DDDDDD]" />
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <SocialButton icon={<MailIcon />} label="Google" onClick={() => {}} />
        <SocialButton icon={<AppleIcon />} label="Apple" onClick={() => {}} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-1">
        <span className="text-sm text-[#666666]" style={{ fontFamily: "Inter" }}>
          Already have an account?
        </span>
        <Link
          href="/login"
          className="text-sm font-medium text-black hover:underline underline-offset-2"
          style={{ fontFamily: "Inter" }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-black" style={{ fontFamily: "Inter" }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500" style={{ fontFamily: "Inter" }}>{error}</p>
      )}
    </div>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-12 flex items-center justify-center gap-2 border border-[#DDDDDD] bg-white text-sm text-black hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors text-[#666666]"
      style={{ fontFamily: "Inter" }}
    >
      {icon}
      <span className="text-black">{label}</span>
    </button>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full h-12 px-4 bg-white text-sm text-black",
    "border placeholder:text-[#AAAAAA]",
    "focus:outline-none focus:border-black transition-colors",
    hasError ? "border-red-400" : "border-[#CCCCCC]",
  ].join(" ");
}
