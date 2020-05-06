<script>
  import Title from "../../components/Title.svelte";
  import Link from "../../components/Link.svelte";
  import Post from "../../components/Post.svelte";
  import Grid from "../../components/Grid.svelte";
  import ShowCard from "../../components/ShowCard";
  import Heading from "../../components/Heading";
  import { settings } from "../../util/settings.store.js";

  import { nowplaying, currentShowInfo } from "../../util/nowplaying.store";
  export let posts;
  export let team;
  export let image;
  let w;
  let h;
  const columns = w <= 1020 ? [3, 4] : [3, 4, 5];
</script>

<style>
  section {
    position: relative;
    padding-left: var(--sidebar-width);
    top: 75vh;
    margin: 0px;
    display: grid;
    grid-gap: 30px;
    grid-template-columns: 1fr minmax(auto, 960px) 1fr;
    grid-template-rows: min-content min-content auto min-content;
    justify-content: center;
    background: var(--black-90);
  }

  .background {
    position: fixed;
    width: 100vw;
    height: var(--page-height);
    top: 0px;
    left: 0px;
    object-fit: cover;
    z-index: 0;
  }
  .overlay {
    position: absolute;
    height: 75vh;
    width: 100vw;
    top: 0vh;
    left: 0px;
    background: linear-gradient(transparent, var(--black-90));
    transition: all 0.2s;
  }
</style>

<img class="background" src={image.large} alt={image.large} />
<div class="overlay" />
<section>
  <slot />
</section>
