<script lang="ts">
  export let rank: number
  export let oldRank: number
</script>

{#if !oldRank || rank < oldRank}
  <i class="icofont-rounded-up" />
{:else if rank > oldRank}
  <i class="icofont-rounded-down" />
{/if}

<style>
  .icofont-rounded-up,
  .icofont-rounded-down {
    position: absolute;
    right: calc(100% + (2 * var(--table-x-padding)));
    font-size: 1.5em;
  }

  .icofont-rounded-up {
    color: var(--pt-teal-dark);
  }

  .icofont-rounded-down {
    color: var(--pt-warning-dark);
  }
</style>
