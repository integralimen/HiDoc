import { Link, useLocation, useParams } from 'react-router'

import { useGetDoctorQuery } from '../../entities/doctor/api/doctorApi'
import { Button } from '../../shared/ui/Button/Button'
import styles from './DoctorPage.module.css'
import { SlotCalendar } from '../../widgets/SlotCalendar/SlotCalendar'
import { useDispatch } from 'react-redux'
import { baseApi } from '../../shared/api/baseApi'

export function DoctorPage() {
  const dispatch = useDispatch()
  const { doctorId = '' } = useParams()
  const { search } = useLocation()
  const catalogUrl = `/doctors${search}`

  const {
    currentData: doctor,
    isFetching,
    isError,
    error,
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
        <Link to={catalogUrl}>Back to doctors</Link>
      </main>
    )
  }

  if (isError) {
    return (
      <main role="alert">
        <p>Unable to load doctor. Please try again.</p>
        <Button
          onClick={() => dispatch(baseApi.util.invalidateTags(['Doctors']))}
        >
          Try again
        </Button>
      </main>
    )
  }

  if (!doctor) return null

  return (
    <main className={styles.page}>
      <Link to={catalogUrl}>Back to doctors</Link>

      <article className={styles.profile}>
        <div className={styles.portrait}>
          {doctor.photo ? (
            <img
              className={styles.photo}
              src={doctor.photo}
              alt={`Dr. ${doctor.fullName}`}
              width={400}
              height={400}
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
        </div>

        <header className={styles.identity}>
          <p className={styles.specialty}>{doctor.specialty.name}</p>
          <h1 className={styles.name}>Dr. {doctor.fullName}</h1>
          <p className={styles.location}>
            {doctor.clinic} · {doctor.city}
          </p>

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
        </header>

        <div className={styles.biography}>
          <section>
            <h2>About doctor</h2>
            <p>{doctor.about || 'No description available.'}</p>
          </section>

          <section>
            <h2>Education</h2>
            {doctor.education.length ? (
              <ul className={styles.education}>
                {doctor.education.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No education information available.</p>
            )}
          </section>
        </div>

        <section className={styles.booking} aria-labelledby="booking-heading">
          <h2 id="booking-heading">Book an appointment</h2>
          <p className={styles.price}>
            {doctor.price} <span>PLN / visit</span>
          </p>

          <SlotCalendar key={doctor.id} doctorId={doctor.id} />
        </section>
      </article>
    </main>
  )
}
