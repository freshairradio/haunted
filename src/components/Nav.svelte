<script>
  import { nowplaying, currentShowInfo } from "../util/nowplaying.store";
  import { audio } from "../util/audio.store";
  import ShowImage from "./ShowImage.svelte";
  import byline from "../util/byline.js";

  import PodcastImage from "./PodcastImage.svelte";
  import Podcast from "./Podcast.svelte";
  import Control from "./Control";
  export let segment;
  export let settings;
  import { onMount } from "svelte";
  let w;
  let h;
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

  $: parsed_byline = byline(
    $currentShowInfo.authors || [],
    $currentShowInfo.tags || [],
    {
      isShow: true,
      isLive: $audio.live,
      prefix: true
    }
  );
  let menuOpen = false;
  const toggleMenu = () => {
    if (menuOpen) {
      document.body.style.overflow = "auto";
      menuOpen = false;
    } else {
      document.body.style.overflow = "hidden";
      menuOpen = true;
    }
  };
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

  .links a,
  .links .a {
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
  .links a.selected {
    font-weight: 600;
  }
  .show .current {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }

  .links {
    margin-top: 20px;
  }
  /* With logo */
  /* .logomark {
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
  } */
  .logomark {
    position: absolute;
    bottom: 20px;
    left: 0px;
    width: 220px;
    display: grid;
    grid-template-columns: 1fr;
  }
  .logomark h1 {
    display: flex;
    margin: 0px;
    justify-self: center;
    align-items: center;
    font-weight: 100;
    color: white;
    font-size: 36px;
    margin-bottom: 20px;
  }
  .title {
    background: white;
    display: block;
    margin: 10px 0px;
    border-radius: 8px;
    font-size: 21px;
    padding: 5px;
    font-family: Equity Text B;
    text-transform: lowercase;
    color: var(--orange);
    text-align: center;
    width: calc(100% - 10px);
  }
  @media (max-width: 1240px) {
    nav {
      width: 100vw;
      height: 60px;
      bottom: 0px;
      top: initial;
      background: linear-gradient(to left, var(--orange), var(--black));
      padding: 0px;
      display: grid;
      grid-template-columns: 1fr min-content 80px;
    }
    .show {
      grid-column: 1;
    }
    .logomark {
      right: 0px;
      left: initial;
      height: 60px;
      bottom: 0px;
      width: initial;
      margin: 0px 20px;
      grid-column: 2;
      position: relative;
    }
    .logomark h1 {
      margin: 0px;
    }
    nav .oshow :global(figure),
    nav .oshow :global(figure) :global(img),
    nav .oshow :global(figure) :global(.control-container) {
      width: 60px !important;
      height: 60px !important;
      border-radius: 0px;
    }
    nav .oshow :global(figure) :global(.control) {
      margin: 0px !important;
      justify-self: center !important;
      align-self: center !important;
    }
    nav .oshow :global(figure) :global(.feature-overlay),
    nav .oshow :global(figure) :global(.waveform) {
      display: none;
    }
    nav .oshow .title {
      position: absolute;
      top: 0px;
      color: white;
      background: transparent;
      left: 80px;
      border-radius: 0px;
      font-size: 24px;
      text-align: left;
      width: initial;
      color: var(--orange);
    }
    .title em {
      color: white;
    }
    nav .oshow :global(.time) {
      display: none;
    }
  }
  .menu {
    background: transparent;
    padding: 0px;
    margin: 0px;
    cursor: pointer;
    border: none;
    width: 80px;
    padding: 0px 10px;
  }
  .openmenu {
    position: fixed;
    top: 0px;
    left: 0px;
    width: calc(100vw - 40px);
    height: calc(100vh - 60px);
    padding: 0px 20px;
    z-index: 20;
    background: var(--orange-90);
  }
  .openmenu .links {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
  .openmenu .show {
    display: grid;
    justify-items: center;
    margin-top: 40px;
  }
</style>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />

<nav>
  <section class="show" class:oshow={w <= 1240}>
    {#if $currentShowInfo.feature_image && ($audio.live || !$audio.podcast)}
      <ShowImage show={$currentShowInfo} size="small" />
      <a href="/shows/{$currentShowInfo.slug}" class="title">
        {$currentShowInfo.title}
        {#if w <= 1240}
          <em>{parsed_byline}</em>
        {/if}
      </a>
    {:else if !$audio.live && $audio.podcast}
      <PodcastImage size="small" />
      <section class="title">{$audio.podcast.title}</section>
    {:else}
      <img class="current" src={currentShowImage} />
    {/if}
  </section>
  {#if w > 1240}
    <section class="links">
      {#each settings.navigation as link}
        <a rel="prefetch" class:selected={segment === link.url} href={link.url}>
          {link.label}
        </a>
      {/each}
      <button class="a" on:click={audio.playLive}>listen live!</button>
    </section>
  {/if}
  <a class="logomark" href="/">
    <h1>
      fresh
      <strong>air</strong>
    </h1>
  </a>
  {#if w <= 1240}
    <button class="menu" on:click={toggleMenu}>
      <svg id="emoji" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
        <g id="color" />
        <g id="hair" />
        <g id="skin" />
        <g id="skin-shadow" />
        <g id="line">
          <line
            x1="16"
            x2="56"
            y1="26"
            y2="26"
            fill="none"
            stroke="#fff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            stroke-width="2" />
          <line
            x1="16"
            x2="56"
            y1="36"
            y2="36"
            fill="none"
            stroke="#fff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            stroke-width="2" />
          <line
            x1="16"
            x2="56"
            y1="46"
            y2="46"
            fill="none"
            stroke="#fff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            stroke-width="2" />
        </g>
      </svg>
    </button>
  {/if}

</nav>
{#if w <= 1240 && menuOpen}
  <div class="openmenu">
    <section class="show">
      {#if $currentShowInfo.feature_image && ($audio.live || !$audio.podcast)}
        <ShowImage show={$currentShowInfo} />
      {:else if !$audio.live && $audio.podcast}
        <Podcast podcast={$audio.podcast} />
      {:else}
        <img class="current" src={currentShowImage} />
      {/if}
    </section>
    <section class="links">
      {#each settings.navigation as link}
        <a
          rel="prefetch"
          class:selected={segment === link.url}
          href={link.url}
          on:click={toggleMenu}>
          {link.label}
        </a>
      {/each}
      <button class="a" on:click={audio.playLive}>listen live!</button>
    </section>
  </div>
{/if}
