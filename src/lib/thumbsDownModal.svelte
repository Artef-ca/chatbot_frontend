<script lang="ts">
  import { thumbsDown, setThumbsModal, showThumbsModal } from "../Functions.svelte";
  import { onMount } from "svelte";

  let ENABLED: boolean;
  let dialog: HTMLDialogElement;
  let title: string = "";

  // Subscribe to the store and open/close the dialog as needed.
  showThumbsModal.subscribe((data: any) => {
    console.log("subscribed", data);
    ENABLED = data.enabled;
    if (dialog) {
      // Only show the dialog if it's not already open.
      if (data.enabled && !dialog.open) {
        dialog.showModal();
      }
      // Close it if the store says it's disabled and it is open.
      if (!data.enabled && dialog.open) {
        dialog.close();
      }
    }
  });

  // A dedicated close function that resets state and updates the store.
  function closeDialog() {
    title = "";
    ENABLED = false;
    setThumbsModal(false, null, null);
    if (dialog && dialog.open) {
      dialog.close();
    }
  }

  function addFeedback() {
    if (title.trim() !== "") {
      thumbsDown(title, "");
      closeDialog();
    }
  }
</script>

<dialog
  bind:this={dialog}
  on:click={(event) => {
    // If the user clicks on the backdrop (outside dialog content), close the dialog.
    if (event.target === dialog) {
      closeDialog();
    }
  }}
  on:close={closeDialog}
>
  <header class="dialog-header">
    <h2>Add to Favorites</h2>
    <!-- Close button in the header -->
    <button class="close-button" on:click={closeDialog} aria-label="Close dialog">
      &times;
    </button>
  </header>
  <hr style="width: 93%;" />
  <div class="input">
    <label for="name">Write some feedback</label>
    <input type="text" placeholder="Feedback" id="name" bind:value={title} />
    <button class="submit-button" on:click={addFeedback}>
      Add
    </button>
  </div>
</dialog>

<style>
  dialog {
    width: 20rem;
    max-width: 32em;
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
  .input {
    color: white;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }
  input {
    background-color: var(--primary-light);
    padding: 15px;
    margin: 5px 0;
    border: none;
    height: 3rem;
    font-size: 0.8rem;
    color: var(--text-color);
  }
  .submit-button {
    color: var(--text-color);
    padding: 0.7rem 1rem;
    background-color: var(--primary-light);
    margin: auto;
    margin-top: 1rem;
    display: block;
    font-size: 0.8rem;
  }
</style>
