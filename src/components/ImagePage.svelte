<script>
  export let image;
  export let top = "100vh";
</script>

<style>
  .cover {
    position: fixed;
    width: 100vw;
    height: var(--page-height);
    top: 0px;
    left: 0px;
    object-fit: cover;
    z-index: 0;
  }
  .cover-overlay {
    position: absolute;
    height: 50vh;
    width: 100vw;
    top: 0vh;
    left: 0px;
    background: linear-gradient(transparent, var(--black-90));
    transition: all 0.2s;
  }
</style>

<img class="cover" src={image} />
<div class="cover-overlay" style="height: {top}" />
<slot />
