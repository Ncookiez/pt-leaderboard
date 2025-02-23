import {
  calculatePointMultipliers,
  calculatePrizeMultipliers,
  getAggregatedNetworkData,
  getPrizeTokenInfo,
  getUserOdds,
  getUserPrizes
} from '$lib/utils'
import { derived, writable } from 'svelte/store'

export const userOdds = writable<Awaited<ReturnType<typeof getUserOdds>>>()
export const userPrizes = writable<Awaited<ReturnType<typeof getUserPrizes>>>()
export const prizeTokenInfo = writable<Awaited<ReturnType<typeof getPrizeTokenInfo>>>()

export const aggregatedPointsData = derived([userOdds, prizeTokenInfo], ([$userOdds, $prizeTokenInfo]) => {
  if (!!$userOdds && !!$prizeTokenInfo) {
    return getAggregatedNetworkData($userOdds, { networkMultipliers: calculatePointMultipliers($prizeTokenInfo) })
  }
})
export const aggregatedPrizesData = derived([userPrizes, prizeTokenInfo], ([$userPrizes, $prizeTokenInfo]) => {
  if (!!$userPrizes && !!$prizeTokenInfo) {
    return getAggregatedNetworkData($userPrizes, { networkMultipliers: calculatePrizeMultipliers($prizeTokenInfo) })
  }
})

export const searchInput = writable<string>('')
