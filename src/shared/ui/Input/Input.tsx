import type { ComponentPropsWithRef } from 'react'

import styles from './Input.module.css'

type InputProps = ComponentPropsWithRef<'input'>

export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      {...props}
      type={type}
      className={`${styles.input} ${className ?? ''}`}
    />
  )
}
