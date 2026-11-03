export type UserRole = 'patient' | 'doctor' | 'admin'

export type User = {
  id: string
  email: string
  name: string
  phone: string
  avatar: string
  role: UserRole
  verified: boolean
}
