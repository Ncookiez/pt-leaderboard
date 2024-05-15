<section>
  <h1>About This App</h1>
  <span id="author">By Ncookie</span>
  <div>
    <p>
      This app is a fun little side project to track some PoolTogether user stats in a simple to
      understand manner.
    </p>
    <p>
      <strong>Points</strong> in the points leaderboard are calculated through user percentages of
      <a href="https://dev.pooltogether.com/protocol/design/twab-controller" target="_blank"
        >prize vault TWABs</a
      >, and each vault's percentage contribution to the PoolTogether prize pool. This means they
      are not necessarily reflections of one's deposit size in the protocol, but their chances to
      win. A user with a longer-lasting or higher yield deposit can have better odds than another
      user with a larger deposit.
    </p>
    <p>
      <strong>Prizes</strong> in the prizes leaderboard are simply the amount in ETH a given user has
      won as prizes.
    </p>
    <p>
      <strong>Luck</strong> in the luck leaderboard is calculated through the median deviation of prizes,
      divided by the median deviation of points for any particular user. This is not a perfect metric
      and has its issues, but as with everything in this app - it's a work in progress :)
    </p>
    <p>All leaderboards are currently updated every 24 hours.</p>
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

  #author {
    color: var(--pt-purple-300);
  }

  section > div {
    margin-top: 2rem;
  }

  a {
    text-decoration: underline;
  }

  a:hover {
    color: var(--pt-purple-100);
  }

  strong {
    color: var(--pt-teal-dark);
  }
</style>
