<script lang="ts">
  import { onMount } from "svelte";
  import {
    thumbsDown,
    showPromptModal,
    newApiRequest,
  } from "../Functions.svelte";
  import {
    newQuestion,
    prompt_id_writable,
    report_id_writable,
  } from "../chatFunctions.svelte";
  import type { Prompt } from "./types";

  let ENABLED = false;
  let newToggled = false;
  let dialog: HTMLDialogElement;
  let titleDialog: HTMLDialogElement;
  let prompts: Prompt[] = [];
  let selectedPrompt: Prompt | null = null;

  let updatedTitle = "";
  let updatedPrompt = "";
  let updatedDescription = "";
  let updatedPromptName = "";
  let nameTakenError: boolean = false;

  let titleError = "";
  let promptError = "";
  let hasChanges = false;
  let promptId: string;
  prompt_id_writable.subscribe((data) => (promptId = data));

  function validateFields(): boolean {
    let valid = true;
    if (!updatedTitle.trim()) {
      titleError = "Title is required";
      valid = false;
    } else {
      titleError = "";
    }
    if (!updatedPrompt.trim()) {
      promptError = "Prompt text is required";
      valid = false;
    } else {
      promptError = "";
    }
    return valid;
  }

  async function fetchPrompts() {
    try {
      const response = await newApiRequest(
        "get_prompt",
        "POST",
        { prompt_id: promptId },
        "audience"
      );
      prompts = Array.isArray(response.data.prompt)
        ? response.data.prompt
        : [response.data.prompt];
      hasChanges = false;
    } catch (e) {
      console.error("Error fetching prompts:", e);
    }
  }

  showPromptModal.subscribe((data) => {
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
    updatedTitle = updatedPrompt = updatedDescription = "";
    newToggled = false;
    titleError = promptError = "";
    showPromptModal.set({ enabled: false });
    if (dialog.open) dialog.close();
  }

  function openTitleDialog() {
    titleError = "";
    titleDialog.showModal();
  }

  function cancelTitle() {
    titleDialog.close();
  }

  async function confirmTitle() {
    if (!updatedPromptName.trim()) {
      titleError = "Report title is required";
      return;
    }
    titleDialog.close();
    await performSubmit();
  }

  async function Submit() {
    if (!updatedPromptName.trim()) {
      openTitleDialog();
    } else {
      await performSubmit();
    }
  }

  async function performSubmit() {
    newApiRequest(
      "validate_report_id",
      "POST",
      { report_id: updatedPromptName },
      "audience"
    ).then(async (data) => {
      if (!data.data.error) {
        nameTakenError = false;
        hasChanges = false;
        ENABLED = false;
        selectedPrompt = null;
        updatedTitle = updatedPrompt = updatedDescription = "";
        newToggled = false;
        titleError = promptError = "";
        showPromptModal.set({ enabled: false });

        try {
          const data = await newApiRequest(
            "submit_prompt",
            "POST",
            { prompt: prompts },
            "audience"
          ).then((data) => {
            prompt_id_writable.set(data.data.prompt_id);
            report_id_writable.set(updatedPromptName);
            // newQuestion("Hello! I would like to explore my audiences!", "");
            newQuestion("Generate a report.", "");
            updatedPromptName = "";
          });
          if (dialog.open) dialog.close();
        } catch (e) {
          console.error("Error submitting prompt:", e);
        }
      } else {
        updatedPromptName = "";

        nameTakenError = true;

        console.log("ERR");
      }
    });
  }

  function selectPrompt(prompt: Prompt | null) {
    newToggled = false;
    selectedPrompt = prompt;
    titleError = promptError = "";
    if (prompt) {
      updatedTitle = prompt.title;
      updatedPrompt = prompt.prompt;
      updatedDescription = prompt.description;
    } else {
      updatedTitle = updatedPrompt = updatedDescription = "";
    }
  }

  function confirmChanges() {
    if (!validateFields()) return;
    if (selectedPrompt) {
      selectedPrompt.title = updatedTitle;
      selectedPrompt.prompt = updatedPrompt;
      selectedPrompt.description = updatedDescription;
    } else if (newToggled) {
      prompts = [
        ...prompts,
        {
          title: updatedTitle,
          prompt: updatedPrompt,
          description: updatedDescription,
        },
      ];
    }
    hasChanges = true;
    selectedPrompt = null;
    newToggled = false;
  }

  function titleCase(str: string) {
    return str
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  function removeSegment() {
    prompts = prompts.filter((segment) => selectedPrompt != segment);
    selectedPrompt = null;
    newToggled = false;
    hasChanges = true;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- Main Prompt Modal -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog bind:this={dialog} on:close={closeDialog}>
  <header class="dialog-header">
    <h2>Prompts</h2>
    {#if nameTakenError}<div class="error">Prompt name taken</div>{/if}
    <button
      class="close-button"
      on:click={closeDialog}
      aria-label="Close dialog">&times;</button
    >
  </header>
  <hr style="width: 93%;" />
  <div class="main">
    {#if !selectedPrompt && !newToggled}
      {#each prompts as prompt (prompt.title)}
        <div class="items">
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="item" on:click={() => selectPrompt(prompt)}>
            <div class="name">{titleCase(prompt.title)}</div>
            <div class="expand">+</div>
          </div>
        </div>
      {/each}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="add"
        style="text-align: center; font-size:2rem; cursor:pointer;"
        on:click={() => {
          newToggled = true;
          updatedTitle = updatedPrompt = updatedDescription = "";
          titleError = promptError = "";
        }}
      >
        +
      </div>
      <div
        class="buttons {!hasChanges ? 'disabled' : ''}"
        style="justify-content: flex-end; margin-top:0rem;"
      >
        <button class="confirm" on:click={Submit} disabled={!hasChanges}
          >Submit</button
        >
      </div>
    {:else if selectedPrompt}
      <div class="focus">
        <div class="items">
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
        {#if titleError}<div class="error">{titleError}</div>{/if}
        <input
          type="text"
          placeholder="Edit description"
          bind:value={updatedDescription}
          style="width: 69%;"
        />
        <textarea bind:value={updatedPrompt}></textarea>
        {#if promptError}<div class="error">{promptError}</div>{/if}
        <div class="buttons">
          <button class="confirm" on:click={confirmChanges}
            >Confirm Changes</button
          >
          <button on:click={() => selectPrompt(null)}>Discard Changes</button>
          <!-- {#if selectedPrompt.title != 'Goal' && selectedPrompt.title != 'Title' && selectedPrompt.title != 'Summary'} -->

          {#if selectedPrompt.title.toLowerCase() != "goal" && selectedPrompt.title.toLowerCase() != "title" && selectedPrompt.title.toLowerCase() != "summary"}
            <button
              style="background: #762020;"
              on:click={() => removeSegment()}>Remove</button
            >
          {/if}
        </div>
      </div>
    {:else}
      <div class="focus">
        <div class="items">
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="item" on:click={() => selectPrompt(null)}>
            <div class="name">Add Prompt</div>
            <div class="expand">-</div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Add section title here"
          bind:value={updatedTitle}
          style="width: 30%;"
        />
        {#if titleError}<div class="error">{titleError}</div>{/if}
        <input
          type="text"
          placeholder="Add description here"
          bind:value={updatedDescription}
          style="width: 69%;"
        />
        <textarea bind:value={updatedPrompt} placeholder="Add prompt text here"
        ></textarea>
        {#if promptError}<div class="error">{promptError}</div>{/if}
        <div class="buttons">
          <button class="confirm" on:click={confirmChanges}>Add</button>
          <button on:click={() => selectPrompt(null)}>Discard</button>
        </div>
      </div>
    {/if}
  </div>
</dialog>

<!-- Report Title Modal -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={titleDialog}
  class="title-dialog"
  on:click={(e) => e.target === titleDialog && cancelTitle()}
>
  <header class="dialog-header">
    <h3>Enter Report Title</h3>
    <button
      class="close-button"
      on:click={cancelTitle}
      aria-label="Close title dialog">&times;</button
    >
  </header>
  <hr style="width: 93%;" />
  <div class="main">
    <input
      type="text"
      placeholder="Report title"
      bind:value={updatedPromptName}
    />
    {#if titleError}<div class="error">{titleError}</div>{/if}
    <div class="buttons">
      <button on:click={cancelTitle}>Cancel</button>
      <button class="confirm" on:click={confirmTitle}>OK</button>
    </div>
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
    position: relative;
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
    padding: 0.3rem 0.6rem;
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
  .disabled {
    opacity: 0.5;
  }
</style>
