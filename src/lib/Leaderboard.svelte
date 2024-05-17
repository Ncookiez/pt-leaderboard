<script lang="ts">
  import LeaderboardValue from '$lib/LeaderboardValue.svelte'
  import UserAddress from '$lib/UserAddress.svelte'
  import RankUpdate from '$lib/RankUpdate.svelte'
  import { searchInput } from '$lib/stores'
  import Loading from '$lib/Loading.svelte'
  import Search from '$lib/Search.svelte'
  import { getTime } from '$lib/utils'
  import { onMount } from 'svelte'
  import type { Address, ApiResponse } from '$lib/types'

  type Users = [Lowercase<Address>, number][]

  export let name: string
  export let dataName: string = name
  export let data: ApiResponse['data'] | undefined
  export let metadata: ApiResponse['metadata'] | undefined
  export let oldData: ApiResponse['data'] | undefined
  export let parseData: (rawNumber: number) => number = (n) => n
  export let formatData: (parsedNumber: number) => string = (n) => n.toLocaleString('en')
  let timeNow = getTime()
  let shownUsers = 20

  $: rawUsers = !!data ? Object.entries(data) : []
  $: oldRawUsers = !!oldData ? Object.entries(oldData) : []

  $: formattedUsers = rawUsers.map((data) => [data[0], parseData(data[1])]) as Users
  $: oldFormattedUsers = oldRawUsers.map((data) => [data[0], parseData(data[1])]) as Users

  $: sortedUsers = formattedUsers.sort((a, b) => b[1] - a[1]).filter((u) => u[1] > 0)
  $: oldSortedUsers = oldFormattedUsers.sort((a, b) => b[1] - a[1]).filter((u) => u[1] > 0)

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

  $: userSearch = $searchInput.trim().toLowerCase()
  $: searchResults = sortedUsers
    .map(([u], i) => ({ u, r: i + 1 }))
    .filter(({ u }) => u.includes(userSearch))
  $: maxRankSearchResults = !!searchResults.length
    ? searchResults[searchResults.length - 1].r
    : undefined

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
  <div id="top-header">
    <h1>{name} Leaderboard</h1>
    {#if !!data}
      <Search />
    {/if}
  </div>
  {#if !!data}
    <span id="timestamp">Last Updated: {formattedHoursAgo}</span>
    <div id="table">
      <div id="headers" class="grid">
        <span class="rank">Rank</span>
        <span class="user">User</span>
        <span class="data">{dataName}</span>
      </div>
      <div id="podium" class="rows">
        {#each sortedUsers.slice(0, 3) as [userAddress, value], i}
          {#if !userSearch || userAddress.includes(userSearch)}
            {@const rank = i + 1}
            {@const oldRank = oldRanks[userAddress]}
            {@const oldValue = parseData(oldData?.[userAddress] ?? 0)}
            <div
              class="row grid"
              class:gold={rank === 1}
              class:silver={rank === 2}
              class:bronze={rank === 3}
            >
              <span class="rank">#{rank}</span>
              <UserAddress {userAddress} />
              <LeaderboardValue {value} {oldValue} {formatData} />
              {#if !!oldData}
                <RankUpdate
                  {rank}
                  {oldRank}
                  --margin-top="0.5rem"
                  --margin-right="calc(100% + var(--table-x-padding) + 2px)"
                />
              {/if}
            </div>
          {/if}
        {/each}
      </div>
      {#if !userSearch || !maxRankSearchResults || maxRankSearchResults > 3}
        <div class="rows">
          {#each sortedUsers.slice(3, !!userSearch ? maxRankSearchResults : shownUsers) as [userAddress, value], i}
            {#if !userSearch || userAddress.includes(userSearch)}
              {@const rank = i + 4}
              {@const oldRank = oldRanks[userAddress]}
              {@const oldValue = parseData(oldData?.[userAddress] ?? 0)}
              <div class="row grid">
                <span class="rank">#{rank}</span>
                <UserAddress {userAddress} />
                <LeaderboardValue {value} {oldValue} {formatData} />
                {#if !!oldData}
                  <RankUpdate {rank} {oldRank} />
                {/if}
              </div>
            {/if}
          {/each}
          {#if !userSearch && shownUsers < sortedUsers.length}
            <button id="show-more" on:click={() => (shownUsers += 50)}>show more</button>
          {/if}
          {#if !!userSearch && !maxRankSearchResults}
            <span id="failed-search">no users found based on your search</span>
          {/if}
        </div>
      {/if}
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

  #top-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 0.5rem;
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

  #headers > span.data {
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

  span#failed-search {
    text-align: center;
    font-size: 0.9em;
  }

  @media (width > 860px) {
    #top-header {
      flex-direction: row;
      align-items: center;
      margin-bottom: 0;
    }
  }
</style>
