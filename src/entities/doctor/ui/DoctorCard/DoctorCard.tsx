import { Link } from 'react-router'

import { Card } from '../../../../shared/ui/Card/Card'
import type { Doctor } from '../../model/types'
import styles from './DoctorCard.module.css'

type DoctorCardProps = {
  doctor: Doctor
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const initials = doctor.fullName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        {doctor.photo ? (
          <img
            className={styles.photo}
            src={doctor.photo}
            alt=""
            width={72}
            height={72}
            loading="lazy"
          />
        ) : (
          <div className={styles.avatar} aria-hidden="true">
            {initials}
          </div>
        )}

        <div className={styles.identify}>
          <h3 className={styles.name}> {doctor.fullName}</h3>
          <p className={styles.specialty}>{doctor.specialty.name}</p>
        </div>
      </div>

      <p className={styles.clinic}>{doctor.clinic}</p>
      <p className={styles.city}>{doctor.city}</p>

      <dl className={styles.details}>
        <div>
          <dt>Experience</dt>
          <dd>{doctor.experienceYears} years</dd>
        </div>

        <div>
          <dt>Rating</dt>
          <dd>{doctor.rating.toFixed(1)} / 5</dd>
        </div>
      </dl>

      <div className={styles.footer}>
        <p className={styles.price}>
          {doctor.price} <span>PLN / visit</span>
        </p>

        <Link className={styles.profileLink} to={`/doctors/${doctor.id}`}>
          View profile
          <span className={styles.visuallyHidden}>
            {' '}
            of Dr. {doctor.fullName}
          </span>
        </Link>
      </div>
    </Card>
  )
}
