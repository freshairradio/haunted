<script context="module">
  export function preload({ path, params, query }) {
    return this.fetch(`home.json`)
      .then((r) => r.json())
      .then((home) => {
        return { home };
      });
  }
</script>

<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import RawHeading from "../components/RawHeading.svelte";
  import ShowImage from "../components/ShowImage.svelte";
  import Control from "../components/Control.svelte";
  import byline from "../util/byline.js";
  import { nowplaying, currentShowInfo } from "../util/nowplaying.store";
  import Content from "../components/Content.svelte";
  import Social from "../components/Social.svelte";
  import Grid from "../components/Grid.svelte";
  import Post from "../components/Post.svelte";
  export let home;
  $: currentShowImage = $currentShowInfo.picture
    ? $currentShowInfo.picture
    : `https://members.freshair.radio/default-show.png`;
  let w;
  let h;

  import { audio } from "../util/audio.store.js";
  let canvas;

  let radioExists = false;
  $: {
    if ($audio.live) {
      radioExists = true;
    }
  }
  onMount(() => {
    window.canvas = canvas;
    let canvasCtx = canvas.getContext("2d");
    let dataArray = new Uint8Array($audio.bufferLength);
    let bufferLength = $audio.bufferLength;
    let frame;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      const WIDTH = w;
      const HEIGHT = h;
      $audio.analyser.getByteTimeDomainData(dataArray);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.strokeStyle = "#ff8810";
      canvasCtx.fillStyle = "#ff8810";

      let sliceWidth = (WIDTH * 1.0) / (bufferLength / 128);
      canvasCtx.lineWidth = sliceWidth / 2;

      let x = 0;
      //   let y = 0;
      let lastV = 0;
      let zeroes = [];
      canvasCtx.beginPath();

      for (let i = 0; i < bufferLength; i += 128) {
        let avg =
          dataArray.slice(i, i + 128).reduce((acc, e) => acc + e, 0) / 128;
        var v = avg / 128.0;
        var y = (v * HEIGHT) / 2;
        var otherV = v == 1 ? v : v > 1 ? 1 - (v - 1) : 1 + (1 - v);
        var otherY = (otherV * HEIGHT) / 2;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.moveTo(x, y);

          canvasCtx.lineTo(x, otherY);
        }

        x += sliceWidth;
      }
      // canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
      canvasCtx.closePath();
      return;
    };
    let timeout;
    const run = () => {
      if (radioExists) {
        draw();
      } else {
        timeout = setTimeout(run, 500);
      }
    };
    run();
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  });
</script>

<style>
  figure {
    position: relative;
    margin: 0px;
  }

  .feature-overlay {
    background: linear-gradient(var(--black-50), var(--black-90));
    position: absolute;
    top: 0px;
  }
  .control-container {
    position: absolute;
    top: 0px;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }

  .control-container :global(.control) {
    justify-self: center;
    align-self: center;
  }

  .waveform {
    position: absolute;
    top: 0px;
  }

  .title-container {
    position: absolute;
    left: var(--sidebar-width);
    top: 0px;
    display: grid;
    width: calc(100vw - var(--sidebar-width));
    height: var(--page-height);
    grid-template-rows: 60px min-content 30px 1fr 10px;
    grid-template-columns: 20px 1fr 400px 40px 400px 1fr 20px;
    text-align: left;
  }

  .image-container {
    grid-column: 3/6;
    grid-row: 4;
    justify-self: center;
  }
  .heading-container {
    grid-row: 2;
    grid-column: 3/6;
    z-index: 3;
  }
  figure,
  .feature,
  .feature-overlay {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    border-radius: 0px;
    height: var(--page-height);
    object-fit: cover;
  }
  figure,
  .feature-overlay {
    position: absolute;
  }
  figure {
    left: var(--ne-sidebar-width);
  }
  .control-container {
    position: absolue;
    top: 0px;
    left: var(--sidebar-width);
    width: calc(100vw - var(--sidebar-width));
    border-radius: 0px;
    height: var(--page-height);
    object-fit: cover;
    z-index: 10;
  }
  .index :global(.control) {
    z-index: 10;
  }

  .content-container {
    position: relative;
    top: var(--page-height);
    background: var(--black-90);
    display: grid;
    grid-template-columns: var(--sidebar-width) auto 700px auto;
  }

  .related-container {
    position: relative;
    top: var(--page-height);
    padding: 100px 0px;
    display: grid;
    background: var(--black-90);
    position: relative;
    padding-left: var(--sidebar-width);
    grid-gap: 30px;
    grid-template-columns: 1fr minmax(auto, 960px) 1fr;
  }
  .related-container > :global(*) {
    grid-column: 2;
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
  .related:nth-child(4) {
    grid-column: 3;
  }
  .related:nth-child(5) {
    grid-column: 4;
  }
  .related:nth-child(6) {
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
  <title>Freshair</title>
</svelte:head>
<svelte:window bind:innerWidth={w} bind:innerHeight={h} />
<div class="title-container index">
  <div class="heading-container">
    {#if $currentShowInfo.title}
      <RawHeading
        subtitle="Live now"
        isShow={true}
        isPodcast={false}
        rating={false}
        title={$currentShowInfo.title} />
    {/if}
  </div>
  <div class="image-container">
    <figure>
      <img
        alt={$currentShowInfo.title}
        class="feature"
        src={currentShowImage}
        transition:fade />
      <div class="feature-overlay" />

      <canvas class="waveform" bind:this={canvas} width={w} height={h} />
      <div class="control-container">
        <Control size={80} />
      </div>
    </figure>
  </div>
</div>
<div class="related-container">
  <Grid>
    {#each home as relpost}
      <Post post={relpost} />
    {/each}
  </Grid>
</div>
