<script context="module">
  export async function preload({ path, params, query }) {
    return this.fetch(`posts/${params.slug}.json`)
      .then(r => r.json())
      .then(({ related, ...post }) => {
        return { post, related };
      });
  }
</script>

<script>
  import Heading from "../../components/Heading.svelte";
  import Content from "../../components/Content.svelte";
  import Article from "../../components/Article.svelte";
  import { stores } from "@sapper/app";
  import { fade } from "svelte/transition";
  import ImagePage from "../../components/ImagePage";
  import Section from "../../components/Section";
  import Grid from "../../components/Grid";
  import Post from "../../components/Post";
  import Link from "../../components/Link";
  import Title from "../../components/Title";
  const { preloading, page, session } = stores();
  import image from "../../util/image.js";
  import stars from "../../util/stars.js";
  import byline from "../../util/byline.js";
  export let post;
  export let related;

  $: rating = stars(post.tags);
</script>

<style>
  .title-container {
    display: grid;
    grid-template-columns:
      1fr minmax(auto, 700px)
      1fr;
  }
  .title-container :global(.heading) {
    grid-column: 2;
    grid-template-columns: 0px 1fr 0px !important;
  }
</style>

<svelte:head>
  <title>{post.title}</title>
</svelte:head>
<ImagePage top="50vh" image={post.feature_image.large}>
  <Section top="50vh">
    <div class="title-container">

      <Heading tags={post.tags} authors={post.authors} title={post.title} />
    </div>
    <Article html={post.html} />
    <Grid>
      {#each related as relpost}
        <Post post={relpost} />
      {/each}
    </Grid>
  </Section>
</ImagePage>
