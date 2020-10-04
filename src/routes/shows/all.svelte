<script context="module">
  export function preload({ path, params, query }) {
    return this.fetch(`shows.json`)
      .then((r) => r.json())
      .then((shows) => {
        return { shows };
      });
  }
</script>

<script>
  import ShowCard from "../../components/ShowCard";
  import { nowplaying, currentShowInfo } from "../../util/nowplaying.store";
  export let shows;
  let w;
  let h;
  const columns = w <= 1020 ? [3, 4] : [3, 4, 5];
</script>

<style>
  .shows {
    margin: 0px;
    display: grid;
    grid-gap: 30px;
    grid-template-columns: var(--sidebar-width) 1fr 300px 300px 300px 1fr 0px;
    grid-template-rows: 30px min-content;
    justify-content: center;
    padding-bottom: 100px;
  }
  @media (max-width: 1020px) {
    .shows {
      grid-template-columns: var(--sidebar-width) 1fr 300px 300px 1fr 0px;
    }
  }
  @media (max-width: 700px) {
    .shows {
      grid-template-columns: var(--sidebar-width) 1fr 300px 1fr 0px;
    }
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
    color: white;
    font-family: "Equity";
    text-transform: lowercase;
    font-size: var(--fs-main-big);
    line-height: 1.25;
    margin: 0px;
    font-weight: normal;
  }
  .semester .title {
    padding-left: var(--fs-main-big);
  }
  .byline {
    grid-column: 2;
    grid-row: 3;
    color: #fff;
    font-family: "Equity";
    font-size: var(--fs-secondary-big);
    line-height: 1.25;
    margin: 0px;
    font-weight: normal;
    font-style: italic;
  }
</style>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />
<svelte:head>
  <title>All Shows</title>
</svelte:head>
<div class="shows">
  <div class="semester">
    <h2 class="byline">On Air Shows</h2>
    <h1 class="title">2020</h1>
  </div>
  {#each shows as show, i}
    <ShowCard
      {show}
      style="grid-row:{w <= 1020 ? (w <= 700 ? i + 3 : Math.floor(i / 2) + 3) : Math.floor(i / 3) + 3};grid-column:{w <= 1020 ? (w <= 700 ? 3 : columns[i % 2]) : columns[i % 3]}" />
  {/each}
</div>
