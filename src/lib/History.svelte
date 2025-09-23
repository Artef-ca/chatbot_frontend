<script lang="ts">
  import type { SrvRecord } from "dns";
  import {
    agent_writable,
    messageLogWritable,
    newApiRequest,
  } from "../Functions.svelte";
  import type { MessageContents } from "./types";
  import {
  addMessage,
    question_asked_writable,
    report_id_writable,
    startAudience,
    started_writable,
  } from "../chatFunctions.svelte";

  export let toggleHistory: () => void;
  export let toggleReportHistory: () => void;
  export let loadQuestionPage: (q: any) => void;
  export let historyToggled: boolean;
  export let reportHistoryToggled: boolean;
  export let questionHistory: any[] = [];
  let agent: string;
  agent_writable.subscribe((data) => {
    agent = data;
    console.log("AGENT", agent);
  });

  function toggle() {
    if (!historyToggled) {
      newApiRequest("chat_history", "POST", {
        user_id: localStorage.getItem("user_email"),
      }).then((data) => {
        console.log("history", data);
        setQuestionHistory(data.data);
      });
    }

    toggleHistory();
  }
  function toggleReport() {
    if (!reportHistoryToggled) {
      newApiRequest(
        "get_report_history",
        "POST",
        {
          user_id: localStorage.getItem("user_email"),
        },
        "audience"
      ).then((data) => {
        console.log("history", data);
        setQuestionHistory(data.data);
      });
    }

    toggleReportHistory();
  }
  function selectAgent(question: string) {
    addMessage(
      {
        data: {
          type: "audience_bot_msg",
          message: question,
          buttons: ["Identified", "Unidentified"],
        },
        state: true,
      },
      "audience_bot_msg"
    );
    startAudience(question);
    started_writable.set(true);
  }

  function setQuestionHistory(data: any): MessageContents {
    // if (data.type === "question_history") {
    questionHistory = data;
    // }

    return data;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if agent == "insights"}
  <li on:click={toggle} style="list-style:none">
    <button
      class="flex items-center gap-x-3 py-2 px-3 text-sm text-slate-700 rounded-md dark:text-slate-400 item"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.9">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.5 0.5C7 0.5 3.9 2.4 2.3 5.3L0 3V9.5H6.5L3.7 6.7C5 4.2 7.5 2.5 10.5 2.5C14.6 2.5 18 5.9 18 10C18 14.1 14.6 17.5 10.5 17.5C7.2 17.5 4.5 15.4 3.4 12.5H1.3C2.4 16.5 6.1 19.5 10.5 19.5C15.8 19.5 20 15.2 20 10C20 4.8 15.7 0.5 10.5 0.5ZM9 5.5V10.6L13.7 13.4L14.5 12.1L10.5 9.7V5.5H9Z"
            fill="#94A2B9"
          />
        </g>
      </svg>

      {#if historyToggled}Close Chat History{:else}Open Chat History{/if}
    </button>
  </li>

  <div
    class="historySection transition-all duration-300 {!historyToggled
      ? 'openHome'
      : ''}"
    style={historyToggled ? "background:var(--primary)" : ""}
  >
    {#each questionHistory as q, index}
      {#if historyToggled && q.is_deleted != 1}
        {#if questionHistory.length == 0}
          <div>Loading...</div>
        {/if}
        <li style="list-style: none;">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <button
            class="flex items-center text-left gap-x-3 py-2 px-3 text-sm rounded-md item dark:text-slate-400"
            style="width:100%"
          >
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="historyIcon.svg" style="width: 1rem;" />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class="questionBox"
              on:click={() => {
                loadQuestionPage(q);
              }}
            >
              {q.question}
            </div>
            <button
              style="z-index: 9;
           padding: 0.5rem; 
          /* height: 0.5rem; */
          width: 1rem;
          display: flex;
          height: 1rem;
          border-radius: 0.5rem;
          background: var(--primary-light);
          align-items: center;
          justify-content: center;
      "
              on:click={() => {
                console.log("deleting");
                let temp = questionHistory;

                temp.splice(index, 1);
                questionHistory = temp;
                console.log(questionHistory.length);
                // console.log("res", data);
                newApiRequest("/to_delete", "POST", {
                  user_id: localStorage.getItem("user_email"),
                  response_id: q.id,
                  // newApiRequest("load_question", "GET", {
                  //   id: q.id,
                  //   question: q.question,
                  // }).then((data) => {

                  // });
                });
              }}>-</button
            >
          </button>
        </li>
      {/if}
    {/each}
  </div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if agent == "audience"}
  <li on:click={toggleReport} style="list-style:none">
    <button
      class="flex items-center gap-x-3 py-2 px-3 text-sm text-slate-700 rounded-md dark:text-slate-400 item"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.9">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.5 0.5C7 0.5 3.9 2.4 2.3 5.3L0 3V9.5H6.5L3.7 6.7C5 4.2 7.5 2.5 10.5 2.5C14.6 2.5 18 5.9 18 10C18 14.1 14.6 17.5 10.5 17.5C7.2 17.5 4.5 15.4 3.4 12.5H1.3C2.4 16.5 6.1 19.5 10.5 19.5C15.8 19.5 20 15.2 20 10C20 4.8 15.7 0.5 10.5 0.5ZM9 5.5V10.6L13.7 13.4L14.5 12.1L10.5 9.7V5.5H9Z"
            fill="#94A2B9"
          />
        </g>
      </svg>

      {#if reportHistoryToggled}Close Report History{:else}Open Report History{/if}
    </button>
  </li>

  <div
    class="historySection transition-all duration-300 {!reportHistoryToggled
      ? 'openHome'
      : ''}"
    style={reportHistoryToggled ? "background:var(--primary)" : ""}
  >
    {#each questionHistory as q, index}
      {#if reportHistoryToggled && q.is_deleted != 1}
        {#if questionHistory.length == 0}
          <div>Loading...</div>
        {/if}
        <li style="list-style: none;">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <button
            class="flex items-center text-left gap-x-3 py-2 px-3 text-sm rounded-md item dark:text-slate-400"
            style="width:100%"
          >
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="historyIcon.svg" style="width: 1rem;" />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class="questionBox"
              on:click={() => {
                report_id_writable.set(q.report_id)
                started_writable.set(false);
                messageLogWritable.set([]);
                question_asked_writable.set(false);
                agent_writable.set("audience");
                selectAgent(
                  "Welcome to the Audience section! Which type of audience would you like to explore?"
                );
              }}
            >
              {q.report_id}
            </div>
            <button
              style="z-index: 9;
           padding: 0.5rem; 
          /* height: 0.5rem; */
          width: 1rem;
          display: flex;
          height: 1rem;
          border-radius: 0.5rem;
          background: var(--primary-light);
          align-items: center;
          justify-content: center;
      "
              on:click={() => {
                console.log("deleting");
                let temp = questionHistory;

                temp.splice(index, 1);
                questionHistory = temp;
                console.log(questionHistory.length);
                // console.log("res", data);
                newApiRequest("delete_report", "DELETE", {
                  user_id: localStorage.getItem("user_email"),
                  report_id: q.report_id,
                  // newApiRequest("load_question", "GET", {
                  //   id: q.id,
                  //   question: q.question,
                  // }).then((data) => {

                  // });
                },'audience');
              }}>-</button
            >
          </button>
        </li>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .historySection {
    height: 20rem;
    overflow: scroll;
    display: block;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .historySection::-webkit-scrollbar {
    display: none;
  }

  .openHome {
    height: 0rem;
    overflow: hidden;
  }
  .questionBox {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80%;
    padding: 0.2rem;
    white-space: nowrap;
    color: var(--menu-text-color);
  }
  .item {
    color: var(--menu-text-color);
  }
  .item:hover {
    background: var(--primary-dark);
  }
</style>
