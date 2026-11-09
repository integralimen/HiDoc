import { Link } from 'react-router'

import { useCreateAppointmentMutation } from '../../../entities/appointment/api/appointmentApi'
import { useAuth } from '../../../entities/user/model/useAuth'
import { Button } from '../../../shared/ui/Button/Button'
import { useEffect, useId, useRef } from 'react'
import styles from './BookAppointment.module.css'

type BookAppointmentProps = {
  doctorId: string
  slotId: string
  datetime: string
}

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Warsaw',
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function BookAppointment({
  doctorId,
  slotId,
  datetime,
}: BookAppointmentProps) {
  const { user } = useAuth()
  const [createAppointment, { isLoading, isSuccess, error, reset }] =
    useCreateAppointmentMutation()

  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const messageId = useId()

  const isConflict = error && 'status' in error && error.status === 409

  const errorMessage = isConflict
    ? 'This appointment time is already booked. Please choose another time.'
    : error && 'message' in error
      ? error.message
      : 'Unable to book appointment. Please try again.'

  useEffect(() => {
    if (error && !dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [error])

  if (isSuccess) {
    return (
      <div role="status">
        <p>Your appointment has been booked.</p>
        <Link to="/appointments">View my appointments</Link>
      </div>
    )
  }

  return (
    <div>
      <p>Selected: {formatter.format(new Date(datetime))}</p>

      {!user ? (
        <Link
          to={`/login?returnTo=${encodeURIComponent(`/doctors/${doctorId}`)}`}
        >
          Sign in to book
        </Link>
      ) : user.role !== 'patient' ? (
        <p>Sign in with a patient account to book an appointment.</p>
      ) : (
        <Button
          disabled={isLoading}
          onClick={() => {
            void createAppointment(slotId)
          }}
        >
          {isLoading ? 'Booking...' : 'Confirm appointment'}
        </Button>
      )}

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
        aria-describedby={messageId}
        onClose={reset}
      >
        <h2 id={titleId} className={styles.title}>
          {isConflict ? 'Time unavailable' : 'Unable to book'}
        </h2>

        <p id={messageId}>{errorMessage}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.close}
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>

          <Button
            className={styles.ok}
            onClick={() => dialogRef.current?.close()}
          >
            OK
          </Button>
        </div>
      </dialog>
    </div>
  )
}
