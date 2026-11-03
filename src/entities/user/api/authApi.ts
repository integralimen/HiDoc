import { ClientResponseError } from 'pocketbase'

import { baseApi } from '../../../shared/api/baseApi'
import { pb } from '../../../shared/api/pocketbase'
import type { User } from '../model/types'

type LoginCredentials = {
  email: string
  password: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<User, LoginCredentials>({
      async queryFn({ email, password }) {
        try {
          const result = await pb
            .collection('users')
            .authWithPassword<User>(email, password)

          return { data: result.record }
        } catch (error: unknown) {
          if (error instanceof ClientResponseError) {
            return {
              error: {
                status: error.status,
                message:
                  error.status === 400 || error.status === 401
                    ? 'Incorrect email or password.'
                    : 'Unable to sign in. Please try again.',
              },
            }
          }

          return {
            error: {
              status: 0,
              message: 'Unable to sign in. Please try again.',
            },
          }
        }
      },
    }),
  }),
})

export const { useLoginMutation } = authApi
