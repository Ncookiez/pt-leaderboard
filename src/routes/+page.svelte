<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import Leaderboard from '$lib/Leaderboard.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<svelte:head>
  <title>{defaultMetaTitle}</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<Leaderboard data={data[10].current} oldData={data[10].old} />

<!-- TODO: add more leaderboards (prizes won, for example) -->
