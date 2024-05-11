<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import PointsLeaderboard from '$lib/PointsLeaderboard/index.svelte'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
</script>

<svelte:head>
  <title>{defaultMetaTitle}</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<PointsLeaderboard network={10} />
<ScrollUpPrompt />
