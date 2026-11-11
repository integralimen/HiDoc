import { createContext } from 'react'

import type { User } from './types'

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
