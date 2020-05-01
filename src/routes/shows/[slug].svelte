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
  .podcasts {
    position: relative;
    top: 60px;
    width: calc(100vw - var(--sidebar-width));
    left: var(--sidebar-width);
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
