<script lang="ts">
  import { getTime } from './utils'
  import { onMount } from 'svelte'
  import type { Address, ApiResponse } from './types'

  type Users = [Lowercase<Address>, number][]

  export let data: ApiResponse
  export let oldData: ApiResponse
  let timeNow = getTime()

  $: users = Object.entries(data.data) as Users
  $: oldUsers = Object.entries(oldData.data) as Users

  $: sortedUsers = users.sort((a, b) => b[1] - a[1])
  $: oldSortedUsers = oldUsers.sort((a, b) => b[1] - a[1])

  $: lastUpdatedTime = getTime(data.metadata.lastUpdated)
  $: updatedMinutesAgo = Math.floor((timeNow - lastUpdatedTime) / 60)
  $: updatedHoursAgo = Math.floor(updatedMinutesAgo / 60)
  $: formattedHoursAgo =
    updatedMinutesAgo > 5
      ? updatedHoursAgo > 1
        ? `${updatedHoursAgo} hours ago`
        : 'Less than an hour ago'
      : 'Just now'

  const getRanks = (_sortedUsers: Users) => {
    const ranks: { [user: Lowercase<Address>]: number } = {}

    _sortedUsers.forEach((user, i) => (ranks[user[0]] = i + 1))

    return ranks
  }

  $: oldRanks = getRanks(oldSortedUsers)

  onMount(() => {
    const interval = setInterval(
      () => {
        timeNow = getTime()
      },
      5 * 60 * 1_000
    )

    return () => clearInterval(interval)
  })
</script>

<!-- TODO: somehow show points gained since last update -->
<!-- TODO: ens name resolution -->
<!-- TODO: ens avatar resolution -->
<!-- TODO: fallback blocky avatars -->
<!-- TODO: some sort of infinite scroll after clicking view more or something? -->

<section>
  <h1>Points Leaderboard</h1>
  <span id="timestamp">Last Updated: {formattedHoursAgo}</span>
  <div id="table">
    <div id="headers" class="grid">
      <span class="rank">Rank</span>
      <span class="user">User</span>
      <span class="points">Points</span>
    </div>
    <div id="podium" class="rows">
      {#each sortedUsers.slice(0, 3) as [userAddress, points], i}
        {@const rank = i + 1}
        {@const oldRank = oldRanks[userAddress]}
        <div
          class="row grid"
          class:gold={rank === 1}
          class:silver={rank === 2}
          class:bronze={rank === 3}
        >
          <span class="rank">#{rank}</span>
          <span class="user">{userAddress}</span>
          <span class="points">{points.toLocaleString('en')}</span>
          {#if !oldRank || rank < oldRank}
            <i class="icofont-rounded-up" />
          {:else if rank > oldRank}
            <i class="icofont-rounded-down" />
          {/if}
        </div>
      {/each}
    </div>
    <div class="rows">
      {#each sortedUsers.slice(3) as [userAddress, points], i}
        {@const rank = i + 4}
        {@const oldRank = oldRanks[userAddress]}
        <div class="row grid">
          <span class="rank">#{rank}</span>
          <span class="user">{userAddress}</span>
          <span class="points">{points.toLocaleString('en')}</span>
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
    width: 100%;
    max-width: 768px;
    display: flex;
    flex-direction: column;
  }

  h1 {
    font-size: 3rem;
  }

  #timestamp {
    color: var(--pt-purple-300);
  }

  #table {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 2rem;
    --table-x-padding: 1rem;
  }

  #table .grid {
    display: grid;
    grid-template-columns: 1fr 6fr 2fr;
    gap: 1rem;
  }

  #headers {
    padding: 0 var(--table-x-padding);
    font-size: 1.1rem;
    font-weight: 600;
  }

  #headers > span.points {
    text-align: right;
  }

  div.rows {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  div.rows:not(#podium) {
    gap: 0.75rem;
    padding: 0.5rem var(--table-x-padding);
    background-color: var(--pt-purple-500);
    border: 2px solid var(--pt-purple-700);
    border-radius: 0.5rem;
  }

  #podium {
    font-size: 1.1em;
  }

  div.row {
    position: relative;
  }

  div.row > span.points {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  div.row.gold,
  div.row.silver,
  div.row.bronze {
    padding: 0.5rem var(--table-x-padding);
    border: 4px solid;
    border-radius: 0.5rem;
  }

  div.row.gold {
    background-color: hsl(51, 100%, 30%);
    border-color: gold;
  }

  div.row.silver {
    background-color: hsl(0, 0%, 55%);
    border-color: silver;
  }

  div.row.bronze {
    background-color: hsl(30, 61%, 30%);
    border-color: #cd7f32;
  }

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
