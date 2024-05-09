<script lang="ts">
  import LeaderboardRankUpdate from './LeaderboardRankUpdate.svelte'
  import LeaderboardPoints from './LeaderboardPoints.svelte'
  import LeaderboardUser from './LeaderboardUser.svelte'
  import Loading from './Loading.svelte'
  import { userOdds } from './stores'
  import { getTime } from './utils'
  import { onMount } from 'svelte'
  import type { Address } from './types'

  type Users = [Lowercase<Address>, number][]

  export let network: number
  let timeNow = getTime()
  let shownUsers = 20

  $: data = $userOdds?.[network]?.current.data
  $: metadata = $userOdds?.[network]?.current.metadata
  $: oldData = $userOdds?.[network]?.old.data

  $: rawUsers = !!data ? Object.entries(data) : []
  $: oldRawUsers = !!oldData ? Object.entries(oldData) : []

  const formatPoints = (rawPoints: number) => {
    return Math.floor(rawPoints * 1e6)
  }

  $: formattedUsers = rawUsers.map((data) => [data[0], formatPoints(data[1])]) as Users
  $: oldFormattedUsers = oldRawUsers.map((data) => [data[0], formatPoints(data[1])]) as Users

  $: sortedUsers = formattedUsers.sort((a, b) => b[1] - a[1])
  $: oldSortedUsers = oldFormattedUsers.sort((a, b) => b[1] - a[1])

  $: lastUpdatedTime = !!metadata ? getTime(metadata.lastUpdated) : 0
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

<!-- TODO: ens name resolution -->
<!-- TODO: ens avatar resolution -->
<!-- TODO: fallback blocky avatars -->

<section>
  <h1>Points Leaderboard</h1>
  {#if !!data}
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
          {@const oldPoints = formatPoints(oldData?.[userAddress] ?? 0)}
          <div
            class="row grid"
            class:gold={rank === 1}
            class:silver={rank === 2}
            class:bronze={rank === 3}
          >
            <span class="rank">#{rank}</span>
            <LeaderboardUser {userAddress} />
            <LeaderboardPoints {points} {oldPoints} />
            {#if !!oldData}
              <LeaderboardRankUpdate {rank} {oldRank} />
            {/if}
          </div>
        {/each}
      </div>
      <div class="rows">
        {#each sortedUsers.slice(3, shownUsers) as [userAddress, points], i}
          {#if points > 0}
            {@const rank = i + 4}
            {@const oldRank = oldRanks[userAddress]}
            {@const oldPoints = formatPoints(oldData?.[userAddress] ?? 0)}
            <div class="row grid">
              <span class="rank">#{rank}</span>
              <LeaderboardUser {userAddress} />
              <LeaderboardPoints {points} {oldPoints} />
              {#if !!oldData}
                <LeaderboardRankUpdate {rank} {oldRank} />
              {/if}
            </div>
          {/if}
        {/each}
        {#if shownUsers < sortedUsers.length}
          <button id="show-more" on:click={() => (shownUsers += 20)}>show more</button>
        {/if}
      </div>
    </div>
  {:else}
    <Loading --margin="2rem 0" />
  {/if}
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

  div.row {
    position: relative;
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

  button#show-more {
    margin-top: 0.5rem;
    color: var(--pt-purple-50);
  }

  button#show-more:hover {
    color: var(--pt-purple-100);
  }
</style>
