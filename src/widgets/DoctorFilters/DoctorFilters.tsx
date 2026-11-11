import { Button } from '../../shared/ui/Button/Button'
import { CitySearch } from '../../features/doctor-filters/ui/CitySearch'
import { useQueryParams } from '../../shared/lib/hooks/useQueryParams'
import { Input } from '../../shared/ui/Input/Input'
import starIcon from '../../shared/assets/icons/star.svg'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../shared/lib/hooks/useDebounce'

import { SpecialtySearch } from '../../features/doctor-filters/ui/SpecialtySearch'
import styles from './DoctorFilters.module.css'

const sortOptions = [
  { value: '', label: 'Highest rating' },
  { value: 'priceAsc', label: 'Lowest price' },
  { value: 'priceDesc', label: 'Highest price' },
]

function RatingStars({ count }: { count: number }) {
  return (
    <span className={styles.stars} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <img key={index} src={starIcon} alt="" className={styles.star} />
      ))}
    </span>
  )
}

export function DoctorFilters() {
  const { getParam, updateParams } = useQueryParams<
    'q' | 'specialty' | 'city' | 'page' | 'maxPrice' | 'minRating' | 'sort'
  >()
  const requestedRating = getParam('minRating')
  const minRating = /^[1-5]$/.test(requestedRating) ? requestedRating : ''
  const priceFromUrl = getParam('maxPrice')
  const [price, setPrice] = useState(priceFromUrl)
  const [previousPrice, setPreviousPrice] = useState(priceFromUrl)

  if (priceFromUrl !== previousPrice) {
    setPreviousPrice(priceFromUrl)
    setPrice(priceFromUrl)
  }

  const debouncedPrice = useDebounce(price, 300)

  useEffect(() => {
    if (price !== debouncedPrice || debouncedPrice === priceFromUrl) {
      return
    }

    if (
      debouncedPrice &&
      (!Number.isFinite(Number(debouncedPrice)) || Number(debouncedPrice) < 0)
    ) {
      return
    }

    updateParams({ maxPrice: debouncedPrice, page: '' }, true)
  }, [price, debouncedPrice, priceFromUrl, updateParams])
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
          maxPrice: getValue('maxPrice'),
          page: '',
        })
      }}
    >
      <SpecialtySearch />

      <CitySearch />
      <Button type="submit">Search</Button>

      <details className={styles.moreFilters}>
        <summary>More filters</summary>

        <div className={styles.extraFilters}>
          <label className={styles.field}>
            Max price, PLN
            <Input
              name="maxPrice"
              type="number"
              min="0"
              step="1"
              placeholder="Any price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </label>

          <div className={styles.field}>
            <span className={styles.ratingLabel}>
              Min rating
              <RatingStars count={1} />
            </span>

            <details
              className={styles.sortDropdown}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  event.currentTarget.open = false
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.currentTarget.open = false
                  event.currentTarget.querySelector('summary')?.focus()
                }
              }}
            >
              <summary
                className={styles.sortControl}
                aria-label={`Minimum rating: ${minRating || 'any'}`}
              >
                {minRating ? (
                  <RatingStars count={Number(minRating)} />
                ) : (
                  'Any rating'
                )}
              </summary>

              <div className={styles.sortMenu}>
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={styles.sortOption}
                    aria-label={
                      rating ? `Rating ${rating} and above` : 'Any rating'
                    }
                    aria-pressed={minRating === (rating ? String(rating) : '')}
                    onClick={(event) => {
                      updateParams({
                        minRating: rating ? String(rating) : '',
                        page: '',
                      })

                      const dropdown = event.currentTarget.closest('details')
                      if (dropdown) {
                        dropdown.open = false
                        dropdown.querySelector('summary')?.focus()
                      }
                    }}
                  >
                    {rating ? <RatingStars count={rating} /> : 'Any rating'}
                  </button>
                ))}
              </div>
            </details>
          </div>

          <div className={styles.field}>
            <span>Sort by</span>

            <details
              className={styles.sortDropdown}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  event.currentTarget.open = false
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.currentTarget.open = false
                  event.currentTarget.querySelector('summary')?.focus()
                }
              }}
            >
              <summary className={styles.sortControl} aria-label="Sort by">
                {sortOptions.find((option) => option.value === getParam('sort'))
                  ?.label ?? 'Highest rating'}
              </summary>

              <div className={styles.sortMenu}>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={styles.sortOption}
                    aria-pressed={getParam('sort') === option.value}
                    onClick={(event) => {
                      updateParams({ sort: option.value, page: '' })

                      const dropdown = event.currentTarget.closest('details')
                      if (dropdown) {
                        dropdown.open = false
                        dropdown.querySelector('summary')?.focus()
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </details>
          </div>
        </div>
      </details>
    </form>
  )
}
