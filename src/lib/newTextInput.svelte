<script lang="ts">
  import {
  audienceSegment_writable,
    audienceType_writable,
    newQuestion,
    prompt_id_writable,
    question_asked_writable,
    report_id_writable,
    segments_writable,
    started_writable,
  } from "../chatFunctions.svelte";
  import {
    agent_writable,
    messageLogWritable,
    showNewPromptModal,
    showPromptModal,
  } from "../Functions.svelte";
  import ButtonRow from "./buttonRow.svelte";

  export let onSubmit: (message: string) => void; // a callback function that will be called on Submit
  export let thinking: boolean;
  // export let newQuestion: (question: string) => void;
  export let abort: () => void;

  let newMessage = "";

  let agent: string;
  agent_writable.subscribe((data) => (agent = data));
  // &: length=newMessage.length

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (agent == "audience") {
        newQuestion(newMessage,'audience')
      } else {
        onSubmit(newMessage);
      }
      newMessage = "";
      event.preventDefault(); // prevent any default action
    }
  }

  function handleClick() {
    if (agent == "audience") {
      newQuestion(newMessage,'audience')

    } else {
      onSubmit(newMessage);
    }
    newMessage = "";
  }

  // ----- Popup Menu State and Functions -----
  let showTypePopup: boolean = false;
  let showSegmentPopup: boolean = false;
  let showPromptPopup: boolean = false;
  let typePopupStyle: string = "";
  let segmentPopupStyle: string = "";
  let promptPopupStyle: string = "";

  let typeBtnRef: HTMLButtonElement;
  let segmentBtnRef: HTMLButtonElement;
  let promptBtnRef: HTMLButtonElement;
  let segments: any[] = [];

  segments_writable.subscribe((data) => {
    segments = data;
    console.log("SEGMENTS", segments);
  });

  // Assumed popup height for calculation (adjust this value to match your content)
  const assumedPopupHeight = 100;

  function toggleTypePopup() {
    showTypePopup = !showTypePopup;
    if (showTypePopup) {
      // Hide other popups
      showSegmentPopup = false;
      showPromptPopup = false;
      if (typeBtnRef) {
        const rect = typeBtnRef.getBoundingClientRect();
        // If not enough space above, show below
        if (rect.top < assumedPopupHeight) {
          // typePopupStyle = `top: ${rect.bottom + window.scrollY}px; left: ${rect.left + window.scrollX}px; transform: translateY(0);`;
        } else {
          // typePopupStyle = `top: ${rect.top + window.scrollY}px; left: ${rect.left + window.scrollX}px; transform: translateY(-100%);`;
        }
      }
    }
  }

  function toggleSegmentPopup() {
    showSegmentPopup = !showSegmentPopup;
    if (showSegmentPopup) {
      showTypePopup = false;
      showPromptPopup = false;
      if (segmentBtnRef) {
        const rect = segmentBtnRef.getBoundingClientRect();
      }
    }
  }

  function togglePromptPopup() {
    showPromptPopup = !showPromptPopup;
    if (showPromptPopup) {
      showTypePopup = false;
      showSegmentPopup = false;
      if (promptBtnRef) {
        const rect = promptBtnRef.getBoundingClientRect();
      }
    }
  }

  // Close popups when clicking anywhere outside
  function handleWindowClick() {
    showTypePopup = false;
    showSegmentPopup = false;
    showPromptPopup = false;
  }
</script>

<svelte:window on:click={handleWindowClick} />

<!-- Input -->
<div class="relative">
  <div class="chat-box">
    <input
      class={thinking ? "disabled" : ""}
      bind:value={newMessage}
      on:keydown={handleKeydown}
      type="text"
      placeholder="Ask anything"
      id="userInput"
      disabled={thinking}
    />
    <div class="buttonRow">
      <ButtonRow></ButtonRow>
      {#if thinking}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img src="/cancel.svg" on:click={abort} />
      {:else}
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
          src="/send.svg"
          class={newMessage.length == 0 ? "empty" : ""}
          on:click={handleClick}
        />
      {/if}
    </div>
  </div>

  {#if agent == "audience"}
    <!-- Make the audience container relative so the absolute positioned popups align correctly -->
    <div class="audience" style="position: relative;">
      <div class="btns">
        <div>
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          {#if showTypePopup}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class="popup-menu"
              style={typePopupStyle}
              on:click|stopPropagation
            >
              <button
                on:click={() => {
                  audienceType_writable.set("Unidentified");
                  newQuestion("Unidentified", "user");
                }}>Unidentified</button
              >
              <button                
                on:click={() => {
                  audienceType_writable.set("Identified");
                  newQuestion("Identified", "user");
                }}>Identified</button
              >
              <!-- Additional options here -->
            </div>
          {/if}
          <button
            class="audBtn"
            bind:this={typeBtnRef}
            on:click|stopPropagation={toggleTypePopup}>Type</button
          >
        </div>
        <div>
          {#if showSegmentPopup}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class="popup-menu"
              style={segmentPopupStyle}
              on:click|stopPropagation
            >
              {#each segments as segment}
                <button
                  on:click={() => {
                    audienceSegment_writable.set(segment)
                    newQuestion(segment, "user");
                  }}>{segment}</button
                >
              {/each}
            </div>
          {/if}
          <button
            class="audBtn {segments.length == 0 ? 'disabled' : ''}"
            disabled={segments.length == 0}
            bind:this={segmentBtnRef}
            on:click|stopPropagation={toggleSegmentPopup}>Segment</button
          >
        </div>
        <div>
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          {#if showPromptPopup}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class="popup-menu"
              style={promptPopupStyle}
              on:click|stopPropagation
            >
              <button
                on:click={() => {
                  showNewPromptModal.set({ enabled: true });
                }}>New</button
              >
              <button
                on:click={() => {
                  showPromptModal.set({ enabled: true });
                }}>Modify</button
              >
              <button
                on:click={() => {
                  prompt_id_writable.set("default");
                  report_id_writable.set("default");
                  // started_writable.set(false);
                  messageLogWritable.set([]);
                  // question_asked_writable.set(false);
                  // newQuestion("Hello! I would like to explore my audiences!", "user");
                  newQuestion("Generate a report.", "user");
                }}>Default</button
              >
              <!-- Additional options here -->
            </div>
          {/if}
          <!-- <button
            class="audBtn"
            bind:this={promptBtnRef}
            on:click|stopPropagation={togglePromptPopup}>Prompt</button
          > -->
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- End Input -->

<style>
  .chat-box {
    margin-bottom: 1rem;
    border-radius: 1rem;
    background-color: var(--hover-color);
    width: 80%;
    padding: 15px;
    padding-top: 15px;
    margin: 5px 0;
    border: none;
    resize: none;
    font-size: 0.8rem;
    color: var(--text-color);
    scrollbar-color: transparent transparent;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding-bottom: 0px;
  }
  .chat-box input {
    background-color: var(--hover-color);
    width: 100%;
    height: 3rem;
    z-index: 9999;
  }
  .chat-box img {
    z-index: 9;
    height: 3.5rem;
    margin-right: -0.5rem;
  }
  .chat-box input::placeholder {
    color: var(--text-color);
    opacity: 70%;
    font-weight: 300;
  }
  .disabled {
    opacity: 0.5;
  }
  .empty {
    filter: brightness(0.5);
  }
  .audience {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
  .buttonRow {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 3rem;
    justify-content: space-between;
    z-index: 9999;
  }
  .btns {
    margin-left: 1rem;
    display: flex;
    gap: 0.7rem;
  }
  .btns div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  button {
    padding: 0.1rem 0.3rem;
    background-color: var(--primary-light);
    color: var(--text-color);
    border-radius: 0.5rem;
    font-weight: 200;
    font-size: 0.8rem;
    width: 8rem;
  }
  .popup-menu {
    position: absolute;
    background: var(--primary);
    color: var(--text-color);
    /* border: 1px solid #ccc; */
    padding: 0.5rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    /* z-index: 100; */
    bottom: 5vh;
    z-index: 99999;
    border-radius: 0.5rem;
  }
  .popup-menu button {
    margin: 0.3rem;
  }
  @media screen and (max-width: 767px) {
    .chat-box {
      margin-top: auto;
      width: 100%;
      margin-right: auto;
      margin-left: auto;
    }
  }
</style>
