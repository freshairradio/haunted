<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import Heading from "./Heading.svelte";
  import ShowImage from "./ShowImage.svelte";
  import Control from "./Control.svelte";
  import byline from "../util/byline.js";
  import { nowplaying } from "../util/nowplaying.store.js";
  import Content from "./Content.svelte";
  import Social from "./Social.svelte";
  export let show;
</script>

<style>
  .title-container {
    position: relative;
    left: 220px;
    top: 0px;
    display: grid;
    width: calc(100vw - 220px);
    grid-template-rows: 60px min-content 30px 1fr 10px;
    grid-template-columns: 20px 1fr 400px 40px 400px 1fr 20px;
    text-align: left;
  }

  .content-container {
    grid-column: 5;
    grid-row: 4;
  }
  .image-container {
    grid-column: 3;
    grid-row: 4;
  }
  .heading-container {
    grid-row: 2;
    grid-column: 3/6;
  }
  h2 {
    margin: 0px;
    color: var(--orange);
    font-family: "Equity Text B";
    text-transform: lowercase;
    font-weight: normal;
    font-size: 28px;
  }
</style>

<svelte:head>
  <title>{show.title}</title>
</svelte:head>
<!-- <img class="cover" src={show.category.large} transition:fade /> -->
<!-- <div class="cover-overlay" bind:clientWidth={w} bind:clientHeight={h} />
<canvas class="waveform" bind:this={canvas} width={w} height={h} /> -->

<div class="title-container">
  <div class="heading-container">
    <Heading
      slug={show.slug}
      authors={show.authors}
      tags={show.tags}
      title={show.title} />
  </div>
  <div class="image-container">
    <ShowImage {show} />
  </div>
  <div class="content-container">

    <!-- <Social />
    <h2>mondays at 6pm</h2> -->

    <Content html={show.html} />
  </div>
</div>
