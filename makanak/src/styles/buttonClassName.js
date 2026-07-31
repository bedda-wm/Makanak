const variantClasses = {
  primary:
    'bg-primary text-foreground shadow-sm hover:brightness-95 active:brightness-90',
  accent:
    'bg-accent text-white shadow-sm hover:brightness-105 active:brightness-95',
  outline:
    'border border-border bg-surface text-foreground hover:bg-background',
  ghost: 'text-foreground hover:bg-background',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2.5 text-sm font-medium rounded-lg',
  lg: 'px-6 py-3 text-base font-medium rounded-lg',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 transition-[filter,box-shadow,background-color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50'

/**
 * Shared classes for `<Link>` or `<a>` that should look like a button.
 */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className = '',
} = {}) {
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()
}
