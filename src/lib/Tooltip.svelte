<div>
  <slot />
  <slot name="tooltip" />
</div>

<style>
  div {
    display: inline-block;
    position: relative;
    isolation: isolate;
  }

  div :global(> :last-child) {
    --size: 8rem;

    position: absolute;
    bottom: calc(100% + 0.25rem);
    left: 50%;
    width: var(--size);
    margin-left: calc(0px - var(--size) / 2);
    padding: 0.5rem;
    text-align: center;
    background-color: var(--pt-purple-400);
    border: 1px solid var(--pt-purple-200);
    border-radius: 0.5rem;
    visibility: hidden;
    z-index: 1;
  }

  div:hover :global(> :last-child) {
    visibility: visible;
  }

  div :global(> :last-child)::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border: 5px solid;
    border-color: var(--pt-purple-200) transparent transparent transparent;
  }
</style>
