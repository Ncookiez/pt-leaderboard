import type { Address } from './types'

export const userDataApiUrl: `https://${string}` = 'https://pt-odds-api.ncookie.workers.dev'

export const networks: number[] = [10, 8453, 42161]

export const defaultMetaTitle = 'PT Leaderboard'
export const defaultMetaDescription = `Lure them in with points, and they won't realize they're saving money responsibly.`

export const ignoredAddresses: Lowercase<Address>[] = [
  '0x327b2ea9668a552fe5dec8e3c6e47e540a0a58c6', // GP Booster @ Base
  '0x1dcfb8b47c2f05ce86c21580c167485de1202e12' // GP Booster @ Arbitrum
]
