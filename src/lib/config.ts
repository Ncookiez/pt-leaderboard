import type { Address } from './types'

export const networks = [10, 8453, 42161, 1, 534352, 100] as const

export const userDataApiUrls = {
  10: 'https://optimism-pt-odds-api.ncookie.workers.dev',
  8453: 'https://base-pt-odds-api.ncookie.workers.dev',
  42161: 'https://arbitrum-pt-odds-api.ncookie.workers.dev',
  1: 'https://mainnet-pt-odds-api.ncookie.workers.dev',
  534352: 'https://scroll-pt-odds-api.ncookie.workers.dev',
  100: 'https://gnosis-pt-odds-api.ncookie.workers.dev'
} as const satisfies Record<(typeof networks)[number], `https://${string}`>

export const defaultMetaTitle = 'PT Leaderboard'
export const defaultMetaDescription = `Lure them in with points, and they won't realize they're saving money responsibly.`

export const ignoredAddresses: Lowercase<Address>[] = [
  '0x327b2ea9668a552fe5dec8e3c6e47e540a0a58c6', // GP Booster @ Base
  '0x1dcfb8b47c2f05ce86c21580c167485de1202e12', // GP Booster @ Arbitrum
  '0xdeef914a2ee2f2014ce401dcb4e13f6540d20ba7', // GP Booster @ Optimism
  '0x6be9c23aa3c2cfeff92d884e20d1ec9e134ab076', // GP Booster @ Mainnet
  '0x2d3ad415198d7156e8c112a508b8306699f6e4cc', // GP Booster @ Scroll
  '0x65f3aea2594d82024b7ee98ddcf08f991ab1c626' // GP Booster @ Gnosis
]
