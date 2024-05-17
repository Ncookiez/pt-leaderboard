<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
  import { getAggregatedNetworkData } from '$lib/utils'
  import Leaderboard from '$lib/Leaderboard.svelte'
  import { userPrizes } from '$lib/stores'

  $: aggregatedData = getAggregatedNetworkData($userPrizes)
</script>

<svelte:head>
  <title>{defaultMetaTitle} | Prizes</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<Leaderboard
  name="Prizes"
  dataName="Prizes (ETH)"
  data={aggregatedData?.current.data}
  metadata={aggregatedData?.current.metadata}
  oldData={aggregatedData?.old.data}
  formatData={(amount) =>
    amount.toLocaleString('en', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
/>
<ScrollUpPrompt />
