<script lang="ts">
    import { createEventDispatcher } from "svelte";
  import type { Prompt } from "./types";
    
  
    
    export let prompt: Prompt = { title: "", prompt: "", description: "" };
    export let isNew: boolean = false;
    
    const dispatch = createEventDispatcher();
  
    function confirm() {
      // Pass back the updated prompt data.
      dispatch("confirm", prompt);
    }
  
    function cancel() {
      dispatch("cancel");
    }
  </script>
  
  <div class="prompt-form">
    <input type="text" placeholder="Title" bind:value={prompt.title} />
    <input type="text" placeholder="Description" bind:value={prompt.description} />
    <textarea placeholder="Prompt text" bind:value={prompt.prompt}></textarea>
    
    <div class="buttons">
      <button class="confirm" on:click={confirm}>
        {isNew ? "Add" : "Confirm Changes"}
      </button>
      <button on:click={cancel}>
        Discard {isNew ? "" : "Changes"}
      </button>
    </div>
  </div>
  
  <style>
    .prompt-form input,
    .prompt-form textarea {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: var(--hover-color);
      width: 100%;
    }
    .prompt-form textarea {
      min-height: 9rem;
    }
    .buttons {
      display: flex;
      justify-content: space-around;
      margin-top: 1rem;
    }
    .buttons button {
      font-size: 0.8rem;
      padding: 0.3rem 0.6rem;
      border-radius: 0.5rem;
      background-color: var(--hover-color);
    }
    .buttons .confirm {
      background-color: var(--primary-light);
    }
  </style>
  