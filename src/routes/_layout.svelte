<script context="module">
  export function preload({ path, params, query }) {
    return this.fetch(`settings.json`)
      .then(r => r.json())
      .then(({ settings, extra }) => {
        return { settings: { ...settings, extra } };
      });
  }
</script>

<script>
  import Nav from "../components/Nav.svelte";
  import { fade } from "svelte/transition";
  import { audio } from "../util/audio.store.js";
  import { settings as store } from "../util/settings.store.js";
  export let settings;
  $: {
    store.set(settings);
  }
  import { stores } from "@sapper/app";
  const { preloading, page, session } = stores();
</script>

<style>
  .loading-overlay {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0px;
    left: 0px;
    background: var(--black);
    z-index: 9;
    display: grid;
    justify-content: center;
    align-content: center;
    /* transition: all 0.5s; */
  }

  .logomark {
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
    font-style: italic;
    font-size: 36px;
    margin-left: -10px;
  }

  .logomark img {
    grid-column: 1;
    width: 80px;
    align-items: center;
  }
  .entry {
    transition: opacity 0.2s;
    opacity: 1;
  }
</style>

<svelte:head>
  <!-- {#if $preloading}
    <style>
      body {
        height: 100vh;
        overflow: hidden;
      }
    </style>  {/if} -->
</svelte:head>
<!-- {#if $preloading}
  <div
    class="loading-overlay"
    transition:fade={{ duration: 400 }}
    on:introend={() => window.scrollY(0)}>
    <div class="logomark">
      <img src="https://images.freshair.org.uk/fallback" />
      <h1>
        fresh
        <strong>air</strong>
      </h1>
    </div>
  </div>
{/if} -->
<audio
  crossorigin="anonymous"
  src={$audio.src}
  bind:volume={$audio.volume}
  bind:duration={$audio.duration}
  on:timeupdate={e => ($audio.currentTime = e.target.currentTime)}
  bind:this={$audio.ref} />
<Nav {settings} segment={$page.path} />

<main>
  <slot />
</main>
