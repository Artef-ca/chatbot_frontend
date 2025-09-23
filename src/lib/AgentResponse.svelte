<script lang="ts">
  import { favorites, setFavoriteModal } from "../Functions.svelte";
  import type { MessageContents } from "./types";

  export let toggledChart: boolean = false;
  export let toggleChart: boolean = true;
  export let message: MessageContents;
  export let isAudience:boolean = false
  let alreadyFav=false
  // console.log('FAVS: ',favorites,message)
//   if(message.id){
//     if(favorites.length>1){
//     favorites.forEach(item => {
//     if(item.id == message.id){
//       alreadyFav=true
//       return
//     }
//   })
// }
//   }

  let isFavorite: boolean = false;
  function toggle() {
    toggleChart = !toggleChart;
  }
  var d = new Date(); // for now
  d.getHours(); // => 9
  d.getMinutes(); // =>  30
  d.getSeconds(); // => 51
  $: toggledChart, toggle();
</script>

<li class="max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4">
  <!-- <div class="timestamp">
    {(d.getHours() < 10 ? "0" : "") + d.getHours()}:{(d.getMinutes() < 10
      ? "0"
      : "") + d.getMinutes()}
  </div> -->
  <img
    src="/groqlogo.png"
    class="flex-shrink-0 w-[4rem]
    "
    style="object-fit:cover; height:auto; background-size: cover; -webkit-background-size: cover;"
    alt="agent logo"
  />

  <div class="space-y-3 style {toggleChart ? 'full' : ''} {isAudience?'':'bg'}">
    <slot style="color: var(--text-color);" />
  </div>
  <button
    style="display: contents;"
    on:click={() => {
      if (!isFavorite && !alreadyFav) {
        isFavorite = true;

        setFavoriteModal(true, message)
      }
    }}
  >
    <!-- <img
      style="width: 1rem;"
      src={!isFavorite && !alreadyFav? "/star.svg" : "/starFilled.svg"}
      alt=""
    /> -->
  </button>
</li>

<style>
  .style {
    border-radius: 10px;
    padding: 0.7rem;
    margin-left: 1rem;
    font-size: 0.8rem;
    color: var(--text-color) !important;
    line-height: 1.3 !important;
    /* font-family: "Poppins" !important; */
  }
  .bg{
    /* background-color: var(--primary-light); */

  }
  li {
    display: flex;
    align-items: center;
  }
  .timestamp {
    margin-left: -3rem;
    font-weight: 200;
    text-align: end;
    font-size: 0.7rem;
    color: var(--text-color);
  }

  .full {
    width: 100%;
  }
</style>
