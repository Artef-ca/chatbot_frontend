<script lang="ts">
  import ModelSelector from "./ModelSelector.svelte";
  import Switch from "./Switch.svelte";
  import type { Agent } from "./types";

  export let showModal: boolean; // boolean
  export let theme: any = "on"; // boolean
  export let realtime: any = "off"; // boolean

  export let modelToggle: boolean;
  export let models: Agent[];
  export let model: Agent = {
    type: "",
    message: "",
    title: "",
    img: "",
    intro: "",
  };
  let dialog: any; // HTMLDialogElement

  function selectAgent(agentt: Agent) {
    model = { type: "", message: "", title: "", img: "", intro: "" };
    model = agentt;
    console.log(model);
    modelToggle = false;
  }
  $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}
>
  Settings
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="close" on:click={() => dialog.close()}>
    <img src="/close.svg" alt="" style="width: 0.7rem;" />
  </div>
  <hr style="width: 93%;" />
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <div
      style="font-weight: 200; display: flex;
align-items: center;"
    >
      <img src="/theme.svg" alt="" />

      <div style="margin-left: 0.5rem;">Theme:</div>
    </div>
    <div style="margin-left: 1rem;">
      <Switch
        bind:value={theme}
        design="multi"
        options={["Light", "Dark"]}
        fontSize={12}
        label={""}
      />
    </div>
    <div
      style="font-weight: 200; display: flex;
align-items: center; padding-top:0.5rem;"
    >
      <img src="/realtime.svg" alt="" />

      <div style="margin-left: 0.5rem;">Realtime:</div>
    </div>
    <div style="margin-left: 1rem;">
      <Switch
        bind:value={realtime}
        design="multi"
        options={["Light", "Dark"]}
        fontSize={12}
        label={""}
      />
    </div>
    <div
      style="font-weight: 200; display: flex;
align-items: center; padding-top:0.5rem;"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <rect width="15" height="15" fill="url(#pattern0)" />
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              xlink:href="#image0_168_48335"
              transform="translate(0.0666667 0.0666667) scale(0.00888667)"
            />
          </pattern>
          <image
            id="image0_168_48335"
            width="100"
            height="100"
            xlink:href="data:image/png;base64,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"
          />
        </defs>
      </svg>
      <div style="margin-left: 0.5rem;">Model:</div>
    </div>
    <ul>
      {#each models as h}
        <li>
          <button
            on:click={() => {
              selectAgent(h);
            }}
            class="flexrow flex items-center gap-x-3 py-2 px-3 text-sm text-slate-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <img src={h.img} alt="" style="width: 1rem;" />
            <div
              style="display: flex; align-items: center;
     justify-content: space-between;"
            >
              <div style="margin-right: 0.5rem;">{h.title}</div>
              {#if model.title == h.title}
                <span class="selected"></span>
              {/if}
            </div>
          </button>
        </li>
      {/each}
    </ul>

    <!-- <hr /> -->
    <!-- svelte-ignore a11y-autofocus -->
    <!-- <button autofocus on:click={() => dialog.close()}>Close Settings</button> -->
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
  button {
    display: block;
  }

  .selected {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: green;
  }
  .flexrow {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }
</style>
