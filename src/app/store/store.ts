import { configureStore } from '@reduxjs/toolkit'

import { baseApi } from '../../shared/api/baseApi'
import { appointmentSyncMiddleware } from './appointmentSyncMiddleware'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      appointmentSyncMiddleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
