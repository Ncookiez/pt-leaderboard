<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
  import { getAggregatedNetworkData } from '$lib/utils'
  import Leaderboard from '$lib/Leaderboard.svelte'
  import { userOdds } from '$lib/stores'

  $: aggregatedData = getAggregatedNetworkData($userOdds)
</script>

<svelte:head>
  <title>{defaultMetaTitle}</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<Leaderboard
  name="Points"
  data={aggregatedData?.current.data}
  metadata={aggregatedData?.current.metadata}
  oldData={aggregatedData?.old.data}
  parseData={(rawPoints) => Math.floor(rawPoints * 1e6)}
/>

<ScrollUpPrompt />
