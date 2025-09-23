<script lang="ts">
  import { feedbackSet, setFeedback } from "../Feedback.svelte";
    import {
      emailSet,
      setEmail,
      setFavoriteModal,
      showFavoriteModal,
    } from "../Functions.svelte";
  
    let ENABLED: boolean;
    feedbackSet.subscribe((data) => {
      ENABLED = data.enabled;
    });
  
    let dialog: any; // HTMLDialogElement
    let title: string = "";
    let errorMsg: string = "";
  
    function onSubmit(){
      if (title != "") {
            setFeedback(title);
            dialog.close();
          } else {
            errorMsg = "Feedback is required";
          }
    }
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        onSubmit();
  
        event.preventDefault(); // prevent any default action
      }
    }
  
    $: if (dialog && ENABLED) dialog.showModal();
  </script>
  
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
  <dialog
    bind:this={dialog}
    on:click={(event) => {
      if (event.target === dialog) {
        dialog.close();
        ENABLED = false;
      }
    }}
    on:close={() => {
      ENABLED = false;
    }}
  >
    Enter feedback
    <!-- svelte-ignore a11y-no-static-element-interactions -->
  
    <hr style="width: 93%;" />
    <!-- svelte-ignore a11y-no-static-element-interactions -->
  
    <div class="input">
      <input
        type="email"
        placeholder="feedback"
        id="email"
        bind:value={title}
        required
        on:keydown={handleKeydown}
      />
      <div style="color: red; text-align:center;">{errorMsg}</div>
      <button style="border-radius: 0.5rem;"
        on:click={() => {
          if (title != "") {
            setFeedback(title);
            dialog.close();
          } else {
            errorMsg = "Feedback is required";
          }
        }}>Submit</button
      >
    </div>
  </dialog>
  
  <style>
    dialog {
      width: 20rem;
      max-width: 32em;
      border-radius: 0.2em;
      border: none;
      padding: 1rem;
      background: var(--primary);
      color: var(--text-color);
      border-radius: 1rem;
  
      /* height: 20rem; */
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.3);
    }
    dialog > div {
      padding: 1em;
    }
    dialog[open] {
      animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
      from {
        transform: scale(0.95);
      }
      to {
        transform: scale(1);
      }
    }
    dialog[open]::backdrop {
      animation: fade 0.2s ease-out;
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  
    .input {
      color: white;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
    }
    input,
    select {
      background-color: var(--primary-light);
      /* width: 100%; */
      padding: 15px;
      padding-right: 0.5rem;
      padding-top: 15px;
      margin: 5px 0;
      border: none;
      resize: none;
      height: 3rem;
      font-size: 0.8rem;
      color: var(--text-color);
      scrollbar-color: transparent transparent;
      /* margin-left: 10px; */
    }
    button {
      color: var(--text-color);
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 0.7rem;
      padding-bottom: 0.7rem;
      background-color: var(--primary-light);
      margin: auto;
      margin-top: 1rem;
      display: block;
      font-size: 0.8rem;
    }
  </style>
  