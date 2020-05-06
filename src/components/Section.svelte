<script>
  export let top;
</script>

<style>
  .page-section {
    position: relative;
    padding-left: var(--sidebar-width);
    margin: 0px;
    display: grid;
    grid-gap: 30px;
    grid-template-columns: 1fr minmax(auto, 960px) 1fr;
    grid-template-rows: min-content min-content auto min-content;
    justify-content: center;
    background: var(--black-90);
    padding-bottom: 100px;
  }
  .page-section > :global(*) {
    grid-column: 2;
  }
</style>

<section class="page-section" style="top: {top}">
  <slot />
</section>
