import { Button } from '../../shared/ui/Button/Button'
import { CitySearch } from '../../features/doctor-filters/ui/CitySearch'
import { useQueryParams } from '../../shared/lib/hooks/useQueryParams'

import { SpecialtySearch } from '../../features/doctor-filters/ui/SpecialtySearch'
import styles from './DoctorFilters.module.css'

export function DoctorFilters() {
  const { getParam, updateParams } = useQueryParams<
    'q' | 'specialty' | 'city' | 'page'
  >()
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        function getValue(name: string): string {
          const value = formData.get(name)
          return typeof value === 'string' ? value.trim() : ''
        }

        updateParams({
          q: getValue('q'),
          specialty: getValue('specialty'),
          city: getValue('city'),
          page: '',
        })
      }}
    >
      <SpecialtySearch />

      <CitySearch key={getParam('city')} />

      <Button type="submit">Search</Button>
    </form>
  )
}
