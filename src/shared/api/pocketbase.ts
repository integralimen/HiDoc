import PocketBase from 'pocketbase'

const pocketbaseUrl: unknown = import.meta.env.VITE_POCKETBASE_URL

if (typeof pocketbaseUrl !== 'string' || !pocketbaseUrl.trim()) {
  throw new Error('VITE_POCKETBASE_URL is not configured')
}

export const pb = new PocketBase(pocketbaseUrl)
