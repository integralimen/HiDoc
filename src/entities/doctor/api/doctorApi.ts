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
type DoctorsQuery = {
  page: number
  q: string
  city: string
  specialty: string
}

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDoctors: build.query<DoctorsPage, DoctorsQuery>({
      async queryFn({ page, q, city, specialty }, { signal }) {
        try {
          const filters = []

          if (q) {
            filters.push(pb.filter('full_name ~ {:q}', { q }))
          }

          if (city) {
            filters.push(pb.filter('city = {:city}', { city }))
          }

          if (specialty) {
            filters.push(
              pb.filter('specialty.slug = {:specialty}', { specialty }),
            )
          }
          const result = await pb
            .collection('doctors')
            .getList<DoctorRecord>(page, 9, {
              expand: 'specialty',
              filter: filters.join(' && '),
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

    getDoctor: build.query<Doctor, string>({
      async queryFn(id, { signal }) {
        try {
          const record = await pb
            .collection('doctors')
            .getOne<DoctorRecord>(id, {
              expand: 'specialty',
              requestKey: null,
              fetch: (url, options) => fetch(url, { ...options, signal }),
            })

          return { data: mapDoctor(record) }
        } catch (error: unknown) {
          return {
            error: {
              status: error instanceof ClientResponseError ? error.status : 0,
              message:
                error instanceof Error
                  ? error.message
                  : 'Failed to load doctor',
            },
          }
        }
      },
      providesTags: ['Doctors'],
    }),
  }),
})

export const { useGetDoctorsQuery, useGetDoctorQuery } = doctorApi
