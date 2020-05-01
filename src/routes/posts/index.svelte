<script context="module">
  export function preload({ path, params, query }) {
    return this.fetch(`shows.json`)
      .then(r => r.json())
      .then(({ posts, meta }) => {
        return { shows: posts, pagination: meta.pagination };
      });
  }
</script>

<script>
  import Show from "../../components/Show";
  export let shows;
  export let pagination;
</script>

<style>
  .shows {
    margin: 40px 20px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fit, 250px);
    justify-content: center;
  }
</style>

<svelte:head>
  <title>Blog</title>
</svelte:head>
<div class="shows">
  {#each shows as show}
    <Show {show} />
  {/each}
</div>
