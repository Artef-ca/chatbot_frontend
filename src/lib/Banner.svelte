<script lang="ts">
  // import { opendir } from "fs";
  import type { Agent, MessageResponse } from "./types";

  export let agents: Agent[];
  export let agent: Agent;
  export let addMessage: (msg: MessageResponse) => void;
  export let startChatFromTextBox: (question: string) => void;
  let opened = false;

  function selectAgent(agentt: Agent, question: string) {
    if (opened) {
      agent = { type: "", message: "", title: "", img: "", intro: "" };
      agent = agentt;
      console.log(agent);

      addMessage({
        data: {
          type: "bot_msg",
          question: question,
        },
        state: true,
      });
      startChatFromTextBox(question);
    }
  }
</script>

<div
  style="width: 80%; margin-left:auto; margin-right:auto;display: flex;"
>
  <button
    class="btn {opened ? 'openBtn' : ''}"
    on:click={() => (opened = !opened)}>FAQs</button
  >
</div>
<div class="examples">
  {#each agents as item}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="item" id={item.type}>
      <div class="top">
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- <img src={item.img} /> -->
        <!-- <div class="title">{item.title}</div> -->
      </div>
      <!-- <div class="title">FAQs</div> -->
      <!-- {#if opened} -->
      <div class="detailGrid {opened ? 'openDetails' : ''}">
        <div class="details" on:click={() => selectAgent(item, item.message)}>
          {item.message}
        </div>
        <div class="details" on:click={() => selectAgent(item, item.message2)}>
          {item.message2}
        </div>
        <div class="details" on:click={() => selectAgent(item, item.message3)}>
          {item.message3}
        </div>
      </div>
      <!-- {/if} -->
    </div>
  {/each}
</div>

<style>
  .examples {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    /* margin-top: 2rem; */
    /* opacity: 0; */
    /* transition:cubic-bezier(1,0,.61,.06) 1s; */
    transition: cubic-bezier(0.6, -0.28, 0.74, 0.05) 1s;
    /* transition:cubic-bezier(1,0,.61,.06) 0.5s; */
  }
  .examples .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* margin: 3.5rem; */
    width: 18rem;
    /* margin-left: 2rem;
    margin-right: 2rem; */
    /* transition: ease-out 0.5s; */
    /* transition:cubic-bezier(0.6,-0.28,0.74,0.05) 1s; */
    color: var(--text-color);
  }
  .examples .item .details:hover {
    background-color: var(--hover-color) !important;
  }
  .examples .item .top {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 300;
  }
  .examples .item .top img {
    /* transform: scale(0.7); */
  }
  .examples .item .details {
    background-color: var(--primary-light);
    padding: 0.4rem;
    border-radius: 10px;
    font-size: 0.8rem;
    /* margin-top: 1rem; */
    transition: ease-out 0.5s;
    font-weight: 200;
    /* min-width: 10rem;
    max-width: 20rem; */
    width: max-content;
    margin-left: 1rem;
    /* margin-left: auto;
    margin-right: auto; */
    /* height: 5rem; */
  }
  .btn {
    width: min-content;
    padding: 0.2rem 0.5rem 0.2rem 0.5rem;
    background-color: var(--primary-light);
    color: var(--text-color);
    border-radius: 0.5rem;
    font-weight: 200;
    margin-bottom: 0.5rem;
    margin-left: 1rem;
    opacity: 0.5;
    margin-top: 0.5rem;
  }
  .openBtn {
    /* border: 1px solid white; */
    opacity: 1;
  }
  .detailGrid {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    margin-bottom: -10rem;
    transition: cubic-bezier(0.6, -0.28, 0.74, 0.05) 0.4s;
    opacity: 0;
    /* margin-top: 2rem; */
  }
  .openDetails {
    opacity: 1;
  }
  @media screen and (max-width: 767px) {
    .examples {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: auto;
    }
    .examples .item {
      margin: 0rem;
      display: flex;
      flex-direction: row;
      width: 95%;
      justify-content: center;
      align-items: center;
    }
    .examples .item .top .title {
      font-size: 0.8rem;
    }
    .examples .item .top {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 15rem;
      margin-right: 2rem;
      margin-bottom: -1rem;
    }
    .examples .item .details {
      font-size: 0.8rem;
      width: 25rem;
    }
  }
</style>
