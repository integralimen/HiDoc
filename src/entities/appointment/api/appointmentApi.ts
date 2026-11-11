import { ClientResponseError } from 'pocketbase'

import { baseApi } from '../../../shared/api/baseApi'
import { pb } from '../../../shared/api/pocketbase'
import { getApiError } from '../../../shared/api/getApiError'
import type { RootState } from '../../../app/store/store'

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
          const result = await pb.send<unknown>('/api/hidoc/appointments', {
            method: 'POST',
            body: { slot },
          })

          if (
            typeof result !== 'object' ||
            result === null ||
            !('id' in result) ||
            typeof result.id !== 'string' ||
            !result.id.trim()
          ) {
            throw new Error('Invalid booking response')
          }

          return { data: { id: result.id } }
        } catch (error: unknown) {
          return {
            error: getApiError(
              error,
              'Unable to book appointment. Please try again.',
            ),
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
          const result = await pb.send<unknown>(
            `/api/hidoc/appointments/${id}/cancel`,
            { method: 'POST' },
          )

          if (
            typeof result !== 'object' ||
            result === null ||
            !('id' in result) ||
            result.id !== id ||
            !('status' in result) ||
            result.status !== 'cancelled'
          ) {
            throw new Error('Invalid cancellation response')
          }

          const data: { id: string; status: 'cancelled' } = {
            id,
            status: 'cancelled',
          }

          return { data }
        } catch (error: unknown) {
          return {
            error: getApiError(
              error,
              'Unable to cancel appointment. Please try again.',
            ),
          }
        }
      },
      async onQueryStarted(
        id,
        { dispatch, getState, queryFulfilled },
      ): Promise<void> {
        const queries = appointmentApi.util.selectCachedArgsForQuery(
          getState() as RootState,
          'getAppointments',
        )

        const patches = queries.map((args) =>
          dispatch(
            appointmentApi.util.updateQueryData(
              'getAppointments',
              args,
              (appointments) => {
                const appointment = appointments.find((item) => item.id === id)

                if (appointment) {
                  appointment.status = 'cancelled'
                }
              },
            ),
          ),
        )

        try {
          await queryFulfilled
        } catch {
          patches.forEach((patch) => patch.undo())
        }
      },
      invalidatesTags: (result) => (result ? ['Slots', 'Appointments'] : []),
    }),
  }),
})

export const {
  useCreateAppointmentMutation,
  useGetAppointmentsQuery,
  useCancelAppointmentMutation,
} = appointmentApi
