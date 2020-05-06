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
  import Title from "../../components/Title.svelte";
  import Link from "../../components/Link.svelte";
  import Post from "../../components/Post.svelte";
  import Grid from "../../components/Grid.svelte";
  import Section from "../../components/Section.svelte";
  import ShowCard from "../../components/ShowCard";
  import Heading from "../../components/Heading";
  import ImagePage from "../../components/ImagePage";
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

</style>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />
<svelte:head>
  <title>All Shows</title>
</svelte:head>
<ImagePage image={image.large} top="50vh">
  <Section top="50vh">
    <Title centred>{team} team</Title>
    {#if $settings.extra && $settings.extra.hub_shows && $settings.extra.hub_shows[team]}
      <Link href="/shows/{$settings.extra.hub_shows[team]}">View hub show</Link>
    {/if}
    <Grid>
      {#each posts as post, i}
        <Post {post} />
      {/each}
    </Grid>
    <Link href="/teams/archive/{team}">view Archive</Link>
  </Section>
</ImagePage>
