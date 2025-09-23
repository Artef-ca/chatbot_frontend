<script lang="ts">
  import History from "./History.svelte";
  import SidebarItem from "./SidebarItem.svelte";

  import type { Agent, MessageContents, QuestionLink } from "./types";
  import ModelSelector from "./ModelSelector.svelte";
  import Modal from "./Modal.svelte";

  import {
    agent_writable,
    email,
    emailSet,
    setMessageLog,
  } from "../Functions.svelte";
  import { authService } from "./auth/authStore";
  import { isAuthenticated } from "./auth/stores";
  import { question_asked_writable, started_writable } from "../chatFunctions.svelte";

  export let newQuestionPage: () => void;
  export let loadQuestionPage: (q: any) => void;
  export let messageLog: MessageContents[];
  export let model: Agent;
  export let models: {
    type: string;
    message: string;
    title: string;
    img: string;
    intro: string;
  }[];

  export let questionHistory: QuestionLink[];
  let historyToggled: boolean = false;
  let reportHistoryToggled: boolean = false;
  export let sidebarToggled: boolean;
  let started: boolean;
  export let question_asked: boolean;
  let menuToggle: boolean = false;
  let modelToggle: boolean = false;
  let showModal: boolean = false;
  let isEmailSet: boolean = false;
  let agent: any;
  // export let theme: any = "on"; // boolean
  started_writable.subscribe((data) => {
    started = data;
  });
  agent_writable.subscribe((data) => {
    agent = data;
  });
  emailSet.subscribe((data) => {
    isEmailSet = data.enabled;
  });

  question_asked_writable.subscribe((data) => {
    question_asked = data;
  });
  function toggleHistory() {
    historyToggled = !historyToggled;
    reportHistoryToggled = false
    // menuToggle = false;
  }
  function toggleReportHistory() {
    reportHistoryToggled = !reportHistoryToggled;
    historyToggled =false
    // menuToggle = false;
  }
  function toggle() {
    sidebarToggled = !sidebarToggled;
  }
  function startChat(agent: Agent) {
    console.log(agent);
    newQuestionPage();
  }
  $: agent, startChat(agent);
</script>

<!-- Sidebar -->
<div
  style="background: var(--primary-light); border-color:var(--primary-dark) "
  class=" transition-all duration-300 {sidebarToggled ? 'sidebarClosed' : ''}
   fixed top-0 left-0 bottom-0 z-[60] w-64 bg-white border-r border-gray-200 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 dark:scrollbar-y"
>
  <nav class="hs-accordion-group w-full h-full flex flex-col">
    <div class="flex items-center justify-between py-4 pr-4 pl-7">
      <!-- Logo -->
      <img class="w-28 h-auto" src="/groqlogo.png" alt="Logo" />

      <!-- End Logo -->

      <!-- Sidebar Toggle -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="" on:click={toggle}>
        <button
          type="button"
          class="w-8 h-8 inline-flex justify-center items-center gap-2 rounded-md text-gray-700 align-middle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all dark:text-gray-400 dark:focus:ring-offset-gray-800"
          data-hs-overlay="#application-sidebar"
          aria-controls="application-sidebar"
          aria-label="Toggle navigation"
        >
          <svg
            class="w-4 h-4"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
            />
          </svg>
          <span class="sr-only">Sidebar</span>
        </button>
      </div>
      <!-- End Sidebar Toggle -->
    </div>

    <div class="h-full">
      <!-- List -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <ul class="space-y-1.5 p-4">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
          on:click={() => {
        //     agent_writable.set("insights");
        // started_writable.set(false);
        // messageLogWritable.set([]);
        // console.log(selected);
            started_writable.set(false);
            agent_writable.set("insights");
            messageLog = [];
            question_asked = false;
            question_asked_writable.set(false)

            newQuestionPage();
            setMessageLog([]);
          }}
        >
          <SidebarItem title={"New Discovery"} img={"plusIcon.svg"} />
        </li>
        <History
          {toggleHistory}
          {toggleReportHistory}
          {loadQuestionPage}
          {questionHistory}
          {historyToggled}
          {reportHistoryToggled}
          {agent}
        />
      </ul>
      <!-- End List -->
    </div>

    <!-- Footer -->
    <div class="mt-auto">
      <div class="py-2.5 px-7">
        <p class="inline-flex items-center gap-x-2 text-xs text-green-600">
          <!-- <span class="block w-1.5 h-1.5 rounded-full bg-green-600"></span>
          Connected {$email} -->
        </p>
      </div>

      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- <a
          on:click={async () => {
            localStorage.removeItem("user_email");
            await authService.logout();
            emailSet.set({
              enabled: true,
            });
          }}
          class="flex justify-between items-center gap-x-3 py-2 px-3 text-sm rounded-md item dark:text-slate-400"
        >
          {$isAuthenticated ? "Sign out" : "Sign in"}
          <svg
            class="w-3.5 h-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"
            />
            <path
              fill-rule="evenodd"
              d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
            />
          </svg>
        </a> -->
      </div>
    </div>
    <!-- End Footer -->
  </nav>
</div>
<Modal bind:showModal {models} {modelToggle} bind:model></Modal>

<!-- End Sidebar -->
<style>
  .sidebarClosed {
    --tw-translate-x: -100%;
    transform: translateX(-100%);
  }
  .item {
    color: var(--menu-text-color);
  }
  .item:hover {
    background: var(--primary-dark);
  }
</style>
