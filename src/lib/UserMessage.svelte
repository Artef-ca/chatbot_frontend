<script lang="ts">
  import Text from "./Text.svelte";
  import type { MessageContents } from "./types";

  /** @type {string} */
  export let message: string;
  let initmessage: string;
  export let id: number;
  export let newQuestion: (question: string) => void;
  export let editMessage: (index: number, message: string) => void;
  export let thinking: boolean;
  export let messageLog: MessageContents[];
  function enabled(i: number) {
    let temp: any[] = [];
    messageLog.forEach((msg) => {
      if (msg.type == "user_question") {
        temp.push(msg);
      }
    });
    console.log("temp", temp);
    if (temp[temp.length - 1] == messageLog[i]) {
      console.log("true");
      return true;
    } else {
      console.log("false");
      return false;
    }
  }

  let isEdit: boolean = false;

  var d = new Date(); // for now
  d.getHours(); // => 9
  d.getMinutes(); // =>  30
  d.getSeconds(); // => 51
  function startEdit() {
    initmessage = message;
    isEdit = true;
    setTimeout(() => {
      document.getElementById(id + "input")?.focus();
    }, 200);
    console.log(id + "input");
  }
  function endEdit(e: any) {
    // console.log(e)
    if (e.key == "Enter") {
      setTimeout(() => {
        isEdit = false;
        if (message != initmessage) {
          // newQuestion(message)
          editMessage(id, message);
        }
      }, 200);
    }
  }
</script>

<!-- Chat Bubble -->
<li class="py-2 sm:py-4">
  <div class="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
    <div class="max-w-2xl flex gap-x-2 sm:gap-x-4 userMsg">
      <!-- <div class="timestamp">
        {(d.getHours() < 10 ? "0" : "") + d.getHours()}:{(d.getMinutes() < 10
          ? "0"
          : "") + d.getMinutes()}
      </div> -->
      <span
        class="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full "
      >
        <!-- <span class="text-sm font-medium text-white leading-none">You</span> -->
        <img src="/userChat.svg" alt="" />
      </span>

      <div class="space-y-3 style">
        {#if !isEdit}
        <div class={isEdit ? "hide" : "shown"}>
          <p class="text-gray-200" style="white-space:pre-wrap;" class:user={true}>
            {message}
        </p>
          <!-- <Text user={true}>
          </Text> -->
        </div>
        {:else}
        <input
          disabled={!isEdit}
          id="{id}input"
          class={isEdit ? "hide" : "shown"}
          style="
          margin-top: -1rem;
          color:black;
          background: #9d9d9d
         "
          size={message.length - message.length * 0.07}
          bind:value={message}
          on:keydown={endEdit}
        />
        <slot />
        {/if}
      </div>
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <button
        on:click={() => {
          if (isEdit) {
            endEdit({ key: "Enter" });
            return;
          } else {
            startEdit();
            return;
          }
        }}
        disabled={thinking || !enabled(id)}
      >
        <img
          style={thinking || !enabled(id) ? "filter: opacity(0.3);" : ""}
          src={!isEdit ? "/edit.svg" : "/check.svg"}
          alt=""
        />
      </button>
    </div>
  </div>
</li>

<!-- End Chat Bubble -->

<style>
  .userMsg {
    display: flex;
    flex-direction: row-reverse;
    margin-left: auto;
    align-items: center;
  }
  .style {
    border-radius: 10px;

    margin-left: 0rem;
    margin-right: 1rem;
    background-color: var(--menu-text-color);
    color: var(--primary);
    font-size: 0.8rem;
    line-height: 1.3 !important;
    /* font-family: "Poppins" !important; */
    padding: 0.7rem;
  }

  .timestamp {
    margin-right: -3rem;
    font-weight: 200;
    text-align: end;
    font-size: 0.7rem;
    color: var(--text-color);
    
  }
  .hide {
  }

  .shown {
    opacity: 100%;
    z-index: 9;
    color: var(--primary-dark);
    background: transparent;
  }
  .user{
        /* color: var(--text-color); */
        color: var(--primary);

    }
</style>
