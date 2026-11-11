import type { Middleware } from '@reduxjs/toolkit'

import { appointmentApi } from '../../entities/appointment/api/appointmentApi'
import { baseApi } from '../../shared/api/baseApi'

export const appointmentSyncMiddleware: Middleware = (store) => {
  const channel = new BroadcastChannel('hidoc-appointments')

  channel.onmessage = (event: MessageEvent<unknown>) => {
    if (event.data === 'appointments-changed') {
      store.dispatch(baseApi.util.invalidateTags(['Slots', 'Appointments']))
    }
  }

  return (next) => (action) => {
    const result = next(action)

    if (
      appointmentApi.endpoints.createAppointment.matchFulfilled(action) ||
      appointmentApi.endpoints.cancelAppointment.matchFulfilled(action)
    ) {
      channel.postMessage('appointments-changed')
    }

    return result
  }
}
