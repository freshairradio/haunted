<script context="module">
  export function preload({ path, params, query }) {
    return this.fetch(`home.json`)
      .then(r => r.json())
      .then(home => {
        return { home };
      });
  }
</script>

<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import Heading from "../components/Heading.svelte";
  import ShowImage from "../components/ShowImage.svelte";
  import Control from "../components/Control.svelte";
  import byline from "../util/byline.js";
  import { nowplaying, currentShowInfo } from "../util/nowplaying.store";
  import Content from "../components/Content.svelte";
  import Social from "../components/Social.svelte";
  export let home;
  $: currentShowImage = $currentShowInfo.feature_image
    ? $currentShowInfo.feature_image.large
    : ``;
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

      let sliceWidth = (WIDTH * 1.0) / (bufferLength / 64);
      canvasCtx.lineWidth = sliceWidth / 2;

      let x = 0;
      //   let y = 0;
      let lastV = 0;
      let zeroes = [];
      canvasCtx.beginPath();

      for (let i = 0; i < bufferLength; i += 64) {
        let avg =
          dataArray.slice(i, i + 64).reduce((acc, e) => acc + e, 0) / 64;
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
    left: -var(--sidebar-width);
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
  <title>Freshair</title>
</svelte:head>
<svelte:window bind:innerWidth={w} bind:innerHeight={h} />
<div class="title-container index">
  <div class="heading-container">
    {#if $currentShowInfo.feature_image}
      <Heading
        slug={$currentShowInfo.slug}
        authors={$currentShowInfo.authors}
        tags={$currentShowInfo.tags}
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
  {#each home as relpost, i}
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
