<script context="module">
  export function preload({ path, params, query }) {
    return this.fetch(`shows.json`)
      .then(r => r.json())
      .then(shows => {
        return { shows };
      });
  }
</script>

<script>
  import ShowCard from "../../components/ShowCard";
  import { nowplaying, currentShowInfo } from "../../util/nowplaying.store";
  export let shows;
  const columns = [3, 4, 5];
</script>

<style>
  .shows {
    margin: 0px;
    display: grid;
    grid-gap: 30px;
    grid-template-columns: var(--sidebar-width) 1fr 300px 300px 300px 1fr 0px;
    grid-template-rows: 30px min-content;
    justify-content: center;
  }

  .semester {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr min-content min-content min-content 10px;
    justify-items: end;
    text-align: right;
    grid-row: 2;
    grid-column: 3/6;
    justify-items: start;
    text-align: left;
    grid-template-columns: 0px 1fr 0px;
  }

  .title {
    grid-column: 2;
    grid-row: 4;
    color: var(--orange);
    font-family: "Equity Text B";
    text-transform: lowercase;
    font-size: 80px;
    line-height: 1.25;
    margin: 0px;
    font-weight: normal;
  }
  .semester .title {
    padding-left: 80px;
  }
  .byline {
    grid-column: 2;
    grid-row: 3;
    color: #fff;
    font-family: "Equity Text B";
    font-size: 40px;
    line-height: 1.25;
    margin: 0px;
    font-weight: normal;
    font-style: italic;
  }
</style>

<svelte:head>
  <title>All Shows</title>
</svelte:head>
<div class="shows">
  <div class="semester">
    <h2 class="byline">On Air Shows</h2>
    <h1 class="title">Lockdown 2020</h1>
  </div>
  {#each shows as show, i}
    <ShowCard
      {show}
      style="grid-row:{Math.floor(i / 3) + 3};grid-column:{columns[i % 3]}" />
  {/each}
</div>
