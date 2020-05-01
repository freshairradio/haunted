<script context="module">
  export function preload({ path, params, query }) {
    return this.fetch(`shows/${params.slug}.json`)
      .then(r => r.json())
      .then(({ podcasts, ...show }) => {
        return { show, podcasts };
      });
  }
</script>

<script>
  import Podcast from "../../components/Podcast.svelte";
  import image from "../../util/image.js";
  import Show from "../../components/Show.svelte";
  export let show;
  export let podcasts;
</script>

<style>
  .show-page .cover {
    width: 400px;
    height: 400px;
    border-radius: 4px;
    object-fit: cover;
    grid-row: 1/3;
    grid-column: 2/4;
    z-index: 2;
    background-color: #ffa515;
  }

  .show-description h1 {
    margin: 0px;
    /* color: #FFA515; */
  }
  .show-description {
    background: #444;
    border-radius: 4px;
    display: grid;
    grid-template-columns: 360px 1fr;
    grid-template-rows: min-content min-content 1fr;
    grid-row: 2/6;
    grid-column: 3/5;
    width: 100%;
  }
  .show-title {
    grid-row: 1;
    grid-column: 4/5;
    align-self: center;
  }
  .show-page {
    margin: 40px;
    display: grid;
    grid-template-columns: auto 40px 360px minmax(400px, 600px) auto;
    grid-template-rows: 80px 320px 80px auto;
    font-weight: 200;
  }
  .content {
    padding: 10px 20px;
    grid-row: 2;
    grid-column: 2;
  }
  .authors {
    padding: 10px 20px;
    padding-bottom: 0px;
    grid-row: 1;
    grid-column: 2;
  }
  .author {
    display: inline-grid;
    height: 30px;
    grid-template-columns: 30px 1fr;
    border-radius: 30px;
    background: #ffa515;
    margin: 5px;
  }
  .author .avatar {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    object-fit: cover;
  }
  .author h2 {
    margin: 0px;
    font-weight: 300;
    font-size: 16px;
    line-height: 30px;
    padding: 0px 8px;
  }
  .highlight {
    color: #ffa515;
  }
  .podcasts {
    position: relative;
    top: 60px;
    width: calc(100vw - 220px);
    left: 220px;
    padding-bottom: 100px;
  }
</style>

<svelte:head>
  <title>{show.title}</title>
</svelte:head>

<Show {show} />
<!-- <div>
  <section class="show-page">
    <img class="cover" src={show.feature_image.large} />

    <h1 class="show-title">
      <span class="highlight">{show.title}</span>
    </h1>
    <div class="show-description">

      <div class="authors">
        {#each show.authors as author}
          <div class="author">
            <img class="avatar" src={author.profile_image.small} />
            <h2>{author.name}</h2>
          </div>
        {/each}
      </div>
      <div class="content">
        {@html show.html}
      </div>
    </div>

  </section> -->
<section class="podcasts">
  {#each podcasts as podcast}
    <Podcast {podcast} />
  {/each}
</section>
