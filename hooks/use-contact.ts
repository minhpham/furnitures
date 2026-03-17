'use client';

import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@/lib/api';

export interface ContactPayload {
  fullname: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

async function submitContact(payload: ContactPayload): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message ?? res.statusText;
    throw new ApiError(res.status, message);
  }
}

export function useSubmitContact() {
  return useMutation({ mutationFn: submitContact });
}
