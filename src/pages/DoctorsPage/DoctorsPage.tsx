import styles from './DoctorsPage.module.css'
import { DoctorFilters } from '../../widgets/DoctorFilters/DoctorFilters'
import { doctors } from '../../entities/doctor/model/mocks'
import { DoctorList } from '../../widgets/DoctorList/DoctorList'

export function DoctorsPage() {
  return (
    <main>
      <section className={styles.intro}>
        <div>
          <h1 className={styles.title}>Find your doctor</h1>
          <p className={styles.description}>
            {' '}
            Browse specialists and book an appointment at a time that works for
            you.
          </p>
        </div>
      </section>
      <DoctorFilters />

      <section className={styles.results} aria-labelledby="doctors-heading">
        <h2 id="doctors-heading" className={styles.resultsTitle}>
          Doctors
        </h2>

        <p className={styles.resultsCount}>
          {doctors.length} doctors available
        </p>

        <DoctorList doctors={doctors} />
      </section>
    </main>
  )
}
