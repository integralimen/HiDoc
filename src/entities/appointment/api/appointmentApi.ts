import { ClientResponseError } from 'pocketbase'

import { baseApi } from '../../../shared/api/baseApi'
import { pb } from '../../../shared/api/pocketbase'

export type Appointment = {
  id: string
  user: string
  doctor: string
  slot: string
  status: 'new' | 'confirmed' | 'cancelled'
  expand?: {
    doctor?: {
      full_name: string
      clinic: string
      city: string
    }
    slot?: {
      datetime: string
    }
  }
}
type AppointmentsQuery = {
  userId: string
  role: 'patient' | 'doctor' | 'admin'
}

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAppointment: build.mutation<{ id: string }, string>({
      async queryFn(slot) {
        try {
          const result = await pb.send<{ id: string }>(
            '/api/hidoc/appointments',
            {
              method: 'POST',
              body: { slot },
            },
          )

          return { data: result }
        } catch (error: unknown) {
          return {
            error: {
              status: error instanceof ClientResponseError ? error.status : 0,
              message:
                error instanceof ClientResponseError
                  ? error.response.message || 'Unable to book appointment.'
                  : 'Unable to connect. Please try again.',
            },
          }
        }
      },
      invalidatesTags: ['Slots', 'Appointments'],
    }),
    getAppointments: build.query<Appointment[], AppointmentsQuery>({
      async queryFn({ userId, role }, { signal }) {
        try {
          const filter =
            role === 'admin'
              ? ''
              : pb.filter(
                  role === 'doctor'
                    ? 'doctor.user = {:userId}'
                    : 'user = {:userId}',
                  { userId },
                )
          const records = await pb
            .collection('appointments')
            .getFullList<Appointment>({
              filter,
              expand: 'doctor,slot',
              sort: '-created',
              requestKey: null,
              fetch: (url, options) => fetch(url, { ...options, signal }),
            })

          return { data: records }
        } catch (error: unknown) {
          return {
            error: {
              status: error instanceof ClientResponseError ? error.status : 0,
              message: 'Unable to load appointments.',
            },
          }
        }
      },
      providesTags: ['Appointments'],
    }),

    cancelAppointment: build.mutation<
      { id: string; status: 'cancelled' },
      string
    >({
      async queryFn(id) {
        try {
          const result = await pb.send<{
            id: string
            status: 'cancelled'
          }>(`/api/hidoc/appointments/${id}/cancel`, {
            method: 'POST',
          })

          return { data: result }
        } catch (error: unknown) {
          return {
            error: {
              status: error instanceof ClientResponseError ? error.status : 0,
              message:
                error instanceof ClientResponseError
                  ? error.response.message || 'Unable to cancel appointment.'
                  : 'Unable to connect. Please try again.',
            },
          }
        }
      },
      invalidatesTags: ['Slots', 'Appointments'],
    }),
  }),
})

export const {
  useCreateAppointmentMutation,
  useGetAppointmentsQuery,
  useCancelAppointmentMutation,
} = appointmentApi
