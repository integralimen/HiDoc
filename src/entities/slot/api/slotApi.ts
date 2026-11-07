import { ClientResponseError } from 'pocketbase'

import { baseApi } from '../../../shared/api/baseApi'
import { pb } from '../../../shared/api/pocketbase'

type Slot = {
  id: string
  doctor: string
  datetime: string
  is_booked: boolean
}

export const slotApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSlots: build.query<Slot[], string>({
      async queryFn(doctorId, { signal }) {
        try {
          const slots = await pb.collection('slots').getFullList<Slot>({
            filter: pb.filter('doctor = {:doctorId} && datetime >= {:now}', {
              doctorId,
              now: new Date().toISOString(),
            }),
            sort: 'datetime',
            requestKey: null,
            fetch: (url, options) => fetch(url, { ...options, signal }),
          })

          return { data: slots }
        } catch (error: unknown) {
          return {
            error: {
              status: error instanceof ClientResponseError ? error.status : 0,
              message: 'Failed to load available appointments',
            },
          }
        }
      },
      providesTags: ['Slots'],
    }),
  }),
})

export const { useGetSlotsQuery } = slotApi
