<script>
  import { onMount } from "svelte";

  import PodcastControl from "./PodcastControl";
  import byline from "../util/byline.js";
  import { nowplaying } from "../util/nowplaying.store.js";
  import { audio, others } from "../util/audio.store.js";
  export let size = "big";
</script>

<style>
  .feature {
    background: linear-gradient(to left, rgb(35, 7, 77), rgb(204, 83, 51));
  }
  figure {
    position: relative;
    margin: 0px;
  }
  figure,
  .feature,
  .feature-overlay,
  .control-container {
    height: 400px;
    width: 400px;
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
    background: linear-gradient(var(--black-90), transparent);
    position: absolute;
    top: 0px;
    height: 50px !important;
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
    width: 400px;
    height: 400px;
    position: absolute;
    top: 0px;
  }
  .time {
    position: absolute;
    right: 10px;
    top: 10px;
    font-family: "Equity";
    font-style: italic;
    font-size: 20px;
    color: white;
  }
</style>

<figure class={size}>
  <img
    alt={$audio.podcast && $audio.podcast.image}
    class="feature"
    src={$audio.podcast && $audio.podcast.feature_image && $audio.podcast.feature_image.small} />
  <div>
    <div class="feature-overlay" />

    <div class="control-container">
      <PodcastControl size={50} podcast={$audio.podcast} />

      <div class="time">
        {Math.round(($audio.duration - $audio.currentTime) / 60).toString()}m
        left
      </div>
    </div>
  </div>
</figure>
