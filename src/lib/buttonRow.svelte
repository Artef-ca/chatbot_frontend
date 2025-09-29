<script lang="ts">
  import {
    addMessage,
    question_asked_writable,
    startAudience,
    started_writable,
  } from "../chatFunctions.svelte";
  import { agent_writable, messageLogWritable } from "../Functions.svelte";
  import type { MessageResponse } from "./types";

  let selected: any = "insights";
  // agent_writable.set('insights')
  agent_writable.subscribe((data) => {
    selected = data;
    console.log(data);
  });

  function selectAgent(question: string) {
    addMessage({
      data: {
        type: "audience_bot_msg",
        message: question,
        buttons:['Identified', 'Unidentified']
      },
      state: true,
    },"audience_bot_msg"
  );
    startAudience(question);
    started_writable.set(true);
  }
</script>

<div class="btns">
  <!-- {#if selected == "insights"} -->
  <button
    class="insights {selected == 'audience' ? 'disabled' : ''}"
    on:click={() => {
      if (selected != "insights") {
        agent_writable.set("insights");
        started_writable.set(false);
        messageLogWritable.set([]);
        question_asked_writable.set(false)
        console.log(selected);
      }
    }}>Insights</button
  >
  <!-- {:else if selected == "audience"} -->
  <button
    class={selected == "insights" ? "disabled" : ""}
    on:click={() => {
      if (selected != "audience") {
        started_writable.set(false);
        messageLogWritable.set([]);
        console.log(selected);
        question_asked_writable.set(false)
        agent_writable.set("audience");
        selectAgent(
          "Welcome to the Audience section! Which type of audience would you like to explore?"
        );
        console.log(selected);
      }
    }}>Audiences</button
  >
  <!-- {/if} --> 
</div>

<style>
  .btns {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    /* opacity: 0; */
  }
  .btns button {
    padding: 0.2rem 0.5rem 0.2rem 0.5rem;
    background-color: var(--primary-light);
    color: var(--text-color);
    border-radius: 0.5rem;
    font-weight: 200;
  }
  .disabled {
    opacity: 0.6;
  }
  .insights {
    /* margin-left: 0.5rem; */
  }
</style>
