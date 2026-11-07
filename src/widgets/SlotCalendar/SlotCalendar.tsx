import { useState } from 'react'

import { useGetSlotsQuery } from '../../entities/slot/api/slotApi'
import { Button } from '../../shared/ui/Button/Button'
import styles from './SlotCalendar.module.css'

import arrowLeft from '../../shared/assets/icons/arrow-left.svg'
import arrowRight from '../../shared/assets/icons/arrow-right.svg'

type SlotCalendarProps = {
  doctorId: string
}

const timeZone = 'Europe/Warsaw'

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const weekdayFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone,
  weekday: 'short',
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone,
  day: 'numeric',
  month: 'short',
})

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone,
  hour: '2-digit',
  minute: '2-digit',
})

function getDayKey(date: Date) {
  const parts = dayKeyFormatter.formatToParts(date)
  const get = (type: string) => parts.find((part) => part.type === type)?.value

  return `${get('year')}-${get('month')}-${get('day')}`
}

export function SlotCalendar({ doctorId }: SlotCalendarProps) {
  const [offset, setOffset] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const {
    currentData: slots,
    isFetching,
    isError,
    refetch,
  } = useGetSlotsQuery(doctorId)

  const now = new Date()
  const today = getDayKey(now)

  const days = Array.from({ length: 90 }, (_, index) => {
    const date = new Date(`${today}T12:00:00Z`)
    date.setUTCDate(date.getUTCDate() + index)
    return date
  })

  const columns = days.slice(offset, offset + 3).map((date) => ({
    date,
    slots: (slots ?? []).filter((slot) => {
      const slotDate = new Date(slot.datetime)

      return (
        getDayKey(slotDate) === getDayKey(date) &&
        slotDate.getTime() > now.getTime()
      )
    }),
  }))

  const rowCount = Math.max(2, ...columns.map((column) => column.slots.length))
  const visibleRows = showAll ? rowCount : Math.min(rowCount, 5)

  function changePage(nextOffset: number) {
    setOffset(nextOffset)
    setShowAll(false)
  }

  return (
    <section aria-labelledby="slots-heading">
      <h3 id="slots-heading" className={styles.heading}>
        Available appointments
      </h3>

      {isFetching ? (
        <p role="status">Loading appointments...</p>
      ) : isError ? (
        <div role="alert">
          <p>Unable to load appointments.</p>
          <Button onClick={() => void refetch()}>Try again</Button>
        </div>
      ) : (
        <>
          <div className={styles.calendar}>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Previous days"
              disabled={offset === 0}
              onClick={() => changePage(offset - 3)}
            >
              <img src={arrowLeft} alt="" width={16} height={16} />
            </button>

            <div className={styles.days}>
              {columns.map(({ date, slots: daySlots }) => (
                <div key={getDayKey(date)} className={styles.column}>
                  <div className={styles.date}>
                    <span>{weekdayFormatter.format(date)}</span>
                    <span>{dateFormatter.format(date)}</span>
                  </div>

                  <ul className={styles.slots}>
                    {Array.from({ length: visibleRows }, (_, index) => {
                      const slot = daySlots[index]
                      const available = slot && !slot.is_booked

                      return (
                        <li key={slot?.id ?? `empty-${index}`}>
                          {available ? (
                            <button
                              type="button"
                              className={styles.slot}
                              aria-pressed={selectedId === slot.id}
                              aria-label={`${dateFormatter.format(date)}, ${timeFormatter.format(new Date(slot.datetime))}`}
                              onClick={() => setSelectedId(slot.id)}
                            >
                              {timeFormatter.format(new Date(slot.datetime))}
                            </button>
                          ) : (
                            <span
                              className={styles.unavailable}
                              aria-label="Unavailable"
                            >
                              —
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={styles.arrow}
              aria-label="Next days"
              disabled={offset + 3 >= days.length}
              onClick={() => changePage(offset + 3)}
            >
              <img src={arrowRight} alt="" width={16} height={16} />
            </button>
          </div>

          {rowCount > 5 && (
            <button
              type="button"
              className={styles.more}
              aria-expanded={showAll}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show fewer times' : 'Show more times'}
            </button>
          )}
        </>
      )}
    </section>
  )
}
