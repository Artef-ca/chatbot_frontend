<script lang="ts">
  import { addMessage, audienceSegment_writable, audienceType_writable, newQuestion } from "../chatFunctions.svelte";
  import { favorites, setFavoriteModal } from "../Functions.svelte";
  import type { MessageContents } from "./types";

  export let toggledChart: boolean = false;
  export let toggleChart: boolean = true;
  export let message: MessageContents;
  let alreadyFav = false;

  function askQuestion(q: any) {
    let message = {
      data: {
        type: "user_question",
        dataframe: "",
        fig: "",
        message_id: "",
        question: q,
        response: q,
        sql_query: "",
      },
      state: true,
    };

    newQuestion(q, "user");
  }
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
    class="flex-shrink-0 w-[3rem]
      "
    style="height:fit-content"
    alt="agent logo"
  />
  <div class="body">
    <div class="space-y-3 style {toggleChart ? 'full' : ''}">
      <slot style="color: var(--text-color);" />
    </div>
    <div  class="selections">
      {#if message.type_buttons}
      {#each message.type_buttons as selection, index}
        <button
          class="selection "
          on:click={() => {
            audienceType_writable.set(selection)
            askQuestion(selection);
          }}
        >
          {selection}</button
        >
      {/each}
      {/if}
      {#if message.segment_buttons}

      {#each message.segment_buttons as selection, index}
        <button
          class="selection "
         
          on:click={() => {
            // audienceType_writable.set(selection)
            audienceSegment_writable.set(selection)
            askQuestion(selection);
          }}
        >
          {selection}</button
        >
      {/each}
      {/if}
    </div>
  </div>
  <button
    style="display: contents;"
    on:click={() => {
      if (!isFavorite && !alreadyFav) {
        isFavorite = true;

        setFavoriteModal(true, message);
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
    /* background-color: var(--primary-light); */
    padding: 0.7rem;
    margin-left: 1rem;
    font-size: 0.8rem;
    color: var(--text-color) !important;
    line-height: 1.3 !important;
    /* font-family: "Poppins" !important; */
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
  .selections {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    /* padding: 0.3rem; */
    margin-top: 0rem;
    margin-left: 2rem;
  }
  .selection {
    padding: 0.2rem 0.5rem 0.2rem 0.5rem;
    background-color: var(--hover-color);
    color: var(--text-color);
    border-radius: 0.5rem;
    font-weight: 200;
    font-size: 0.8rem;
  }
  .disabled{
    opacity: 0.5;
  }
</style>
