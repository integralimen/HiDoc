import styles from './DoctorsPage.module.css'
import { DoctorFilters } from '../../widgets/DoctorFilters/DoctorFilters'
import { DoctorList } from '../../widgets/DoctorList/DoctorList'
import { useGetDoctorsQuery } from '../../entities/doctor/api/doctorApi'
import { Button } from '../../shared/ui/Button/Button'
import { Skeleton } from '../../shared/ui/Skeleton/Skeleton'
import { useSearchParams } from 'react-router'

export function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const requestedPage = Number(searchParams.get('page') ?? 1)
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const {
    currentData: data,
    isFetching,
    isError,
    refetch,
  } = useGetDoctorsQuery({
    page,
    q: searchParams.get('q') ?? '',
    city: searchParams.get('city') ?? '',
    specialty: searchParams.get('specialty') ?? '',
  })

  function changePage(nextPage: number) {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous)
      params.set('page', String(nextPage))
      return params
    })
  }
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
      <DoctorFilters key={searchParams.toString()} />

      <section className={styles.results} aria-labelledby="doctors-heading">
        <h2 id="doctors-heading" className={styles.resultsTitle}>
          Doctors
        </h2>

        {isFetching ? (
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

            {data.totalPages > 1 && (
              <nav className={styles.pagination} aria-label="Catalog pages">
                <Button
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                >
                  Previous
                </Button>

                <span aria-live="polite">
                  Page {page} of {data.totalPages}
                </span>

                <Button
                  disabled={page >= data.totalPages}
                  onClick={() => changePage(page + 1)}
                >
                  Next
                </Button>
              </nav>
            )}
          </>
        ) : null}
      </section>
    </main>
  )
}
