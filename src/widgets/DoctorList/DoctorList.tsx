import type { Doctor } from '../../entities/doctor/model/types'
import { DoctorCard } from '../../entities/doctor/ui/DoctorCard/DoctorCard'
import styles from './DoctorList.module.css'

type DoctorListProps = {
  doctors: Doctor[]
}

export function DoctorList({ doctors }: DoctorListProps) {
  if (doctors.length === 0) {
    return <p>No doctors found. Try changing your search criteria.</p>
  }

  return (
    <ul className={styles.list}>
      {doctors.map((doctor) => (
        <li key={doctor.id}>
          <DoctorCard doctor={doctor} />
        </li>
      ))}
    </ul>
  )
}
