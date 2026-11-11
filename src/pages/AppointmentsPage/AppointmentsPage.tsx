import { Link } from 'react-router'
import { useState } from 'react'

import { useGetAppointmentsQuery } from '../../entities/appointment/api/appointmentApi'
import { useAuth } from '../../entities/user/model/useAuth'
import { CancelAppointment } from '../../features/appointment-cancel/ui/CancelAppointment'
import { Button } from '../../shared/ui/Button/Button'
import styles from './AppointmentsPage.module.css'
import { useDispatch } from 'react-redux'
import { baseApi } from '../../shared/api/baseApi'

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Warsaw',
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function AppointmentsPage() {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const [now] = useState(() => Date.now())

  const {
    currentData: appointments,
    isLoading,
    isError,
  } = useGetAppointmentsQuery(
    {
      userId: user?.id ?? '',
      role: user?.role ?? 'patient',
    },
    { skip: !user },
  )

  if (!user) return null
  if (!user) return null

  return (
    <main>
      <h1>
        {user.role === 'doctor'
          ? 'Appointments with me'
          : user.role === 'admin'
            ? 'All appointments'
            : 'My appointments'}
      </h1>

      {isLoading ? (
        <p role="status">Loading appointments...</p>
      ) : isError ? (
        <div role="alert">
          <p>Unable to load appointments.</p>
          <Button
            onClick={() =>
              dispatch(baseApi.util.invalidateTags(['Appointments']))
            }
          >
            Try again
          </Button>
        </div>
      ) : appointments?.length ? (
        <ul className={styles.list}>
          {appointments.map((appointment) => {
            const doctor = appointment.expand?.doctor
            const datetime = appointment.expand?.slot?.datetime

            const canCancel =
              appointment.status !== 'cancelled' &&
              Boolean(datetime && Date.parse(datetime) > now)

            return (
              <li key={appointment.id} className={styles.card}>
                <div>
                  <h2>
                    <Link to={`/doctors/${appointment.doctor}`}>
                      {doctor ? `Dr. ${doctor.full_name}` : 'Doctor profile'}
                    </Link>
                  </h2>

                  {doctor && (
                    <p>
                      {doctor.clinic} · {doctor.city}
                    </p>
                  )}

                  {datetime && (
                    <p>
                      <time dateTime={datetime}>
                        {formatter.format(new Date(datetime))}
                      </time>
                    </p>
                  )}

                  <p className={styles.status} data-status={appointment.status}>
                    Status: {appointment.status}
                  </p>
                </div>

                {canCancel && (
                  <div className={styles.actions}>
                    <CancelAppointment appointmentId={appointment.id} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <div>
          <p>No appointments found.</p>
          {user.role === 'patient' && <Link to="/doctors">Find a doctor</Link>}
        </div>
      )}
    </main>
  )
}
