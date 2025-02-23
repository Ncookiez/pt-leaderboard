<script lang="ts">
  import { aggregatedPointsData, aggregatedPrizesData } from '$lib/stores'
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
  import Leaderboard from '$lib/Leaderboard.svelte'
  import { calculateLuckData } from '$lib/utils'

  $: luckData = calculateLuckData($aggregatedPointsData?.current, $aggregatedPrizesData?.current)
  $: oldLuckData = calculateLuckData($aggregatedPointsData?.old, $aggregatedPrizesData?.old)
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
