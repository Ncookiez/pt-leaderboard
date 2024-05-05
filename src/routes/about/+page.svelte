<script>
  import { defaultMetaDescription, defaultMetaTitle } from '$lib/config'
  import AboutContent from '$lib/AboutContent.svelte'
</script>

<svelte:head>
  <title>{defaultMetaTitle} | About</title>
  <meta name="description" content={defaultMetaDescription} />
</svelte:head>

<AboutContent />
