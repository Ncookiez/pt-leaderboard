<script lang="ts">
  import Tooltip from '$lib/Tooltip.svelte'

  export let value: number
  export let oldValue: number
</script>

<div>
  <Tooltip>
    {value.toLocaleString('en')}
    <span slot="tooltip">
      {#if value > oldValue}
        <span class="positive">+{(value - oldValue).toLocaleString('en')}</span>
      {:else if oldValue > value}
        <span class="negative">-{(oldValue - value).toLocaleString('en')}</span>
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
