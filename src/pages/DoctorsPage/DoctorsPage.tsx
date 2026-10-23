import styles from './DoctorsPage.module.css'
import { DoctorFilters } from '../../widgets/DoctorFilters/DoctorFilters'

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
    </main>
  )
}
