<script lang="ts">
  import Leaderboard from '$lib/Leaderboard.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<svelte:head>
  <title>PoolTogether Leaderboard</title>
  <meta
    name="description"
    content="Lure them in with points, and they won't realize they're saving money responsibly."
  />
</svelte:head>

<!-- TODO: add explanation of how this is calculated (twab, not balance, etc.) -->
<!-- TODO: use <i class="icofont-question-circle" /> -->

<Leaderboard data={data[10].current} oldData={data[10].old} />
