import { pb } from '../../../shared/api/pocketbase'
import type { Doctor } from '../model/types'
import type { DoctorRecord } from './types'

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => typeof item === 'string')
  )
}

export function mapDoctor(record: DoctorRecord): Doctor {
  const specialty = record.expand?.specialty

  if (!specialty) {
    throw new Error(`Specialty is missing for doctor ${record.id}`)
  }

  return {
    id: record.id,
    fullName: record.full_name,
    specialty,
    photo: record.photo ? pb.files.getURL(record, record.photo) : null,
    experienceYears: record.experience_years,
    education: isStringArray(record.education) ? record.education : [],
    patientsCount: record.patients_count,
    rating: record.rating,
    price: record.price,
    clinic: record.clinic,
    city: record.city,
    about: record.about,
  }
}
