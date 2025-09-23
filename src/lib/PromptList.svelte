<script lang="ts">
    import { createEventDispatcher } from "svelte";
  import type { Prompt } from "./types";
    

    export let prompts: Prompt[] = [];
    const dispatch = createEventDispatcher();
  
    function handleSelect(prompt: Prompt) {
      dispatch("select", prompt);
    }
  
    function handleNew() {
      dispatch("new");
    }
  </script>
  
  <div class="prompt-list">
    {#if prompts.length > 0}
      {#each prompts as prompt (prompt.title)}
        <div class="item" on:click={() => handleSelect(prompt)}>
          <div class="name">{prompt.title}</div>
          <div class="expand">+</div>
        </div>
      {/each}
    {/if}
    <!-- Button to create a new prompt -->
    <div class="new-button" on:click={handleNew}>
      +
    </div>
  </div>
  
  <style>
    .prompt-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .item {
      display: flex;
      padding: 0.3rem;
      border-radius: 0.5rem;
      background-color: var(--primary-light);
      position: relative;
    }
    .item .expand {
      position: absolute;
      right: 30px;
    }
    .new-button {
      text-align: center;
      font-size: 2rem;
      cursor: pointer;
    }
  </style>
  