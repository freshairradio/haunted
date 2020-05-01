<script>
  import { nowplaying, currentShowInfo } from "../util/nowplaying.store";
  import { audio } from "../util/audio.store";
  import ShowImage from "./ShowImage.svelte";
  import PodcastImage from "./PodcastImage.svelte";
  import Control from "./Control";
  export let segment;
  export let settings;
  import { onMount } from "svelte";

  const updateBroadcastInfo = async () => {
    let b = await fetch("https://nowplaying.freshair.org.uk").then(r =>
      r.json()
    );
    if (b.slug != $nowplaying) {
      nowplaying.set(b.slug);
    }
    setTimeout(updateBroadcastInfo, 30000);
  };
  onMount(updateBroadcastInfo);

  $: currentShowImage = $currentShowInfo.feature_image
    ? $currentShowInfo.feature_image.small
    : `https://cdn.freshair.dev/images/fallback.svg`;
</script>

<style>
  nav {
    width: 200px;
    padding: 10px;
    height: 100vh;
    background: linear-gradient(var(--orange-80), var(--black-80));
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 10;
    overflow-wrap: normal;
  }
  nav a,
  nav .a {
    text-decoration: none;
    display: block;
    color: white;
    font-weight: 100;
    text-transform: lowercase;
    text-align: right;
    font-size: 24px;
    margin: 15px 0px;
    background: transparent;
    border: none;
    width: 100%;
    font-family: Inter;
    cursor: pointer;
  }
  nav a.selected {
    font-weight: 600;
  }
  .show .current {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }

  .links {
    margin-top: 40px;
  }
  .logomark {
    position: absolute;
    bottom: 20px;
    left: 0px;
    width: 220px;
    display: grid;
    grid-template-columns: min-content min-content 1fr;
  }
  .logomark h1 {
    grid-column: 2;
    display: flex;
    margin: 0px;
    align-items: center;
    font-weight: 100;
    color: white;
    font-size: 36px;
    margin-left: -10px;
  }

  .logomark img {
    grid-column: 1;
    width: 80px;
    align-items: center;
  }
</style>

<nav>
  <section class="show">
    {#if $currentShowInfo.feature_image && ($audio.live || !$audio.image)}
      <ShowImage show={$currentShowInfo} size="small" />
    {:else if !$audio.live && $audio.image}
      <PodcastImage size="small" />
    {:else}
      <img class="current" src={currentShowImage} />
    {/if}
  </section>
  <section class="links">
    {#each settings.navigation as link}
      <a rel="prefetch" class:selected={segment === link.url} href={link.url}>
        {link.label}
      </a>
    {/each}
    <button class="a" on:click={audio.playLive}>listen live!</button>
  </section>
  <div class="logomark">
    <img src="https://cdn.freshair.dev/images/fallback.svg" />
    <h1>
      fresh
      <strong>air</strong>
    </h1>
  </div>
</nav>
