<script>
  export let html;
</script>

<style>
  .content :global(*) {
    color: white;
    font-size: var(--fs-normal);
    line-height: 1.45;
    font-weight: 100;
  }
  .content :global(strong) {
    color: white;
    font-size: var(--fs-normal);
    line-height: 1.45;
    font-weight: normal;
  }
  .content :global(iframe) {
    width: 100%;
  }
  .content :global(figure img) {
    width: 100%;
    border-radius: 8px;
  }
</style>

<div class="content">
  {@html html}
</div>
