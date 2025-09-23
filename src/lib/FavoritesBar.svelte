<script lang="ts">
  import { onMount } from "svelte";
  import { captureElement, getAllFavorites } from "../Functions.svelte";
  import FavoritesItem from "./FavoritesItem.svelte";
  let favorites: any[]=[]

  onMount(async () => {
    getAllFavorites().then((data: any) => {
      favorites = data.data;
      console.log("favs", favorites);
    });
  });
</script>

<div class="main">
  <div class="title">Favorites</div>
  <div class="items">
    {#each favorites as item}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div on:click={() => captureElement(item)}>
        <FavoritesItem {item}></FavoritesItem>
      </div>
    {/each}
  </div>
</div>

<style>
  .main {
    min-width: 13rem;
    max-width: 15rem;
    background: var(--primary-light);
    height: 90vh;
    margin: 0.5rem;
    border-radius: 1rem;
    padding-bottom: 1rem;
  }
  .title {
    padding: 0.5rem;
    padding-left: 1rem;
    font-weight: 500;
    font-size: 1.2rem;
    color: var(--text-color);
  }
  .items {
    padding: 1rem;
    overflow: scroll;
    height: 93%;
    overflow-x: hidden;
  }
</style>
