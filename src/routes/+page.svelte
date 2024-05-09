<script lang="ts">
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import ScrollUpPrompt from '$lib/ScrollUpPrompt.svelte'
  import Leaderboard from '$lib/Leaderboard.svelte'
</script>

<svelte:head>
  <title>{defaultMetaTitle}</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<!-- TODO: add more leaderboards (prizes won, for example) -->

<Leaderboard network={10} />
<ScrollUpPrompt />
