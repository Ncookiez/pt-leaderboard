<section>
  <h1>About This App</h1>
  <span id="author">By Ncookie</span>
  <div>
    <p>
      This app is a fun little side project to track some PoolTogether user stats in a simple to
      understand manner.
    </p>
    <p>
      These points are calculated by calculating user percentages of <a
        href="https://dev.pooltogether.com/protocol/design/twab-controller"
        target="_blank">prize vault TWABs</a
      >, and each vault's percentage contribution to the PoolTogether prize pool. This means they
      are not necessarily reflections of one's deposit size in the protocol, but their chances to
      win. A user with a longer-lasting or higher yield deposit can have better odds than another
      user with a larger deposit.
    </p>
    <p>This data is currently updated every 24 hours.</p>
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
    color: var(--pt-teal-light);
  }
</style>
