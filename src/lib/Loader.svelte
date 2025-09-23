<script lang="ts">
  import { showLoader } from "../Functions.svelte";

  let ENABLED: boolean;
  let dialog: any; // HTMLDialogElement
  showLoader.subscribe((data) => {
    ENABLED = data.enabled;
    // console.log('LOADER:',ENABLED)
    if ((!ENABLED && dialog)) {
      dialog.close();
    }
  });

 

  $: if (dialog && ENABLED) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => {
    ENABLED = false;
    //   setFavoriteModal(false, null);
  }}
>
  <div class="spinner"></div>
</dialog>

<style>
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border-left-color: var(--primary-light);
    animation: spin 1s ease infinite;
    padding: 2rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  dialog {
    overflow: hidden;
    background: #1d191900;
    /* width: 100%; */
    /* display: flex; */
    /* margin: 0; */
    /* height: 100%;
    align-items: center;
    justify-content: center; */
  }
</style>
