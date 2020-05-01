<script context="module">
  export function preload({ path, params, query }) {
    return this.fetch(`teams/archive/${params.slug}.json`)
      .then(r => r.json())
      .then(({ posts, team, image }) => {
        return { posts, team, image };
      });
  }
</script>

<script>
  import ShowCard from "../../../components/ShowCard";
  import Heading from "../../../components/Heading";
  import { nowplaying, currentShowInfo } from "../../../util/nowplaying.store";
  export let posts;
  export let team;
  export let image;
  const columns = [3, 4, 5];
</script>

<style>
  .shows {
    margin: 0px;
    display: grid;
    grid-gap: 30px;
    grid-template-columns: 220px 1fr 300px 300px 300px 1fr 0px;
    grid-template-rows: 30px min-content;
    justify-content: center;
    padding-bottom: 100px;
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
  .related-container {
    position: relative;
    top: 100vh;
    padding: 100px 0px;
    display: grid;
    background: var(--black-90);
    grid-gap: 30px;
    grid-template-columns: 220px 1fr 300px 300px 300px 1fr 0px;
  }
  .related {
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 8px;
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
    height: 100vh;
    top: 0px;
    left: 0px;
    object-fit: cover;
    z-index: 0;
  }
  .cover-overlay {
    position: absolute;
    height: 50vh;
    width: 100vw;
    top: 50vh;
    left: 0px;
    background: linear-gradient(transparent, var(--black-90));
    transition: all 0.2s;
  }
  .cover-overlay.full {
    height: 100vh;
    top: 0px;
    background: black;
  }

  .stars {
    position: absolute;
    font-family: "Equity Text B";
    font-size: 100px;
    line-height: 1;
    top: calc(100vh - 220px);
    margin: 0px;
    right: 40px;
    font-weight: normal;
    display: flex;
    flex-direction: row-reverse;
  }
  .stars span {
    display: inline-block;
    color: white;
  }
  .stars .orange {
    color: var(--orange);
  }
  .content-container {
    position: relative;
    top: 100vh;
    background: var(--black-90);
    display: grid;
    grid-template-columns: 220px auto 700px auto;
  }
  .content-container :global(.content) {
    grid-column: 3;
  }

  .title-container {
    position: absolute;
    left: 220px;
    top: 0px;
    height: 100vh;
    width: calc(100vw - 220px);
  }
  .related-title-container {
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 8px;
  }
</style>

<svelte:head>
  <title>All Shows</title>
</svelte:head>
<div class="shows">
  <div class="semester">
    <h2 class="byline">Freshair Archive</h2>
    <h1 class="title">{team} team</h1>
  </div>
  {#each posts as post, i}
    <a
      href="/posts/{post.slug}"
      class="related"
      rel="prefetch"
      style="grid-row:{Math.floor(i / 3) + 3};grid-column:{columns[i % 3]}">
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
</div>
