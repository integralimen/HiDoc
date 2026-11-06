import { Link, useParams } from 'react-router'

import { useGetDoctorQuery } from '../../entities/doctor/api/doctorApi'
import { Button } from '../../shared/ui/Button/Button'
import styles from './DoctorPage.module.css'

export function DoctorPage() {
  const { doctorId = '' } = useParams()

  const {
    currentData: doctor,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetDoctorQuery(doctorId, { skip: !doctorId })

  if (isFetching) {
    return <p role="status">Loading doctor...</p>
  }

  if (
    !doctorId ||
    (isError && error && 'status' in error && error.status === 404)
  ) {
    return (
      <main>
        <h1>Doctor not found</h1>
        <Link to="/doctors">Back to doctors</Link>
      </main>
    )
  }

  if (isError) {
    return (
      <main role="alert">
        <p>Unable to load doctor. Please try again.</p>
        <Button onClick={() => void refetch()}>Try again</Button>
      </main>
    )
  }

  if (!doctor) return null

  return (
    <main className={styles.page}>
      <Link to="/doctors">Back to doctors</Link>

      <article className={styles.profile}>
        <div className={styles.hero}>
          <p className={styles.heading}>Doctor Detail</p>

          {doctor.photo ? (
            <img
              className={styles.photo}
              src={doctor.photo}
              alt={`Dr. ${doctor.fullName}`}
              width={360}
              height={360}
            />
          ) : (
            <div className={styles.avatar} aria-hidden="true">
              {doctor.fullName
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')}
            </div>
          )}

          <dl className={styles.details}>
            <div>
              <dt>Experience</dt>
              <dd>{doctor.experienceYears} years</dd>
            </div>

            <div>
              <dt>Rating</dt>
              <dd>{doctor.rating.toFixed(1)} / 5</dd>
            </div>

            {doctor.patientsCount !== null && (
              <div>
                <dt>Patients</dt>
                <dd>{doctor.patientsCount}+</dd>
              </div>
            )}
          </dl>
        </div>

        <div className={styles.content}>
          <header>
            <h1 className={styles.name}>Dr. {doctor.fullName}</h1>
            <p className={styles.specialty}>{doctor.specialty.name}</p>
            <p>
              {doctor.clinic} · {doctor.city}
            </p>
          </header>

          <section>
            <h2>About doctor</h2>
            <p>{doctor.about || 'No description available.'}</p>
          </section>

          <section>
            <h2>Education</h2>
            {doctor.education.length ? (
              <ul>
                {doctor.education.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No education information available.</p>
            )}
          </section>

          <p className={styles.price}>
            {doctor.price} <span>PLN / visit</span>
          </p>
        </div>
      </article>
    </main>
  )
}
