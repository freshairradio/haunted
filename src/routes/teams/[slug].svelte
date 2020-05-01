<script context="module">
  export function preload({ path, params, query }) {
    return this.fetch(`teams/${params.slug}.json`)
      .then(r => r.json())
      .then(({ posts, team, image }) => {
        return { posts, team, image };
      });
  }
</script>

<script>
  import ShowCard from "../../components/ShowCard";
  import Heading from "../../components/Heading";
  import { settings } from "../../util/settings.store.js";

  import { nowplaying, currentShowInfo } from "../../util/nowplaying.store";
  export let posts;
  export let team;
  export let image;
  let w;
  let h;
  const columns = w <= 1020 ? [3, 4] : [3, 4, 5];
</script>

<style>
  .shows {
    position: relative;

    top: 75vh;
    margin: 0px;
    display: grid;
    grid-gap: 30px;
    grid-template-columns: var(--sidebar-width) 1fr 300px 300px 300px 1fr 0px;
    justify-content: center;
    background: var(--black-90);
  }

  .btitle {
    grid-column: 3/6;
    grid-row: 1;
    grid-row-start: 1;
    grid-row-end: auto;
    color: var(--orange);
    font-family: "Equity Text B";
    text-transform: lowercase;
    font-size: 80px;
    line-height: 1.25;
    margin: 0px;
    font-weight: normal;
    top: -25vh;
    position: relative;
    justify-self: center;
  }
  @media (max-width: 1020px) {
    .shows {
      grid-template-columns: var(--sidebar-width) 1fr 300px 300px 1fr 0px;
    }
    .btitle {
      grid-column: 3/5;
    }
  }
  .related {
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 8px;
    top: -25vh;
  }
  .related:nth-child(1) {
    grid-column: 3;
  }
  .related:nth-child(2) {
    grid-column: 4;
  }
  .related:nth-child(3) {
    grid-column: 5;
  }
  .related .cover {
    position: absolute;
    width: 300px;
    height: 300px;
    top: 0px;
    left: 0px;
    border-radius: 8px;
    z-index: inherit;
  }
  .related .cover-overlay {
    position: absolute;
    width: 300px;
    height: 300px;
    top: 0px;
    left: 0px;
    background: linear-gradient(var(--black-50), var(--black-90));

    border-radius: 8px;
  }

  .cover {
    position: fixed;
    width: 100vw;
    height: var(--page-height);
    top: 0px;
    left: 0px;
    object-fit: cover;
    z-index: 0;
  }
  .cover-overlay {
    position: absolute;
    height: 75vh;
    width: 100vw;
    top: 0vh;
    left: 0px;
    background: linear-gradient(transparent, var(--black-90));
    transition: all 0.2s;
  }

  .related-title-container {
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 8px;
  }
  .button {
    grid-row: 9;
    grid-column: 5;
    background: var(--orange);
    height: 60px;
    border-radius: 8px;
    line-height: 60px;
    font-size: 24px;
    padding: 0px 40px;
    text-decoration: none;
    color: white;
    text-transform: lowercase;
    justify-self: center;
    top: -25vh;
    position: relative;
    grid-column: 3/6 !important;
    text-align: center;
    font-weight: 100;
  }
  .bbutton {
    grid-row: 2;
    grid-column: 2/8;
    background: var(--orange);
    height: 60px;
    border-radius: 8px;
    line-height: 60px;
    font-size: 24px;
    padding: 0px 40px;
    text-decoration: none;
    color: white;
    text-transform: lowercase;
    justify-self: center;
    top: -25vh;
    position: relative;
    grid-column: 3/6 !important;
    text-align: center;
    font-weight: 100;
  }
  @media (max-width: 1020px) {
    .bbutton {
      grid-column: 3/5 !important;
    }
    .button {
      grid-row: 12 !important;
      grid-column: 3/5 !important;
    }
  }
</style>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />
<svelte:head>
  <title>All Shows</title>
</svelte:head>
<img class="cover" src={image.large} />
<div class="cover-overlay" />
<div class="shows">
  <h1 class="btitle">{team} team</h1>
  {#if $settings.extra && $settings.extra.hub_shows && $settings.extra.hub_shows[team]}
    <a
      href="/shows/{$settings.extra.hub_shows[team]}"
      class="bbutton"
      rel="prefetch">
      View hub show
    </a>
  {/if}
  {#each posts as post, i}
    <a
      href="/posts/{post.slug}"
      class="related"
      rel="prefetch"
      style="grid-row:{w <= 1020 ? Math.floor(i / 2) + 3 : Math.floor(i / 3) + 3};grid-column:{w <= 1020 ? columns[i % 2] : columns[i % 3]}">
      <img class="cover" src={post.feature_image.small} />
      <div class="cover-overlay" />
      <div class="related-title-container">
        <Heading
          tags={post.tags}
          authors={post.authors}
          title={post.title}
          mini />
      </div>

    </a>
  {/each}
  <a
    href="/teams/archive/{team}"
    class="button"
    rel="prefetch"
    style="grid-row:{Math.floor(posts.length / 3) + 3};grid-column:{columns[2]}">
    view Archive
  </a>
</div>
