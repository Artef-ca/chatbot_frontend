<script lang="ts">
  import { onMount } from "svelte";
  import {
    thumbsDown,
    newApiRequest,
    showNewPromptModal,
  } from "../Functions.svelte";
  import {
    newQuestion,
    prompt_id_writable,
    report_id_writable,
  } from "../chatFunctions.svelte";
  import type { Prompt } from "./types";
  let ENABLED: boolean;
  let newToggled: boolean = false;
  let dialog: HTMLDialogElement;
  let title: string = "";
  let prompts: Prompt[] = [];
  let selectedPrompt: Prompt | null = null;
  let updatedPromptName: string = "";
  let updatedTitle: string = "";
  let updatedPrompt: string = "";
  let updatedDescription: string = "";

  // Error variables for validation
  let promptNameError: string = "";
  let nameTakenError: boolean = false;
  let titleError: string = "";
  let promptError: string = "";
  let promptId: string;
  prompt_id_writable.subscribe((data) => {
    promptId = data;
  });

  function validateFields(): boolean {
    let valid = true;
    if (updatedPromptName.trim() === "") {
      promptNameError = "Title is required";
      valid = false;
    } else {
      promptNameError = "";
    }
    if (selectedPrompt || newToggled) {
      if (updatedTitle.trim() === "") {
        titleError = "Title is required";
        valid = false;
      } else {
        titleError = "";
      }
      if (updatedPrompt.trim() === "") {
        promptError = "Prompt text is required";
        valid = false;
      } else {
        promptError = "";
      }
    }
    console.log(valid);

    return valid;
  }
  function selectPrompt(prompt: Prompt | null) {
    newToggled = false;
    selectedPrompt = prompt;
    // Reset validation errors
    promptNameError = "";
    titleError = "";
    promptError = "";
    if (prompt) {
      updatedTitle = prompt.title;
      updatedPrompt = prompt.prompt;
      updatedDescription = prompt.description;
    } else {
      // Reset fields if nothing is selected
      updatedTitle = "";
      updatedPrompt = "";
      updatedDescription = "";
    }
  }
  async function fetchPrompts() {
    try {
      const response = await newApiRequest(
        "get_prompt",
        "POST",
        { prompt_id: promptId },
        "audience"
      );
      console.log(response);
      prompts = Array.isArray(response.data.prompt)
        ? response.data.prompt.slice(0, 3)
        : [response.data.prompt.slice(0, 3)];
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  }

  showNewPromptModal.subscribe((data: any) => {
    ENABLED = data.enabled;
    if (dialog) {
      if (data.enabled && !dialog.open) {
        fetchPrompts().then(() => dialog.showModal());
      }
      if (!data.enabled && dialog.open) {
        dialog.close();
      }
    }
  });

  function closeDialog() {
    ENABLED = false;
    selectedPrompt = null;
    updatedTitle = "";
    updatedPrompt = "";
    updatedDescription = "";
    newToggled = false;
    // Clear validation errors
    promptNameError = "";
    titleError = "";
    promptError = "";
    showNewPromptModal.set({ enabled: false });
    if (dialog && dialog.open) {
      dialog.close();
    }
  }
  function Submit() {
    if (!validateFields()) {
      console.log("HERE");
      return;
    }
    newApiRequest(
      "validate_report_id",
      "POST",
      { report_id: updatedPromptName },
      "audience"
    )
      .then((data) => {
        console.log(data.data.error);
        if (!data.data.error) {
          // Optional: validate here if needed
          nameTakenError = false;
          ENABLED = false;
          selectedPrompt = null;
          updatedTitle = "";
          updatedPrompt = "";
          updatedDescription = "";
          newToggled = false;
          // Clear validation errors
          promptNameError = "";
          titleError = "";
          promptError = "";
          showNewPromptModal.set({ enabled: false });
          newApiRequest(
            "submit_prompt",
            "POST",
            { prompt: prompts },
            "audience"
          ).then((data) => {
            console.log(data);
            prompt_id_writable.set(data.data.prompt_id);
            report_id_writable.set(updatedPromptName);
            updatedPromptName = "";
            // newQuestion("Hello! I would like to explore my audiences!", "");
            newQuestion("Generate a report.", "");
          });
          if (dialog && dialog.open) {
            dialog.close();
          }
        } else {
          nameTakenError = true;

          console.log("ERR");
        }
      })
      .catch((error) => {
        console.log("ERR", error);
        return;
      });
  }

  function confirmChanges() {
    // Validate before confirming changes
    if (!validateFields()) {
      return;
    }
    if (selectedPrompt) {
      // Update the existing prompt
      selectedPrompt.title = updatedTitle;
      selectedPrompt.prompt = updatedPrompt;
      selectedPrompt.description = updatedDescription;
    } else if (newToggled) {
      // Create a new prompt if validation passes
      const newPrompt: Prompt = {
        title: updatedTitle,
        prompt: updatedPrompt,
        description: updatedDescription,
      };
      prompts = [...prompts, newPrompt];
    }
    // Clear errors and reset state after successful validation
    promptNameError = "";
    titleError = "";
    promptError = "";
    selectedPrompt = null;
    newToggled = false;
  }
  function titleCase(str: string): string {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function removeSegment() {
    prompts = prompts.filter((segment) => selectedPrompt != segment);
    selectedPrompt = null;
    newToggled = false;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={closeDialog}>
  <header class="dialog-header">
    <input
      placeholder="New Report Title"
      bind:value={updatedPromptName}
      style="background-color: unset; font-size:1.2rem"
    />
    {#if promptNameError}
      <div class="error">{promptNameError}</div>
    {/if}
    {#if nameTakenError}
      <div class="error">Prompt name taken</div>
    {/if}
    <button
      class="close-button"
      on:click={closeDialog}
      aria-label="Close dialog"
    >
      &times;
    </button>
  </header>
  <hr style="width: 93%;" />
  <div class="main">
    {#if !selectedPrompt && !newToggled}
      <div class="items">
        {#each prompts as prompt}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="item" on:click={() => selectPrompt(prompt)}>
            <div class="name">{titleCase(prompt.title)}</div>
            <div class="expand">+</div>
          </div>
        {/each}
      </div>
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        style="text-align: center; font-size:2rem; cursor:pointer;"
        on:click={() => {
          newToggled = true;
          // Reset the binding fields and validation errors for the new prompt
          updatedTitle = "";
          updatedPrompt = "";
          updatedDescription = "";
          promptNameError = "";
          titleError = "";
          promptError = "";
          console.log(newToggled);
        }}
      >
        +
      </div>
      <div class="buttons" style="justify-content: flex-end; margin-top:0rem;">
        <button class="confirm" on:click={Submit}>Submit</button>
      </div>
    {:else if selectedPrompt}
      <div class="focus">
        <div class="items">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="item" on:click={() => selectPrompt(null)}>
            <div class="name">{selectedPrompt.title}</div>
            <div class="expand">-</div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Edit title"
          bind:value={updatedTitle}
          style="width: 30%; {selectedPrompt.title.toLowerCase() == 'goal' ||
          selectedPrompt.title.toLowerCase() == 'title' ||
          selectedPrompt.title.toLowerCase() == 'summary'
            ? 'opacity:0.5'
            : ''}"
          disabled={selectedPrompt.title.toLowerCase() == "goal" ||
            selectedPrompt.title.toLowerCase() == "title" ||
            selectedPrompt.title.toLowerCase() == "summary"}
        />
        {#if titleError}
          <div class="error">{titleError}</div>
        {/if}
        <input
          type="text"
          placeholder="Edit description"
          bind:value={updatedDescription}
          style="width: 69%;"
        />
        <textarea bind:value={updatedPrompt}></textarea>
        {#if promptError}
          <div class="error">{promptError}</div>
        {/if}
        <div class="buttons">
          <button class="confirm" on:click={confirmChanges}
            >Confirm Changes</button
          >
          <button on:click={() => selectPrompt(null)}>Discard Changes</button>
          {#if selectedPrompt.title.toLowerCase() != "goal" && selectedPrompt.title.toLowerCase() != "title" && selectedPrompt.title.toLowerCase() != "summary"}
            <button
              style="background: #762020;"
              on:click={() => removeSegment()}>Remove</button
            >
          {/if}
        </div>
      </div>
    {:else if newToggled}
      <div class="focus">
        <div class="items">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="item" on:click={() => selectPrompt(null)}>
            <div class="name">Add Prompt</div>
            <div class="expand">-</div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Add section title here"
          style="width: 30%;"
          bind:value={updatedTitle}
        />
        {#if titleError}
          <div class="error">{titleError}</div>
        {/if}
        <input
          type="text"
          placeholder="Add description here"
          style="width: 69%;"
          bind:value={updatedDescription}
        />
        <textarea bind:value={updatedPrompt} placeholder="Add prompt text here"
        ></textarea>
        {#if promptError}
          <div class="error">{promptError}</div>
        {/if}
        <div class="buttons">
          <button class="confirm" on:click={confirmChanges}>Add</button>
          <button on:click={() => selectPrompt(null)}>Discard</button>
        </div>
      </div>
    {/if}
  </div>
</dialog>

<style>
  .main .items {
    margin-top: 1rem;
    gap: 0.5rem;
    display: flex;
    flex-direction: column;
  }
  .main .items .item {
    display: flex;
    padding: 0.3rem;
    border-radius: 0.5rem;
    background-color: var(--primary-light);
  }
  .main .items .item .expand {
    position: absolute;
    right: 30px;
  }
  textarea,
  input {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: var(--hover-color);
  }
  textarea {
    width: 100%;
    min-height: 9rem;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 1rem;
  }
  .buttons button {
    font-size: 0.8rem;
    padding: 0.3rem;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    background-color: var(--hover-color);
    border-radius: 0.5rem;
  }
  .buttons .confirm {
    background-color: var(--primary-light);
  }
  dialog {
    width: 35rem;
    max-width: 35em;
    border: none;
    padding: 1rem;
    background: var(--primary);
    color: var(--text-color);
    border-radius: 1rem;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .close-button {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--text-color);
  }
  .close-button:hover {
    color: red;
  }
  .error {
    color: red;
    font-size: 0.7rem;
    margin-top: 0.2rem;
  }
</style>
