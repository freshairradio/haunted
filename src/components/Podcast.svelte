<script>
  export let podcast;
  import PodcastControl from "./PodcastControl.svelte";
  import image from "../util/image.js";
  import { progress } from "../util/progress.store.js";
  import Content from "./Content.svelte";
  import Heading from "./Heading.svelte";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  let w;
  let h;
  import Control from "./Control";
  import byline from "../util/byline.js";
  import { nowplaying } from "../util/nowplaying.store.js";
  import { audio, others } from "../util/audio.store.js";
  $: playing = !$audio.paused && $audio.src == podcast.audio;
  let canvas;

  onMount(() => {
    let canvasCtx = canvas.getContext("2d");
    let dataArray = new Uint8Array($audio.bufferLength);
    let bufferLength = $audio.bufferLength;
    let frame;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!playing) return;
      const WIDTH = w - 150;
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
      if (playing) {
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
  .podcast-container {
    width: 800px;
    max-width: 100%;
    margin: 0 auto;
  }
  .podcast {
    display: grid;
    position: relative;
    margin: 40px;
    margin-bottom: 10px;
    background: #3c3c3c;
    border-radius: 4px;
    grid-gap: 10px;
    height: 130px;
    padding: 10px 0px;
    grid-template-columns: 150px 1fr 40px 40px 0px;
  }
  .podcast-image {
    height: 150px;
    width: 150px;
    position: absolute;
    top: 0px;
    left: 0px;
    border-radius: 8px 0px 0px 8px;
  }
  .podcast :global(.heading) {
    grid-column: 2/5;
    z-index: 1;
  }
  .podcast :global(.control) {
    justify-self: center;
    align-self: center;
    z-index: 1;
  }
  .content {
    margin: 40px;
    margin-top: 10px;
  }

  .show-title {
    grid-row: 1;
    grid-column: 2;
    align-self: center;
    padding: 0 10px;
    align-self: start;
  }
  .content {
    grid-row: 2;
    grid-column: 2;
    padding: 0 10px;
    font-weight: 200;
  }
  .waveform {
    position: absolute;
    left: 150px;
  }
  .current {
    position: absolute;
    left: 150px;
    height: 150px;
    background: white;
    opacity: 0.4;
  }
  .time {
    position: absolute;
    right: 10px;
    top: 10px;
    font-family: "Equity Text B";
    font-style: italic;
    font-size: 20px;
    color: white;
  }
</style>

<div class="podcast-container">
  <section class="podcast" bind:clientWidth={w} bind:clientHeight={h}>
    <img src={podcast.feature_image.small} class="podcast-image" />

    <PodcastControl
      podcast={{ src: podcast.audio, title: podcast.title, image: podcast.feature_image.small }} />

    <canvas
      style={!playing ? `display:none` : ``}
      class="waveform"
      bind:this={canvas}
      width={w - 150}
      height={h} />
    {#if $others && $others[podcast.audio]}
      <div
        class="current"
        style="width:{($others[podcast.audio].current / $others[podcast.audio].duration) * (w - 150)}px" />
      <div class="time">
        {Math.round(($others[podcast.audio].duration - $others[podcast.audio].current) / 60).toString()}m
        left
      </div>
    {/if}
    <Heading
      tags={podcast.tags}
      authors={podcast.authors}
      title={podcast.title}
      published={podcast.published_at}
      mini />

  </section>
  <div class="content">
    {#if podcast.content}
      <Content html={podcast.content} />
    {/if}
  </div>
</div>
