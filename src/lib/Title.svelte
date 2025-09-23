<script lang="ts">
  export let started: boolean;
  
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
  <div id="logoHeader" class:chatStarted={started}>
    {#if !started}

    <!-- <img src="/logo.png" id="headerImg" alt="" style="width: 20rem;" class:header-in-chat={started} /> -->
    {/if}
    {#if !started}
    <h1> What will you discover?</h1>

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

    text-align: center;
    color: var(--text-color);
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    /* margin-top: 3rem; */
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
    font-size: 2rem;
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
  @media screen and (max-width: 767px) {
    .form-header h1 {
      font-size: 2rem;
    }
    .form-header p {
      font-size: 0.85rem;
    }
  }
</style>
