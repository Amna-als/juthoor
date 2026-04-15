import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

export function StyledInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-[#d9d2c3] bg-white px-4 py-3 text-[#1f2937] outline-none placeholder:text-[#9ca3af] focus:border-[#556b2f]"
    />
  )
}

export function StyledTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className="w-full rounded-2xl border border-[#d9d2c3] bg-white px-4 py-3 text-[#1f2937] outline-none placeholder:text-[#9ca3af] focus:border-[#556b2f]"
    />
  )
}

export function StyledSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border border-[#d9d2c3] bg-white px-4 py-3 text-[#1f2937] outline-none focus:border-[#556b2f]"
    />
  )
}

export function StyledButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-2xl bg-[#556b2f] px-4 py-3 font-medium text-white transition hover:bg-[#465926] disabled:opacity-50"
    >
      {children}
    </button>
  )
}