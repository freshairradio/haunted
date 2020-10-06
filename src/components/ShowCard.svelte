<script>
  export let show;
  import image from "../util/image.js";
  export let style;
</script>

<style>
  .show {
    display: block;
    position: relative;
  }
  .cover {
    background-color: linear-gradient(to left, rgb(35, 7, 77), rgb(204, 83, 51));
  }
  .show,
  .show img {
    width: 300px;
    height: 300px;
    border-radius: 8px;
  }
  .show img {
    object-fit: cover;
  }
  .title {
    position: absolute;
    bottom: 0px;
    font-size: var(--fs-main-small);
    padding: 20px;
    background: rgba(0, 0, 0, 0.8);
    line-height: 1.5;
    font-family: Equity;
    color: white;
    border-radius: 8px;
    height: calc(100% - 40px);
    width: calc(100% - 40px);
  }
</style>

<a rel="prefetch" href="shows/{show.slug}" class="show" {style}>
  <img
    class="cover"
    src={show.picture || 'https://members.freshair.radio/default-show.png'} />
  {#if !show.picture}
    <div class="title">{show.title}</div>
  {/if}
</a>
