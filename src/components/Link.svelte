<script>
  export let href;
</script>

<style>
  a {
    background: var(--orange);
    height: 60px;
    border-radius: 8px;
    line-height: 60px;
    font-size: var(--fs-ui);
    padding: 0px 40px;
    text-decoration: none;
    color: white;
    text-transform: lowercase;
    justify-self: center;
    position: relative;
    text-align: center;
    font-weight: 100;
  }
</style>

<a {href} rel="prefetch">
  <slot />
</a>
