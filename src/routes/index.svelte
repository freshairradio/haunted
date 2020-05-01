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
  const constructAnalyser = () => {
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = audioCtx.createAnalyser();

    let source = audioCtx.createMediaElementSource($audio.ref);
    source.connect(analyser);

    analyser.connect(audioCtx.destination);
    // analyser.connect(audioCtx.destination);

    analyser.fftSize = 16384;
    let bufferLength = analyser.fftSize;
    let dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    return { analyser, dataArray, bufferLength };
  };

  let radioExists = false;
  $: {
    if ($audio.live) {
      radioExists = true;
    }
  }
  onMount(() => {
    let canvasCtx = canvas.getContext("2d");
    let analyser;
    let dataArray;
    let bufferLength;
    let frame;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      const WIDTH = w;
      const HEIGHT = h;
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#ff8810";
      canvasCtx.fillStyle = "#ff8810";

      let sliceWidth = ((WIDTH * 1.0) / bufferLength) * 32;
      let x = 0;
      //   let y = 0;
      let lastV = 0;
      let zeroes = [];
      canvasCtx.beginPath();

      for (let i = 0; i < bufferLength; i += 32) {
        let avg =
          dataArray.slice(i, i + 32).reduce((acc, e) => acc + e, 0) / 32;
        var v = avg / 128.0;
        var y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }
      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
      canvasCtx.closePath();
      return;
    };
    let timeout;
    const run = () => {
      console.log("run", radioExists);
      if (radioExists) {
        let m = constructAnalyser();
        analyser = m.analyser;
        dataArray = m.dataArray;
        bufferLength = m.bufferLength;
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
    left: 220px;
    top: 0px;
    display: grid;
    width: calc(100vw - 220px);
    height: 100vh;
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
    height: 100vh;
    object-fit: cover;
  }
  figure,
  .feature-overlay {
    position: absolute;
  }
  figure {
    left: -220px;
  }
  .control-container {
    position: absolue;
    top: 0px;
    left: 220px;
    width: calc(100vw - 220px);
    border-radius: 0px;
    height: 100vh;
    object-fit: cover;
    z-index: 10;
  }
  .index :global(.control) {
    z-index: 10;
  }

  .content-container {
    position: relative;
    top: 100vh;
    background: var(--black-90);
    display: grid;
    grid-template-columns: 220px auto 700px auto;
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
  .title {
    position: absolute;
    color: var(--orange);
    font-family: "Equity Text B";
    text-transform: lowercase;
    font-size: 80px;
    line-height: 1.25;
    top: calc(100vh - 120px);
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
    top: calc(100vh - 160px);
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
  <title>Freshair</title>
</svelte:head>
<svelte:window bind:outerWidth={w} bind:outerHeight={h} />
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
