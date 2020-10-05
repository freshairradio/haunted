<script>
  export let subtitle;
  export let title;
  export let isShow;
  export let isPodcast;
  export let rating;
</script>

<style>
  svg {
    width: 40px;
    height: 40px;
  }
  .heading {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr min-content min-content min-content 10px;
    grid-template-columns: 20px 1fr 20px;
    justify-items: end;
    text-align: right;
  }
  .heading {
    justify-items: start;
    text-align: left;
    grid-template-columns: 0px 1fr 0px;
  }

  .title {
    grid-column: 2;
    grid-row: 4;
    color: white;
    font-family: "Equity";
    text-transform: lowercase;
    font-size: var(--fs-main-big);
    line-height: 1.25;
    margin: 0px;
    font-weight: normal;
  }

  .heading.show .title {
    padding-left: var(--fs-main-big);
  }
  .byline {
    grid-column: 2;
    grid-row: 3;
    color: #fff;
    font-family: "Equity";
    font-size: var(--fs-secondary-big);
    line-height: 1.25;
    margin: 0px;
    font-weight: normal;
    font-style: italic;
  }
  .stars {
    grid-column: 2;
    grid-row: 2;
    font-family: "Equity";
    display: flex;
    margin: 0px;
    font-weight: normal;
    margin: 4px 0px;
  }
  .mini .title {
    font-size: var(--fs-main-small);
  }
  .mini .byline {
    font-size: var(--fs-secondary-small);
  }
  .mini svg {
    width: 30px;
    height: 30px;
  }
</style>

<div class="heading" class:show={isShow} class:podcast={isPodcast}>
  <h2 class="byline">{subtitle}</h2>
  <h1 class="title">{title}</h1>
</div>
