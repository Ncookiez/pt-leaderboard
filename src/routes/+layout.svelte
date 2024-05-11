<script lang="ts">
  import { getUserOdds, getUserPrizes } from '$lib/utils'
  import { userOdds, userPrizes } from '$lib/stores'
  import Navbar from '$lib/Navbar.svelte'
  import { onMount } from 'svelte'
  import '../app.css'

  onMount(async () => {
    if (!$userOdds) {
      userOdds.set(await getUserOdds())
    }
    if (!$userPrizes) {
      userPrizes.set(await getUserPrizes())
    }
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
