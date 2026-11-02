import { ClientResponseError } from 'pocketbase'

import { baseApi } from '../../../shared/api/baseApi'
import { pb } from '../../../shared/api/pocketbase'
import type { Doctor } from '../model/types'
import { mapDoctor } from './mapDoctor'
import type { DoctorRecord } from './types'

type DoctorsPage = {
  items: Doctor[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDoctors: build.query<DoctorsPage, number>({
      async queryFn(page, { signal }) {
        try {
          const result = await pb
            .collection('doctors')
            .getList<DoctorRecord>(page, 9, {
              expand: 'specialty',
              sort: '-rating,id',
              requestKey: null,
              fetch: (url, options) => fetch(url, { ...options, signal }),
            })

          return {
            data: {
              items: result.items.map(mapDoctor),
              page: result.page,
              perPage: result.perPage,
              totalItems: result.totalItems,
              totalPages: result.totalPages,
            },
          }
        } catch (error: unknown) {
          if (error instanceof ClientResponseError) {
            return {
              error: {
                status: error.status,
                message: error.message,
              },
            }
          }

          return {
            error: {
              status: 0,
              message:
                error instanceof Error
                  ? error.message
                  : 'Failed to load doctors',
            },
          }
        }
      },
      providesTags: ['Doctors'],
    }),
  }),
})

export const { useGetDoctorsQuery } = doctorApi
