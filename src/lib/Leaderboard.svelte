<script lang="ts">
  import type { Address, ApiResponse } from './types'

  type Users = [Lowercase<Address>, number][]

  export let data: ApiResponse
  export let oldData: ApiResponse

  $: users = Object.entries(data.data) as Users
  $: oldUsers = Object.entries(oldData.data) as Users

  $: sortedUsers = users.sort((a, b) => b[1] - a[1])
  $: oldSortedUsers = oldUsers.sort((a, b) => b[1] - a[1])

  // TODO: change this to "X hours ago"
  $: lastUpdated = data.metadata.lastUpdated

  const getRanks = (_sortedUsers: Users) => {
    const ranks: { [user: Lowercase<Address>]: number } = {}

    _sortedUsers.forEach((user, i) => (ranks[user[0]] = i + 1))

    return ranks
  }

  $: oldRanks = getRanks(oldSortedUsers)
</script>

<!-- TODO: ens name resolution -->
<!-- TODO: ens avatar resolution -->
<!-- TODO: fallback blocky avatars -->
<!-- TODO: special row styling for podium -->
<!-- TODO: some sort of infinite scroll after clicking view more or something? -->

<section>
  <h1>Leaderboard</h1>
  <span>Last Updated: {lastUpdated}</span>
  <div id="table">
    <div id="headers">
      <span>Rank</span>
      <span>User</span>
      <span>Points</span>
    </div>
    <div id="rows">
      {#each sortedUsers as [userAddress, points], i}
        {@const rank = i + 1}
        {@const oldRank = oldRanks[userAddress]}
        <div id="row">
          <span>#{rank}</span>
          <span>{userAddress}</span>
          <span>{points.toLocaleString('en')}</span>
          {#if !oldRank || rank < oldRank}
            <i class="icofont-rounded-up" />
          {:else if rank > oldRank}
            <i class="icofont-rounded-down" />
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  #table {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    --grid-cols: 1fr 7fr 1.5fr 1fr;
  }

  #headers {
    display: grid;
    grid-template-columns: var(--grid-cols);
  }

  #rows {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  #row {
    display: grid;
    grid-template-columns: var(--grid-cols);
  }

  .icofont-rounded-up {
    color: var(--pt-teal-dark);
  }

  .icofont-rounded-down {
    color: var(--pt-warning-dark);
  }
</style>
