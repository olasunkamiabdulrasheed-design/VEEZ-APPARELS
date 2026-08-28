import { ReactNode } from 'react'
import clsx from 'clsx'

interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
  icon?: ReactNode
  multiline?: boolean
  rows?: number
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  label,
  required,
  disabled,
  className,
  icon,
  multiline = false,
  rows = 4,
}: InputProps) {
  const baseStyles = 'w-full px-4 py-3 border border-veez-gray-300 rounded focus:outline-none focus:border-veez-black focus:ring-1 focus:ring-veez-black transition-colors'

  const styles = clsx(
    baseStyles,
    disabled && 'bg-veez-gray-100 text-veez-gray-500 cursor-not-allowed',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    icon && 'pl-10',
    className
  )

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-veez-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-veez-gray-400">{icon}</div>}
        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            rows={rows}
            className={styles}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={styles}
          />
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
