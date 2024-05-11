<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
  import Leaderboard from '$lib/Leaderboard.svelte'
  import { userPrizes } from '$lib/stores'

  const network = 10
</script>

<svelte:head>
  <title>{defaultMetaTitle} | Prizes</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<Leaderboard
  name="Prizes"
  dataName="Prizes (ETH)"
  data={$userPrizes?.[network]?.current.data}
  metadata={$userPrizes?.[network]?.current.metadata}
  oldData={$userPrizes?.[network]?.old.data}
  formatData={(amount) =>
    amount.toLocaleString('en', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
/>
<ScrollUpPrompt />
