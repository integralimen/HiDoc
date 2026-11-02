import styles from './DoctorsPage.module.css'
import { DoctorFilters } from '../../widgets/DoctorFilters/DoctorFilters'
import { DoctorList } from '../../widgets/DoctorList/DoctorList'
import { useGetDoctorsQuery } from '../../entities/doctor/api/doctorApi'
import { Button } from '../../shared/ui/Button/Button'
import { Skeleton } from '../../shared/ui/Skeleton/Skeleton'

export function DoctorsPage() {
  const { data, isLoading, isError, refetch } = useGetDoctorsQuery(1)
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

        {isLoading ? (
          <div role="status" aria-label="Loading doctors">
            <div className={styles.loadingGrid}>
              {Array.from({ length: 9 }, (_, index) => (
                <Skeleton key={index} className={styles.cardSkeleton} />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div role="alert">
            <p>Unable to load doctors. Please try again.</p>

            <Button onClick={() => void refetch()}>Try again</Button>
          </div>
        ) : data ? (
          <>
            <p className={styles.resultsCount}>
              {data.totalItems} doctors found
            </p>

            <DoctorList doctors={data.items} />
          </>
        ) : null}
      </section>
    </main>
  )
}
