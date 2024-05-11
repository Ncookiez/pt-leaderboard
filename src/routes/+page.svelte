<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
  import Leaderboard from '$lib/Leaderboard.svelte'
  import { userOdds } from '$lib/stores'

  const network = 10
</script>

<svelte:head>
  <title>{defaultMetaTitle}</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<Leaderboard
  name="Points"
  data={$userOdds?.[network]?.current.data}
  metadata={$userOdds?.[network]?.current.metadata}
  oldData={$userOdds?.[network]?.old.data}
  parseData={(rawPoints) => Math.floor(rawPoints * 1e6)}
/>

<ScrollUpPrompt />
