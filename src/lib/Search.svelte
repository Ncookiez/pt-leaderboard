<script lang="ts">
  import { searchInput } from '$lib/stores'
</script>

<div>
  <input
    type="text"
    bind:value={$searchInput}
    on:blur={() => ($searchInput = $searchInput.trim())}
    placeholder="Search for a user..."
  />
  <i class="icofont-search-2" />
</div>

<style>
  div {
    --input-y-padding: 0.25rem;
    --input-x-padding: 0.5rem;

    display: flex;
    flex-shrink: 1;
    position: relative;
    align-items: center;
    outline: 2px solid var(--pt-purple-700);
    border-radius: 0.3rem;
    overflow: hidden;
    isolation: isolate;
  }

  div::after {
    content: '';
    position: absolute;
    inset: var(--input-y-padding) 0 var(--input-y-padding) calc(100% - 3em - var(--input-x-padding));
    background-color: var(--pt-purple-50);
    mask-image: linear-gradient(
      to left,
      rgba(0, 0, 0, 1) calc(1em + 2 * var(--input-x-padding)),
      rgba(0, 0, 0, 0) 100%
    );
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: var(--input-y-padding) var(--input-x-padding);
  }

  input:focus {
    outline: none;
  }

  .icofont-search-2 {
    position: absolute;
    left: calc(100% - 1em - var(--input-x-padding));
    color: var(--pt-purple-900);
    pointer-events: none;
    z-index: 1;
  }

  @media (width > 860px) {
    input {
      width: auto;
    }
  }
</style>
