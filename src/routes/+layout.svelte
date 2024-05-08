<script lang="ts">
  import { getUserOdds } from '$lib/utils'
  import Navbar from '$lib/Navbar.svelte'
  import { userOdds } from '$lib/stores'
  import { onMount } from 'svelte'
  import '../app.css'

  onMount(async () => {
    if (!$userOdds) {
      userOdds.set(await getUserOdds())
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
