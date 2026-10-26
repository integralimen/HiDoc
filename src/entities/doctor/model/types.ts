import type { Specialty } from './specialties'

export type Doctor = {
  id: string
  fullName: string
  specialty: Specialty
  photo: string | null
  experienceYears: number
  education: string[]
  patientsCount: number | null
  rating: number
  price: number
  clinic: string
  city: string
  about: string
}
