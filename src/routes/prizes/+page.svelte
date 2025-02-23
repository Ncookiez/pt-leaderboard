<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
  import { aggregatedPrizesData } from '$lib/stores'
  import Leaderboard from '$lib/Leaderboard.svelte'
</script>

<svelte:head>
  <title>{defaultMetaTitle} | Prizes</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<Leaderboard
  name="Prizes"
  dataName="Prizes (ETH)"
  data={$aggregatedPrizesData?.current.data}
  metadata={$aggregatedPrizesData?.current.metadata}
  oldData={$aggregatedPrizesData?.old.data}
  formatData={(amount) => amount.toLocaleString('en', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
/>
<ScrollUpPrompt />
