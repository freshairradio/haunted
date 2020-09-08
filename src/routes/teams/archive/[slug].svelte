<script context="module">
  export function preload({ path, params, query }) {
    return this.fetch(`teams/archive/${params.slug}.json`)
      .then((r) => r.json())
      .then(({ posts, team, image }) => {
        return { posts, team, image };
      });
  }
</script>

<script>
  import ShowCard from "../../../components/ShowCard";
  import Heading from "../../../components/Heading";
  import ImagePage from "../../../components/ImagePage";
  import Section from "../../../components/Section";
  import Grid from "../../../components/Grid";
  import Post from "../../../components/Post";
  import Link from "../../../components/Link";
  import Title from "../../../components/Title";
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
    grid-template-columns: var(--sidebar-width) 1fr 300px 300px 300px 1fr 0px;
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
    font-family: "Equity";
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
    font-family: "Equity";
    font-size: 40px;
    line-height: 1.25;
    margin: 0px;
    font-weight: normal;
    font-style: italic;
  }
  .related-container {
    position: relative;
    top: var(--page-height);
    padding: 100px 0px;
    display: grid;
    background: var(--black-90);
    grid-gap: 30px;
    grid-template-columns: var(--sidebar-width) 1fr 300px 300px 300px 1fr 0px;
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
    height: var(--page-height);
    top: 0px;
    left: 0px;
    object-fit: cover;
    z-index: 0;
  }
  .cover-overlay {
    position: absolute;
    height: var(--half-page-height);
    width: 100vw;
    top: var(--half-page-height);
    left: 0px;
    background: linear-gradient(transparent, var(--black-90));
    transition: all 0.2s;
  }
  .cover-overlay.full {
    height: var(--page-height);
    top: 0px;
    background: black;
  }

  .stars {
    position: absolute;
    font-family: "Equity";
    font-size: 100px;
    line-height: 1;
    top: calc(var(--page-height) - var(--sidebar-width));
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
    top: var(--page-height);
    background: var(--black-90);
    display: grid;
    grid-template-columns: var(--sidebar-width) auto 700px auto;
  }
  .content-container :global(.content) {
    grid-column: 3;
  }

  .title-container {
    position: absolute;
    left: var(--sidebar-width);
    top: 0px;
    height: var(--page-height);
    width: calc(100vw - var(--sidebar-width));
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
<ImagePage image={image.large} top="50vh">
  <Section top="50vh">
    <Title centred>{team} team archive</Title>
    <Grid>
      {#each posts as post, i}
        <Post {post} />
      {/each}
    </Grid>
  </Section>
</ImagePage>
