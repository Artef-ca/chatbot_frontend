<script lang="ts">
  export let onSubmit: (message: string) => void; // a callback function that will be called on Submit
  export let thinking:boolean
  export let abort: () => void;

  let newMessage = "";
  let length
  // &: length=newMessage.length

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      onSubmit(newMessage);
      newMessage = "";

      event.preventDefault(); // prevent any default action
    }
  }

  function handleClick() {
    onSubmit(newMessage);
    newMessage = "";
  }
</script>

<!-- Input -->
<div class="relative">
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div class="chat-box ">
    <input
     class="{thinking?'disabled':''}"
      bind:value={newMessage}
      on:keydown={handleKeydown}
      type="text"
      placeholder="What do you want to know?"
      id="userInput"
      disabled={thinking}
    />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    {#if thinking}
    <img src="/cancel.svg" on:click={abort}  />
    {:else}
    <img src="/send.svg" class="{newMessage.length==0?'empty':''}" on:click={handleClick}  />
    {/if}
  </div>

  <!-- Toolbar -->

  <!-- End Toolbar -->
</div>

<!-- End Input -->
<style>
  .chat-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  .chat-box input {
    border-radius: 130px 0px 0px 130px;
    background-color: var(--primary-light);
    width: 100%;
    padding: 15px;
    padding-right: 2rem;
    padding-top: 15px;
    margin: 5px 0;
    border: none;
    resize: none;
    height: 3rem;
    font-size: 0.8rem;
    color: var(--text-color);
    scrollbar-color: transparent transparent;
    margin-left: 10px;
  }
  .chat-box img {
    margin-left: -2rem;
    z-index: 9;
  }
  .chat-box input::placeholder {
    color: var(--text-color);
    opacity: 80%;
    font-weight: 300;
    /* font-family: "Poppins" !important; */
  }
  .disabled{
    opacity: 0.5;
  }
  .empty{
    filter: brightness(0.5);
  }

  @media screen and (max-width: 767px) {
    .chat-box {
      margin-top: auto;
      width: 100%;
      margin-right: auto;
      margin-left: auto;
    }
  }
</style>
