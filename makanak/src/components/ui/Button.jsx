import { buttonClassName } from '../../styles/buttonClassName'

/**
 * @param {object} props
 * @param {'primary' | 'accent' | 'outline' | 'ghost'} [props.variant]
 * @param {'sm' | 'md' | 'lg'} [props.size]
 * @param {string} [props.className]
 * @param {import('react').ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
