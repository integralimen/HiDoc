import { ClientResponseError } from 'pocketbase'

import type { ApiError } from './baseApi'

export function getApiError(error: unknown, fallback: string): ApiError {
  if (!(error instanceof ClientResponseError)) {
    return { status: 0, message: fallback }
  }

  const response: unknown = error.response

  const message =
    typeof response === 'object' &&
    response !== null &&
    'message' in response &&
    typeof response.message === 'string' &&
    response.message.trim()
      ? response.message
      : fallback

  return {
    status: error.status,
    message,
  }
}
