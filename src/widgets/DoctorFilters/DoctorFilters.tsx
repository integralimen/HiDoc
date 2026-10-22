import { CitySearch } from '../../features/doctor-filters/ui/CitySearch'
import { useSearchParams } from 'react-router'

import { SpecialtySearch } from '../../features/doctor-filters/ui/SpecialtySearch'
import styles from './DoctorFilters.module.css'

export function DoctorFilters() {
  const [, setSearchParams] = useSearchParams()

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const params = new URLSearchParams()

        for (const key of ['q', 'specialty', 'city']) {
          const value = formData.get(key)

          if (typeof value === 'string' && value.trim()) {
            params.set(key, value.trim())
          }
        }

        setSearchParams(params)
      }}
    >
      <SpecialtySearch />

      <CitySearch />

      <button className={styles.searchButton} type="submit">
        Search
      </button>
    </form>
  )
}
