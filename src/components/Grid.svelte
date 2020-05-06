<style>
  .grid {
    display: grid;
    grid-gap: 30px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    justify-content: center;
  }
</style>

<section class="grid">
  <slot />
</section>
