import { ClientResponseError } from 'pocketbase'

import { baseApi } from '../../../shared/api/baseApi'
import { pb } from '../../../shared/api/pocketbase'
import type { User } from '../model/types'

type ProfileData = Pick<User, 'name' | 'phone'>

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateProfile: build.mutation<User, ProfileData>({
      async queryFn({ name, phone }) {
        const record: unknown = pb.authStore.record

        const userId =
          typeof record === 'object' &&
          record !== null &&
          'id' in record &&
          typeof record.id === 'string'
            ? record.id
            : ''

        if (!pb.authStore.isValid || !userId) {
          return {
            error: {
              status: 401,
              message: 'Please sign in.',
            },
          }
        }

        try {
          const user = await pb.collection('users').update<User>(userId, {
            name,
            phone,
          })

          return { data: user }
        } catch (error: unknown) {
          return {
            error: {
              status: error instanceof ClientResponseError ? error.status : 0,
              message: 'Unable to save your profile. Please try again.',
            },
          }
        }
      },
    }),
  }),
})

export const { useUpdateProfileMutation } = userApi
