<script>
  export let centred;
</script>

<style>
  h1 {
    color: var(--orange);
    font-family: "Equity";
    text-transform: lowercase;
    font-size: var(--fs-main-big);
    line-height: 1.25;
    margin: 0px;
    font-weight: normal;
  }
  .centred {
    text-align: center;
  }
</style>

<h1 class:centred>
  <slot />
</h1>
