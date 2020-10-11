<script>
  import { nowplaying, currentShowInfo } from "../util/nowplaying.store";
  import { audio } from "../util/audio.store";
  import ShowImage from "./ShowImage.svelte";
  import byline from "../util/byline.js";
  import sc from "../util/schedule.js";

  import PodcastImage from "./PodcastImage.svelte";
  import Podcast from "./Podcast.svelte";
  import Control from "./Control";
  export let segment;
  export let settings;
  settings.navigation = [
    { label: "Shows", url: "/shows/all/" },
    { label: "Music", url: "/teams/music/" },
    { label: "Arts", url: "/teams/arts/" },
    { label: "Join", url: "/get-in-touch/" },
    { label: "About", url: "/about/" }
  ];
  import { onMount } from "svelte";
  let w;
  let h;

  let schedule = sc.schedule;
  const updateBroadcastInfo = async () => {
    let date = new Date();
    let clientHour = "hour" + date.getUTCHours();
    let clientDay = "day" + date.getUTCDay();

    if (schedule[clientDay][clientHour] != "") {
      nowplaying.set(schedule[clientDay][clientHour]);
    }
    setTimeout(updateBroadcastInfo, 30000);
  };
  onMount(updateBroadcastInfo);

  $: currentShowImage = $currentShowInfo.feature_image
    ? $currentShowInfo.feature_image.small
    : `/FreshairWhiteLogo.png`;

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
    background: linear-gradient(rgba(35, 7, 77, 0.8), rgba(204, 83, 51, 0.8));
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 10;
    overflow-wrap: normal;
  }

  .links a {
    text-decoration: none;
    display: block;
    color: white;
    font-weight: 200;
    text-transform: lowercase;
    text-align: right;
    font-size: var(--fs-ui);
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
*/
  .logomark img {
    grid-column: 1;
    width: 100%;
    height: 60px;
    object-fit: contain;
    align-items: center;
  }
  .logomark {
    position: absolute;
    bottom: 20px;
    left: 0px;
    width: 220px;
    display: grid;
    grid-template-columns: 2fr;
  }

  .title {
    background: white;
    display: block;
    margin: 10px 0px;
    border-radius: 8px;
    font-size: var(--fs-normal);
    padding: 5px;
    font-family: Equity;
    text-transform: lowercase;
    color: var(--white);
    text-align: center;
    width: calc(100% - 10px);
  }
  @media (max-width: 1240px) {
    nav {
      width: 100vw;
      height: 60px;
      bottom: 0px;
      top: initial;
      background: linear-gradient(to left, rgb(35, 7, 77), rgb(204, 83, 51));
      padding: 0px;
      display: grid;
      grid-template-columns: 2fr min-content 80px;
    }
    .show {
      grid-column: 1;
    }
    .logomark {
      right: 0px;
      left: initial;
      height: 60px;
      bottom: 0px;
      width: 220px;
      margin: 0px 0px;
      grid-column: 2;
      position: relative;
      align-items: center;
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
      font-size: var(--fs-ui);
      text-align: left;
      width: initial;
      color: var(--white);
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
    background: linear-gradient(
      to left,
      rgba(35, 7, 77, 0.8),
      rgba(204, 83, 51, 0.8)
    );
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
  @media (max-width: 700px) {
    .byline {
      display: none;
    }

    .openmenu .show {
      display: none;
    }
  }
</style>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />

<nav>
  <section class="show" class:oshow={w <= 1240}>
    {#if $currentShowInfo.title && ($audio.live || !$audio.podcast)}
      <ShowImage show={$currentShowInfo} size="small" />
      <a href="/shows/{$currentShowInfo.slug}" class="title">
        {$currentShowInfo.title}
        {#if w <= 1240}<em class="byline">{parsed_byline}</em>{/if}
      </a>
    {:else if !$audio.live && $audio.podcast}
      <PodcastImage size="small" />
      <section class="title">{$audio.podcast.title}</section>
    {/if}
  </section>
  {#if w > 1240}
    <section class="links">
      {#each settings.navigation as link}
        <a rel="prefetch" class:selected={segment === link.url} href={link.url}>
          {link.label}
        </a>
      {/each}
      <!-- <button class="a" on:click={audio.playLive}>listen live!</button> -->
    </section>
  {/if}
  <a class="logomark" href="/">
    <img class="logo-image" src='https://cdn.freshair.radio/logos/FreshairFullWhiteLogo.png' alt="">
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
      {#if currentShowImage && ($audio.live || !$audio.podcast)}
        <ShowImage show={$currentShowInfo} />
      {:else if !$audio.live && $audio.podcast}
        <Podcast podcast={$audio.podcast} />
      {:else}<img class="current" src={currentShowImage} />{/if}
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
      <!-- <button class="a" on:click={audio.playLive}>listen live!</button> -->
    </section>
  </div>
{/if}
