import type { ComponentPropsWithoutRef } from 'react'

import styles from './Skeleton.module.css'

type SkeletonProps = ComponentPropsWithoutRef<'div'>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      className={`${styles.skeleton} ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}
