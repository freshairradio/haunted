<script>
  import { audio } from "../util/audio.store.js";
  export let size = 50;
  export let podcast = null;
  $: playing = $audio.live && $audio.volume == 1;
</script>

<style>
  .control {
    background: var(--orange);
    border-radius: 100%;
    cursor: pointer;
    box-shadow: 0px 0px 5px white;
    border: none;
    display: grid;
    justify-content: center;
    align-content: center;
    cursor: pointer;
    padding: 0px;
    outline: none;
  }
  .control svg {
    width: inherit;
    height: inherit;
  }
</style>

<button
  class="control"
  on:click={playing ? audio.pauseLive : audio.playLive}
  style="width:{size}px;height:{size}px">
  {#if !playing}
    <svg id="emoji" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
      <g id="color" />
      <g id="hair" />
      <g id="skin" />
      <g id="skin-shadow" />
      <g id="line">
        <path
          fill="none"
          stroke="#fff"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          d="M19.5816,55.6062
          c0.4848,0.1782,1.0303,0.297,1.5758,0.297c0.8485,0,1.697-0.297,2.4242-0.7722l30-15.9793l0.303-0.297
          c0.7879-0.7722,1.2121-1.7227,1.2121-2.7919c0-1.0692-0.4242-2.0791-1.2121-2.7919l-0.303-0.297l-30-16.0981
          c-1.0909-0.8316-2.6667-1.0098-4-0.4752c-1.5152,0.594-2.4848,2.0791-2.4848,3.683v31.8397
          C17.0967,53.5272,18.0664,55.0122,19.5816,55.6062z" />
      </g>
    </svg>
  {:else}
    <svg id="emoji" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
      <g id="color" />
      <g id="hair" />
      <g id="skin" />
      <g id="skin-shadow" />
      <g id="line">
        <path
          fill="#fff"
          d="M49.2614,18C51.8743,18,54,20.1257,54,22.7386v26.5229C54,51.8743,51.8743,54,49.2614,54H22.7386
          C20.1257,54,18,51.8743,18,49.2614V22.7386C18,20.1257,20.1257,18,22.7386,18H49.2614
          M49.2614,16H22.7386
          C19.017,16,16,19.017,16,22.7386v26.5229C16,52.983,19.017,56,22.7386,56h26.5229C52.983,56,56,52.983,56,49.2614V22.7386
          C56,19.017,52.983,16,49.2614,16L49.2614,16z"
          stroke="none" />
      </g>
    </svg>
  {/if}
</button>
