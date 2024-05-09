<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import Leaderboard from '$lib/Leaderboard.svelte'
</script>

<svelte:head>
  <title>{defaultMetaTitle}</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<Leaderboard network={10} />

<!-- TODO: if lower that a screen height, show icon to scroll back up -->
<!-- TODO: add more leaderboards (prizes won, for example) -->
