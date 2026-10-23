import type { ComponentPropsWithoutRef } from 'react'
import styles from './Button.module.css'

type ButtonProps = ComponentPropsWithoutRef<'button'>

export function Button({
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${styles.button} ${className ?? ''}`}
    >
      {children}
    </button>
  )
}
