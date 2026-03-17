'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { logout } from '@/app/actions/auth';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`text-[#888888] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
      <polyline points='6 9 12 15 18 9' />
    </svg>
  );
}

export function UserMenu({ user }: { user: UserData }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = getInitials(user.firstName, user.lastName);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div ref={containerRef} className='relative'>
      {/* Trigger */}
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup='true'
        className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
        {/* Avatar with initials */}
        <div className='w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0'>
          <span
            className='text-white text-sm font-medium leading-none'
            style={{ fontFamily: 'Inter' }}>
            {initials}
          </span>
        </div>

        {/* Full name */}
        <span
          className='text-sm font-medium text-black'
          style={{ fontFamily: 'Inter' }}>
          {fullName}
        </span>

        <ChevronIcon open={open} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className='absolute right-0 top-[calc(100%+10px)] w-56 bg-white border border-[#EEEEEE] shadow-lg z-50'>
          {/* User info header */}
          <div className='px-4 py-3 border-b border-[#EEEEEE]'>
            <p
              className='text-sm font-medium text-black truncate'
              style={{ fontFamily: 'Inter' }}>
              {fullName}
            </p>
            <p
              className='text-xs text-[#888888] truncate mt-0.5'
              style={{ fontFamily: 'Inter' }}>
              {user.email}
            </p>
          </div>

          {/* Navigation items */}
          <div className='py-1'>
            <DropdownLink href='/dashboard' onClick={() => setOpen(false)}>
              Dashboard
            </DropdownLink>
            <DropdownLink href='/profile' onClick={() => setOpen(false)}>
              Profile
            </DropdownLink>
            <DropdownLink href='/orders' onClick={() => setOpen(false)}>
              My Orders
            </DropdownLink>
          </div>

          {/* Logout */}
          <div className='border-t border-[#EEEEEE] py-1'>
            <form action={logout}>
              <button
                type='submit'
                className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#FFF5F5] transition-colors'
                style={{ fontFamily: 'Inter' }}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className='block px-4 py-2 text-sm text-[#333333] hover:bg-[#F5F5F5] transition-colors'
      style={{ fontFamily: 'Inter' }}>
      {children}
    </Link>
  );
}
