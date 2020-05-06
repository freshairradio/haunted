<script>
  export let html;
  import Content from "./Content.svelte";
</script>

<style>
  section {
    position: relative;
    display: grid;
    grid-template-columns:
      1fr minmax(auto, 700px)
      1fr;
  }
  section :global(.content) {
    grid-column: 2;
  }
</style>

<section>
  <Content {html} />
</section>
