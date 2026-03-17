'use client';

import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSubmitContact } from '@/hooks/use-contact';

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const schema = yup.object({
  fullname: yup.string().trim().required('Full name is required'),
  email: yup
    .string()
    .trim()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .trim()
    .matches(/^[+\d\s()\-]*$/, {
      message: 'Please enter a valid phone number',
      excludeEmptyString: true,
    }),
  subject: yup
    .string()
    .required('Please select a subject')
    .oneOf(
      [
        'General Inquiry',
        'Custom Order',
        'Delivery & Returns',
        'Product Information',
        'Other',
      ],
      'Please select a valid subject',
    ),
  message: yup
    .string()
    .trim()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = yup.InferType<typeof schema>;

// ---------------------------------------------------------------------------
// Reusable Input
// ---------------------------------------------------------------------------

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  showRequired?: boolean;
}

function FormInput({ id, label, error, showRequired, ...rest }: InputProps) {
  return (
    <div className='flex flex-col gap-2'>
      <label
        htmlFor={id}
        className='font-inter text-[12px] font-medium text-[#333333] tracking-[0.5px] uppercase'>
        {label}
        {showRequired && <span className='text-[#9A6B4B] ml-1'>*</span>}
      </label>
      <input
        id={id}
        {...rest}
        className={`
          w-full bg-white border px-4 py-3
          font-inter text-[14px] text-[#171717] placeholder:text-[#BBBBBB]
          focus:outline-none transition-colors duration-200
          ${error ? 'border-red-400 focus:border-red-500' : 'border-[#E5E5E5] focus:border-[#171717]'}
        `}
      />
      {error && <p className='font-inter text-[12px] text-red-500'>{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contact Form (Client Component)
// ---------------------------------------------------------------------------

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync, isPending, isError, error, reset: resetMutation } = useSubmitContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema) as Resolver<ContactFormData>,
    mode: 'onTouched',
  });

  async function onSubmit(data: ContactFormData) {
    resetMutation();
    try {
      await mutateAsync(data);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 6000);
    } catch {
      // error is captured in mutation's `error` state — no local state needed
    }
  }

  return (
    <div className='bg-white border border-[#E5E5E5] p-8 md:p-10'>
      <div className='flex flex-col gap-1 mb-8'>
        <h2 className='font-instrument text-[28px] italic font-normal text-black'>
          Send a Message
        </h2>
        <p className='font-inter text-[13px] text-[#888888]'>
          Fields marked with <span className='text-[#9A6B4B]'>*</span> are
          required.
        </p>
      </div>

      {submitted ? (
        <div className='flex flex-col items-center justify-center gap-4 py-16 text-center'>
          <div className='w-12 h-12 flex items-center justify-center bg-black text-white'>
            <svg
              width='22'
              height='22'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'>
              <polyline points='20 6 9 17 4 12' />
            </svg>
          </div>
          <h3 className='font-instrument text-[24px] italic font-normal text-black'>
            Message Sent
          </h3>
          <p className='font-inter text-[14px] text-[#666666] max-w-[320px]'>
            Thank you for reaching out. A member of our team will be in touch
            with you within one business day.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-6'>
          {/* Row: Full Name + Email */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <FormInput
              id='fullname'
              label='Full Name'
              showRequired
              placeholder='Jane Smith'
              error={errors.fullname?.message}
              {...register('fullname')}
            />
            <FormInput
              id='email'
              label='Email Address'
              showRequired
              type='email'
              placeholder='jane@example.com'
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          {/* Row: Phone + Subject */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <FormInput
              id='phone'
              label='Phone Number'
              type='tel'
              placeholder='+1 (555) 000-0000'
              error={errors.phone?.message}
              {...register('phone')}
            />

            {/* Subject dropdown */}
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='subject'
                className='font-inter text-[12px] font-medium text-[#333333] tracking-[0.5px] uppercase'>
                Subject <span className='text-[#9A6B4B]'>*</span>
              </label>
              <select
                id='subject'
                {...register('subject')}
                className={`
                  w-full bg-white border px-4 py-3
                  font-inter text-[14px] text-[#171717]
                  focus:outline-none transition-colors duration-200
                  appearance-none cursor-pointer
                  bg-[image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888888%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                  bg-no-repeat bg-[right_12px_center]
                  ${errors.subject ? 'border-red-400 focus:border-red-500' : 'border-[#E5E5E5] focus:border-[#171717]'}
                `}>
                <option value=''>Select a topic…</option>
                <option value='General Inquiry'>General Inquiry</option>
                <option value='Custom Order'>Custom Order</option>
                <option value='Delivery & Returns'>
                  Delivery &amp; Returns
                </option>
                <option value='Product Information'>Product Information</option>
                <option value='Other'>Other</option>
              </select>
              {errors.subject && (
                <p className='font-inter text-[12px] text-red-500'>
                  {errors.subject.message}
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className='flex flex-col gap-2'>
            <label
              htmlFor='message'
              className='font-inter text-[12px] font-medium text-[#333333] tracking-[0.5px] uppercase'>
              Message <span className='text-[#9A6B4B]'>*</span>
            </label>
            <textarea
              id='message'
              rows={6}
              placeholder='Tell us about your project or inquiry…'
              {...register('message')}
              className={`
                w-full bg-white border px-4 py-3 resize-none
                font-inter text-[14px] text-[#171717] placeholder:text-[#BBBBBB]
                focus:outline-none transition-colors duration-200
                ${errors.message ? 'border-red-400 focus:border-red-500' : 'border-[#E5E5E5] focus:border-[#171717]'}
              `}
            />
            {errors.message && (
              <p className='font-inter text-[12px] text-red-500'>
                {errors.message.message}
              </p>
            )}
          </div>

          {/* API error */}
          {isError && (
            <div className='flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3'>
              <svg
                className='shrink-0 mt-0.5 text-red-500'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden='true'
              >
                <circle cx='12' cy='12' r='10' />
                <line x1='12' y1='8' x2='12' y2='12' />
                <line x1='12' y1='16' x2='12.01' y2='16' />
              </svg>
              <p className='font-inter text-[13px] text-red-700 leading-relaxed'>
                {error instanceof Error
                  ? error.message
                  : 'Something went wrong. Please try again.'}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type='submit'
            disabled={isPending}
            className='
              w-full sm:w-auto sm:self-start inline-flex items-center justify-center gap-2
              bg-black text-white font-inter text-[13px] font-medium tracking-[0.5px]
              px-10 py-4 uppercase
              hover:bg-[#222222] active:bg-[#444444] transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            '>
            {isPending && (
              <svg
                className='animate-spin h-4 w-4 shrink-0'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                />
              </svg>
            )}
            {isPending ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
