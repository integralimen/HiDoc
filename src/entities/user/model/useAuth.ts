import { useSyncExternalStore } from 'react'

import { pb } from '../../../shared/api/pocketbase'
import type { User } from './types'

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'email' in value &&
    typeof value.email === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'phone' in value &&
    typeof value.phone === 'string' &&
    'avatar' in value &&
    typeof value.avatar === 'string' &&
    'verified' in value &&
    typeof value.verified === 'boolean' &&
    'role' in value &&
    (value.role === 'patient' ||
      value.role === 'doctor' ||
      value.role === 'admin')
  )
}

function subscribe(onChange: () => void) {
  return pb.authStore.onChange(() => onChange())
}

function getSnapshot(): string | null {
  if (!pb.authStore.isValid) {
    return null
  }

  const record: unknown = pb.authStore.record

  return isUser(record) ? JSON.stringify(record) : null
}

export function useAuth() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot)

  const record: unknown = snapshot ? JSON.parse(snapshot) : null
  const user = isUser(record) ? record : null

  return {
    user,
    isAuthenticated: user !== null,
  }
}
