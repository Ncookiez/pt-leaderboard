<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
  import { userOdds, userPrizes } from '$lib/stores'
  import Leaderboard from '$lib/Leaderboard.svelte'
  import { getMedian, getTime } from '$lib/utils'
  import type { Address, ApiResponse } from '$lib/types'

  const network = 10

  const calculateLuckData = (odds: ApiResponse, prizes: ApiResponse) => {
    if (!odds || !Object.keys(odds.data).length || !prizes || !Object.keys(prizes.data).length) {
      return undefined
    }

    const lastUpdated = new Date(
      Math.max(getTime(odds.metadata.lastUpdated), getTime(prizes.metadata.lastUpdated)) * 1_000
    ).toUTCString()

    const luck: ApiResponse = { data: {}, metadata: { lastUpdated } }

    const medianPoints = getMedian(Object.values(odds.data))
    const medianPrizesWon = getMedian(Object.values(prizes.data))

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

  $: isLoaded = !!$userOdds?.[network] && !!$userPrizes?.[network]
  $: luckData = isLoaded
    ? calculateLuckData($userOdds[network].current, $userPrizes[network].current)
    : undefined
  $: oldLuckData = isLoaded
    ? calculateLuckData($userOdds[network].old, $userPrizes[network].old)
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
