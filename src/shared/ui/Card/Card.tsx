import type { ComponentPropsWithoutRef } from 'react'

import styles from './Card.module.css'

type CardProps = ComponentPropsWithoutRef<'div'>

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div {...props} className={`${styles.card} ${className ?? ''}`}>
      {children}
    </div>
  )
}
