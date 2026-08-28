import { ReactNode } from 'react'
import clsx from 'clsx'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  href?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className,
  type = 'button',
  href,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded transition-colors duration-200'

  const variants = {
    primary: 'bg-veez-black text-white hover:bg-veez-gray-900 disabled:bg-veez-gray-400',
    secondary: 'border-2 border-veez-black text-veez-black hover:bg-veez-gray-50 disabled:border-veez-gray-300 disabled:text-veez-gray-300',
    ghost: 'text-veez-black hover:bg-veez-gray-100 disabled:text-veez-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const styles = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'cursor-not-allowed opacity-60',
    className
  )

  if (href) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={styles}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
