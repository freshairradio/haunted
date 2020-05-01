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
    background-color: var(--orange);
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
</style>

<a rel="prefetch" href="shows/{show.slug}" class="show" {style}>
  <img class="cover" src={show.feature_image.small} />
  <!-- <div class="title">
    <span class="highlight">show/</span>
    {show.title}
  </div> -->

</a>
