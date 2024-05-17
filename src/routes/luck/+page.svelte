<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
  import { userOdds, userPrizes } from '$lib/stores'
  import Leaderboard from '$lib/Leaderboard.svelte'
  import { getAggregatedNetworkData, getMedian, getTime } from '$lib/utils'
  import type { Address, ApiResponse } from '$lib/types'

  const calculateLuckData = (odds: ApiResponse, prizes: ApiResponse) => {
    if (!odds || !Object.keys(odds.data).length || !prizes || !Object.keys(prizes.data).length) {
      return undefined
    }

    const lastUpdated = new Date(
      Math.max(getTime(odds.metadata.lastUpdated), getTime(prizes.metadata.lastUpdated)) * 1_000
    ).toUTCString()

    const luck: ApiResponse = { data: {}, metadata: { lastUpdated } }

    const prizesWon = Object.values(prizes.data)
    const relevantPoints = Object.values(odds.data)
      .sort((a, b) => b - a)
      .slice(0, prizesWon.length)

    const medianPoints = getMedian(relevantPoints)
    const medianPrizesWon = getMedian(prizesWon)

    Object.entries(odds.data).forEach(([_userAddress, points]) => {
      const userAddress = _userAddress as Lowercase<Address>
      const prizesWon = prizes.data[userAddress] ?? 0

      if (!!points || !!prizesWon) {
        const prizesWonRatio = prizesWon / medianPrizesWon
        const pointsRatio = points / medianPoints

        luck.data[userAddress] = (prizesWonRatio / pointsRatio) * 100
      }
    })

    return luck
  }

  $: aggregatedUserOdds = getAggregatedNetworkData($userOdds)
  $: aggregatedUserPrizes = getAggregatedNetworkData($userPrizes)

  $: luckData =
    !!aggregatedUserOdds && !!aggregatedUserPrizes
      ? calculateLuckData(aggregatedUserOdds.current, aggregatedUserPrizes.current)
      : undefined
  $: oldLuckData =
    !!aggregatedUserOdds && !!aggregatedUserPrizes
      ? calculateLuckData(aggregatedUserOdds.old, aggregatedUserPrizes.old)
      : undefined
</script>

<svelte:head>
  <title>{defaultMetaTitle} | Luck</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<Leaderboard
  name="Luck"
  data={luckData?.data}
  metadata={luckData?.metadata}
  oldData={oldLuckData?.data}
  formatData={(amount) =>
    `${
      amount > 10
        ? amount > 100
          ? amount.toLocaleString('en', { maximumFractionDigits: 0 })
          : amount.toLocaleString('en', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
        : amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }%`}
/>
<ScrollUpPrompt />
