<script lang="ts">
  import { onMount } from "svelte";
  import { isadding } from "../Functions.svelte";
  let adding: boolean = false;
  export let item;
  let img: any = "";
  isadding.subscribe((data) => {
    adding = data.enabled;
  });
  let figJson: any;
  if (item.fig != "") {
    figJson = JSON.parse(item.fig);
  }

  let id =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  onMount(() => {
    if (item.fig != "") {
      Plotly.newPlot(document.getElementById(id), figJson, {
        responsive: true,
      });
      Plotly.toImage(figJson).then((dataURI: any) => {
        console.log("img: ", dataURI);
        img = dataURI;
      });
    }
  });
</script>

<div {id} style="display: none;"></div>

<div class="item {adding ? 'adding' : ''}">
  <div class="title">{item.title}</div>
  <!-- <div class="title">{item.title}</div> -->
  <div class="info">
    <div class="question">
      {item.question}
    </div>
    <div class="divider"></div>
    <div class="thumb">
      <!-- <Plotly fig={item.data.fig} /> -->

      <img src={img} alt="" />
    </div>
  </div>
</div>

<style>
  .item {
    width: 100%;
    background: var(--primary);
    /* height: 5rem; */
    margin-bottom: 1rem;
    color: var(--text-color);
    padding: 0.3rem;
    /* margin: 1rem; */
    border-radius: 0.5rem;
  }
  .adding {
    border: 1px solid lightgray;
    transition: ease-out 100ms;
  }
  .adding:hover {
    border: 2px solid white;
  }
  .item .title {
  }
  .item .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 0.3rem;
    padding-top: 0.3rem;
  }

  .item .info .question {
    font-size: 0.7rem;
    font-weight: 300;
    width: 60%;
  }
  .item .info .divider {
    min-height: 2rem;
    max-height: 4rem;
    width: 1px;
    background-color: white;
  }
  .item .info .thumb {
    padding: 0.4rem;
    width: 40%;
  }
</style>
