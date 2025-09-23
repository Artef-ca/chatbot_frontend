<script lang="ts">
  import type { Agent, MessageResponse } from "./types";

  export let newQuestionPage: () => void;
  export let toggleMenu: () => void;
  export let menuToggle: boolean;
  export let agents: Agent[];
  export let agent: Agent;
  function selectAgent(agentt: Agent) {
    agent = { type: "", message: "", title: "", img: "", intro: "" };
    agent = agentt;
    console.log(agent);
    menuToggle = false;
  }
</script>

<li>
  <button
    class="flex items-center gap-x-3 py-2 px-3 text-sm rounded-md text-slate-400 item"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <svg
      class="w-3.5 h-3.5"
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      on:click={newQuestionPage}
    >
      <path
        d="M7.99998 1.875C7.99998 1.875 3.87598 5.2125 1.57131 7.02C1.43598 7.135 1.33331 7.3025 1.33331 7.5C1.33331 7.84562 1.63131 8.125 1.99998 8.125H3.33331V12.5C3.33331 12.8456 3.63131 13.125 3.99998 13.125H5.99998C6.36865 13.125 6.66665 12.845 6.66665 12.5V10H9.33331V12.5C9.33331 12.845 9.63131 13.125 9.99998 13.125H12C12.3686 13.125 12.6666 12.8456 12.6666 12.5V8.125H14C14.3686 8.125 14.6666 7.84562 14.6666 7.5C14.6666 7.3025 14.564 7.135 14.4113 7.02C12.1226 5.2125 7.99998 1.875 7.99998 1.875Z"
        fill="#94a3b8"
      />
    </svg>
    <div
      style="display: flex; align-items: center;
     justify-content: space-between;"
    >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div style="margin-right: 0.5rem;" on:click={newQuestionPage}>Home</div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        on:click={toggleMenu}
        class="transition-all duration-300 {menuToggle ? 'rotate' : ''}"
      >
        <svg
          class="w-3.5 h-3.5"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.3938 5L13 5.64687L8 11L3 5.64687L3.60313 5L8 9.70312L12.3938 5Z"
            fill="#94a3b8"
          />
        </svg>
      </div>
    </div>
  </button>
</li>
<div
  class="homeMenu {menuToggle
    ? 'openHome'
    : 'closeHome'} transition-all duration-300"
>
  {#each agents as h}
    <li>
      <button
        on:click={() => {
          selectAgent(h);
        }}
        class="flex items-center gap-x-3 py-2 px-3 text-sm rounded-md text-slate-400 item2"
      >
        <img src={h.img} alt="" style="width: 1rem;" />
        <div
          style="display: flex; align-items: center;
     justify-content: space-between;"
        >
          <div style="margin-right: 0.5rem;">{h.title}</div>
        </div>
      </button>
    </li>
  {/each}
</div>

<style>
  .homeMenu {
    background: var(--primary-dark);
    position: absolute;
    border-radius: 0.5rem;
  }
  .openHome {
    height: 7rem;
    overflow: hidden;
  }
  .closeHome {
    height: 0px;
    overflow: hidden;
  }
  .rotate {
    transform: rotate(180deg);
  }
  .item {
    color: var(--menu-text-color);
  }
  .item2 {
    color: var(--menu-text-color);
  }
  .item:hover {
    background: var(--primary-dark);
  }
  .item2:hover {
    background: var(--primary-light);
  }
</style>
