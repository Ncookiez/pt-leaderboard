<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
  import { aggregatedPointsData } from '$lib/stores'
  import Leaderboard from '$lib/Leaderboard.svelte'
</script>

<svelte:head>
  <title>{defaultMetaTitle}</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<Leaderboard
  name="Points"
  data={$aggregatedPointsData?.current.data}
  metadata={$aggregatedPointsData?.current.metadata}
  oldData={$aggregatedPointsData?.old.data}
  parseData={(rawPoints) => Math.floor(rawPoints * 1e6)}
/>

<ScrollUpPrompt />
