<script>
  export let slug = "nothing";
  export let tags = [];
  export let authors = [];
  export let title = "";
  export let mini;
  export let published;

  import { nowplaying } from "../util/nowplaying.store.js";

  import image from "../util/image.js";
  import stars from "../util/stars.js";
  import byline from "../util/byline.js";
  $: isLive = $nowplaying === slug;

  $: isShow = !!tags.find(t => t.slug == "hash-show");

  $: isPost = !!tags.find(t => t.slug == "hash-article");
  $: isPodcast = !!tags.find(t => t.slug == "hash-podcast");
  $: parsed_byline = byline(authors, tags, { isShow, isLive });
  $: rating = stars(tags);
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
  .heading.show {
    justify-items: start;
    text-align: left;
    grid-template-columns: 0px 1fr 0px;
  }
  .heading.podcast {
    justify-items: start;
    text-align: left;
    grid-template-columns: 0px 1fr 0px;
  }
  .title {
    grid-column: 2;
    grid-row: 4;
    color: var(--orange);
    font-family: "Equity Text B";
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
    font-family: "Equity Text B";
    font-size: var(--fs-secondary-big);
    line-height: 1.25;
    margin: 0px;
    font-weight: normal;
    font-style: italic;
  }
  .stars {
    grid-column: 2;
    grid-row: 2;
    font-family: "Equity Text B";
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

<div class="heading" class:mini class:show={isShow} class:podcast={isPodcast}>
  {#if rating}
    <div class="stars">
      {#each rating[0] as _}
        <svg id="emoji" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
          <g id="color">
            <polygon
              fill="#fff"
              stroke="none"
              points="35.9928,10.7363 27.7913,27.3699 9.4394,30.0436
              22.7245,42.9838 19.5962,61.2637 36.0084,52.6276 52.427,61.2515
              49.2851,42.9739 62.5606,30.0239 44.2067,27.3638" />
          </g>
          <g id="hair" />
          <g id="skin" />
          <g id="skin-shadow" />
          <g id="line">
            <polygon
              fill="none"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="2"
              points="35.9928,10.7363 27.7913,27.3699 9.4394,30.0436
              22.7245,42.9838 19.5962,61.2637 36.0084,52.6276 52.427,61.2515
              49.2851,42.9739 62.5606,30.0239 44.2067,27.3638" />
          </g>
        </svg>
      {/each}
      {#each rating[1] as _}
        <svg id="emoji" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
          <g id="color">
            <polygon
              fill="transparent"
              stroke="none"
              points="35.9928,10.7363 27.7913,27.3699 9.4394,30.0436
              22.7245,42.9838 19.5962,61.2637 36.0084,52.6276 52.427,61.2515
              49.2851,42.9739 62.5606,30.0239 44.2067,27.3638" />
          </g>
          <g id="hair" />
          <g id="skin" />
          <g id="skin-shadow" />
          <g id="line">
            <polygon
              fill="none"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="2"
              points="35.9928,10.7363 27.7913,27.3699 9.4394,30.0436
              22.7245,42.9838 19.5962,61.2637 36.0084,52.6276 52.427,61.2515
              49.2851,42.9739 62.5606,30.0239 44.2067,27.3638" />
          </g>
        </svg>
      {/each}

    </div>
  {/if}
  <h2 class="byline">{isPodcast ? `published ${published}` : parsed_byline}</h2>
  <h1 class="title">{title}</h1>

</div>
