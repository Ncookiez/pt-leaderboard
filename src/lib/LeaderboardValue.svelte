<script lang="ts">
  import Tooltip from '$lib/Tooltip.svelte'

  export let value: number
  export let oldValue: number
  export let formatData: (n: number) => string
</script>

<div>
  <Tooltip>
    {formatData(value)}
    <span slot="tooltip">
      {#if value > oldValue}
        <span class="positive">+{formatData(value - oldValue)}</span>
      {:else if oldValue > value}
        <span class="negative">-{formatData(oldValue - value)}</span>
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
