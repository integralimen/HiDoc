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
    getAppointments: build.query<Appointment[], string>({
      async queryFn(userId, { signal }) {
        try {
          const records = await pb
            .collection('appointments')
            .getFullList<Appointment>({
              filter: pb.filter('user = {:userId}', { userId }),
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
