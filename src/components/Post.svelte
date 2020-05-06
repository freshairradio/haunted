<script>
  import Heading from "./Heading";

  export let post;
</script>

<style>
  .post,
  .post .cover,
  .post .cover-overlay,
  .title-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
    min-width: 300px;
    border-radius: 8px;
  }
  .post .cover,
  .post .cover-overlay {
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .post,
  .title-container {
    position: relative;
  }

  .post .cover {
    object-fit: cover;
  }
  .post .cover-overlay {
    background: linear-gradient(var(--black-50), var(--black-90));
  }
</style>

<a href="/posts/{post.slug}" class="post" rel="prefetch">
  <img class="cover" src={post.feature_image.small} alt={post.title} />
  <div class="cover-overlay" />
  <div class="title-container">
    <Heading tags={post.tags} authors={post.authors} title={post.title} mini />
  </div>

</a>
