<script lang="ts">
  import { fade } from 'svelte/transition'

  let scrollY: number
  let innerHeight: number
</script>

<svelte:window bind:scrollY bind:innerHeight />

{#if scrollY >= innerHeight / 2}
  <button on:click={() => (scrollY = 0)} transition:fade>
    <i class="icofont-swoosh-up" />
    <span>back to top</span>
  </button>
{/if}

<style>
  button {
    position: fixed;
    right: 5rem;
    bottom: 5rem;
    display: none;
    flex-direction: column;
    align-items: center;
    color: var(--pt-purple-50);
  }

  button:hover {
    color: var(--pt-purple-100);
  }

  .icofont-swoosh-up {
    font-size: 2.5em;
  }

  span {
    font-weight: 500;
  }

  @media (width > 860px) {
    button {
      display: flex;
    }
  }
</style>
