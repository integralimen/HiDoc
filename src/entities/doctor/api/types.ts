import type { Specialty } from '../model/specialties'

export type DoctorRecord = {
  id: string
  collectionId: string
  collectionName: string
  full_name: string
  specialty: string
  photo: string
  experience_years: number
  education: unknown
  patients_count: number
  rating: number
  price: number
  clinic: string
  city: string
  about: string
  expand?: {
    specialty?: Specialty
  }
}
