<script lang="ts">
  import type { Address } from '$lib/types'

  export let userAddress: Address
</script>

<span>
  <a href={`https://app.cabana.fi/account/${userAddress}`} target="_blank">{userAddress}</a>
</span>

<style>
  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a {
    font-family: monospace, monospace;
  }

  a:hover {
    color: var(--pt-purple-100);
  }
</style>
