<script>
  import { onMount } from "svelte";

  import Control from "./Control";
  import byline from "../util/byline.js";
  import { nowplaying } from "../util/nowplaying.store.js";
  import { audio } from "../util/audio.store.js";
  export let show;
  export let size = "big";
  $: dimensions = Math.min(size == "big" ? 400 : 200, ww - 40);
  $: isLive = $nowplaying === show.slug;
  let canvas;

  let radioExists = false;
  $: {
    if ($audio.live) {
      radioExists = true;
    }
  }
  let ww;
  let wh;
  onMount(() => {
    let canvasCtx = canvas.getContext("2d");
    let dataArray = new Uint8Array($audio.bufferLength);
    let bufferLength = $audio.bufferLength;
    let frame;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!$audio.live || !isLive) return;
      const WIDTH = dimensions;
      const HEIGHT = dimensions;
      $audio.analyser.getByteTimeDomainData(dataArray);

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
  .feature {
    background: var(--orange);
  }
  figure {
    position: relative;
    margin: 0px;
  }
  figure,
  .feature,
  .feature-overlay,
  .control-container {
    border-radius: 8px;
  }
  figure.small,
  figure.small .feature,
  figure.small .feature-overlay,
  figure.small .control-container {
    height: 200px;
    width: 200px;
  }
  .feature-overlay {
    background: linear-gradient(
      var(--black-20),
      var(--black-90),
      var(--black-20)
    );
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
  figure.small .control-container :global(.control) {
    justify-self: right;
    align-self: end;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .waveform {
    position: absolute;
    top: 0px;
  }
  @media (max-width: 440px) {
  }
  figure.small .waveform {
    width: 200px;
    height: 200px;
  }
  div.hide {
    display: none;
  }
</style>

<svelte:window bind:innerWidth={ww} bind:innerHeight={wh} />
<figure class={size} style="width:{dimensions}px;height:{dimensions}px">
  <img
    alt={show.title}
    class="feature"
    src={show.picture || 'https://members.freshair.radio/default-show.png'}
    style="width:{dimensions}px;height:{dimensions}px" />
  <div class:hide={!isLive}>
    {#if $audio.live}
      <div class="feature-overlay" />
    {/if}
    <canvas
      style={!$audio.live ? `display:none` : ``}
      class="waveform"
      bind:this={canvas}
      width={dimensions}
      height={dimensions} />
    <div
      class="control-container"
      style="width:{dimensions}px;height:{dimensions}px">
      <Control size={size == 'big' ? 60 : 50} />
    </div>
  </div>
</figure>
