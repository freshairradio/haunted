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
  import { stores } from "@sapper/app";
  import { fade } from "svelte/transition";

  const { preloading, page, session } = stores();
  import image from "../../util/image.js";
  import stars from "../../util/stars.js";
  import byline from "../../util/byline.js";
  export let post;
  export let related;

  $: rating = stars(post.tags);
</script>

<style>
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
  .title {
    position: absolute;
    color: var(--orange);
    font-family: "Equity Text B";
    text-transform: lowercase;
    font-size: 80px;
    line-height: 1.25;
    top: calc(var(--page-height) - 120px);
    margin: 0px;
    right: 40px;
    font-weight: normal;
  }
  .byline {
    position: absolute;
    color: #fff;
    font-family: "Equity Text B";
    font-size: 40px;
    line-height: 1.25;
    top: calc(var(--page-height) - 160px);
    margin: 0px;
    right: 40px;
    font-weight: normal;
    font-style: italic;
  }
  .stars {
    position: absolute;
    font-family: "Equity Text B";
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
  <title>{post.title}</title>
</svelte:head>
<img class="cover" src={post.feature_image.large} transition:fade />
<div class="cover-overlay" />
<div class="title-container">
  <Heading tags={post.tags} authors={post.authors} title={post.title} />
</div>
<div class="content-container">
  <Content html={post.html} />
</div>
<div class="related-container">
  {#each related as relpost}
    <a href="/posts/{relpost.slug}" class="related" rel="prefetch">
      <img class="cover" src={relpost.feature_image.small} />
      <div class="cover-overlay" />
      <div class="related-title-container">
        <Heading
          tags={relpost.tags}
          authors={relpost.authors}
          title={relpost.title}
          mini />
      </div>

    </a>
  {/each}
</div>
