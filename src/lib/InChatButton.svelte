<script lang="ts">
  export let message: string;
  export let onSubmit: (message: string) => void; // a callback function that will be called on Submit
  export let isGenerate = false;
  let isDisabled = false;
  function handleClick() {
    onSubmit(message);
    if (isGenerate) {
      isDisabled = true;
    }
  }
</script>

<button
  type="button"
  on:click={handleClick}
  disabled={isDisabled}
  class=" {isDisabled
    ? 'disabled'
    : ''} mb-2.5 mr-1.5 py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-md border "
  style="background:var(--primary); color:white; border-color:white; padding: 0.3rem;"
>
  {message}
</button>

<style>
  .disabled {
    opacity: 0.5;
  }
</style>
