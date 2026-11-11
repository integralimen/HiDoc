import type { ReactNode } from 'react'

import { AuthContext } from '../../entities/user/model/AuthContext'
import { useAuthSnapshot } from '../../entities/user/model/useAuthSnapshot'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthSnapshot()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
