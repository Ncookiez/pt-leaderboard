<script lang="ts">
  import { getPrizeTokenInfo, getUserOdds, getUserPrizes } from '$lib/utils'
  import { prizeTokenInfo, userOdds, userPrizes } from '$lib/stores'
  import Navbar from '$lib/Navbar.svelte'
  import { onMount } from 'svelte'
  import '../app.css'

  onMount(async () => {
    if (!$userOdds) userOdds.set(await getUserOdds())
    if (!$userPrizes) userPrizes.set(await getUserPrizes())
    if (!$prizeTokenInfo) prizeTokenInfo.set(await getPrizeTokenInfo())
  })
</script>

<Navbar />

<main><slot /></main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    padding: 2rem 1rem;
  }
</style>
