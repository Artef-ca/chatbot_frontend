<script lang="ts">
  import { onMount } from "svelte";
  import { envReady, newApiRequest } from "../Functions.svelte";

  export let started: boolean;

  function getGreeting() {
    newApiRequest("greet", "POST", {}).then((data) => {
      console.log(data);
      if (data.data.greeting_message == undefined) {
        setTimeout(()=>{
          getGreeting();
        },3000)
        
      } else {
        mainMsg = data.data.greeting_message;
        subMsg = data.data.followup_message;
        console.log(mainMsg);
      }
    });
  }
  onMount(() => {
    envReady.subscribe((ready) => {
      if (ready) {
        getGreeting();
      }
    });
  });
  let mainMsg = "";
  let subMsg = "";
</script>

<!-- Title -->
<!-- <div class="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
    <img src="/chatbot.png" id="headerImg" alt="" style="height: 7rem;" />
    <h1 class="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
      Welcome to <span class="nav-title">Hiwar</span>
    </h1>
    <p class="mt-3 text-gray-600 dark:text-gray-400">
      Nakheel Assets' AI assistant to support employee in taking data-driven
      decisions & enhance productivity
    </p>
  </div> -->
<div class="form-header" id="formHeader" class:lessMargin={started}>
  <div
    id="logoHeader"
    class:chatStarted={started}
    style=" min-height: 5em;
"
  >
    {#if !started}
      <!-- <img src="/logo.png" id="headerImg" alt="" style="width: 20rem;" class:header-in-chat={started} /> -->
    {/if}
    {#if !started}
      <h1 class="{mainMsg != '' ? 'start' : ''} mainMsg">{mainMsg}</h1>
      <h1 class="sub {mainMsg != '' ? 'subStart' : ''}">{subMsg}</h1>
      <!-- <h1> Good evening, Marc.</h1>
      <h1 class="sub"> How can I help you today?</h1> -->
    {/if}
    {#if started}
      <!-- <h1> THE LINE AI Insights</h1> -->
    {/if}
  </div>
  <!-- {#if (!started)}
    <p id="headerText">
      What will you discover?
    </p>
    {/if} -->
</div>

<!-- End Title -->

<style>
  .form-header {
    /* font-family: "Poppins" !important; */

    /* text-align: center; */
    color: var(--text-color);
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
  .form-header img {
    transform: scale(0.7);
    transition: ease-out;
    /* margin-right: -3rem; */
    margin: auto;
  }

  .form-header h1 {
    /* font-family: "Poppins" !important; */
    font-weight: 300;
    font-size: 2rem;
    margin-bottom: 0rem;
    /* margin-top: -1rem; */
    font-size: 1.6rem;
  }
  .form-header p {
    /* font-family: "Poppins" !important; */
    font-weight: 300;
    font-size: 1rem;
    color: var(--text-color);
    margin-top: 2rem;
    font-size: 0.85rem;
  }
  .lessMargin {
    margin-top: 0rem !important;
  }
  .header-in-chat {
    transform: scale(0.7) !important;
    margin-right: -3rem;
    margin: unset !important;
  }
  .chatStarted {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /* margin-left: -3rem; */
  }
  .mainMsg {
    opacity: 0;
  }
  .start {
    opacity: 1;
    transition: cubic-bezier(0.55, 0.08, 0.68, 0.53) 0.5s;
  }
  .sub {
    opacity: 0;
  }
  .subStart {
    opacity: 0.8;
    transition: cubic-bezier(0.55, 0.08, 0.68, 0.53) 1s;
  }
  @media screen and (max-width: 767px) {
    .form-header h1 {
      font-size: 2rem;
    }
    .form-header p {
      font-size: 0.85rem;
    }
  }
</style>
