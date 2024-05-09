<script lang="ts">
  import { page } from '$app/stores'

  $: route = $page.route.id

  const navLinks: { href: string; name: string }[] = [
    { href: '/', name: 'Points' },
    { href: '/about', name: 'About' }
  ]
</script>

<nav>
  <div>
    <img src="pooltogetherLogo.svg" alt="PoolTogether Logo" />
    <div id="nav-links">
      {#each navLinks as { href, name }}
        <a {href} class:active={route === href}>{name}</a>
      {/each}
    </div>
  </div>
</nav>

<!-- TODO: add address/ens search functionality for whatever leaderboard is being displayed -->

<style>
  nav {
    display: flex;
    justify-content: center;
    padding: 1rem;
    background-color: var(--pt-bg-purple-darker);
    border-bottom: solid 2px var(--pt-purple-700);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    z-index: 50;
  }

  nav > div {
    width: 100%;
    max-width: 1280px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  nav > div > img {
    max-height: 48px;
  }

  #nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  #nav-links > a {
    padding-bottom: 2px;
    font-size: 1.1em;
    font-weight: 500;
  }

  #nav-links > a.active {
    color: var(--pt-teal-light);
  }

  #nav-links > a:not(.active):hover {
    color: var(--pt-purple-300);
  }
</style>
