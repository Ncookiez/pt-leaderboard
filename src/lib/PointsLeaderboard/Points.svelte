<script lang="ts">
  import Tooltip from '$lib/Tooltip.svelte'

  export let points: number
  export let oldPoints: number
</script>

<div>
  <Tooltip>
    {points.toLocaleString('en')}
    <span slot="tooltip">
      {#if points > oldPoints}
        <span class="positive">+{(points - oldPoints).toLocaleString('en')}</span>
      {:else if oldPoints > points}
        <span class="negative">-{(oldPoints - points).toLocaleString('en')}</span>
      {:else}
        <span>No changes</span>
      {/if}
      since last update
    </span>
  </Tooltip>
</div>

<style>
  div {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  div > span {
    font-variant-numeric: tabular-nums;
  }

  span.positive {
    color: var(--pt-success);
  }

  span.negative {
    color: var(--pt-warning-light);
  }
</style>
