<script lang="ts">
  export let icon: string;
  export let text: string;
  let popup: boolean = false;
  export let isGenerate = false;
  export let isThumbs = false;
  export let isDisabled = false;
  let disabled:boolean =false
  function handleClick() {
    console.log(isDisabled)

    if (isGenerate && !isThumbs) {
      disabled=true
      isDisabled = true;
    }
    console.log(isDisabled)
  }
  function togglePopup(value: boolean) {
    popup = value;
    console.log("hovering");
  }
  // $: handleClick()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- <img
    src={icon}
    alt=""
    on:mouseenter={() => togglePopup(true)}
    on:mouseleave={() => togglePopup(false)}
  /> -->
<div class="tooltip">
  <button disabled={isDisabled|| disabled} on:click={handleClick}>
    <img src={icon} alt="" class={isDisabled||disabled ? "disabled" : ""} />
  </button>
  <span class="tooltiptext">{text}</span>
</div>

<style>
  img {
    padding: 0.5rem;
    transform: scale(1.5);
  }
  .show {
    opacity: 100% !important;
  }
  .popup {
    transition: ease-out 300ms;
    opacity: 0%;
    padding: 0.2rem;
    color: var(--text-color);
    background: var(--primary-dark);
    border-radius: 1rem;
  }

  .tooltip {
    position: relative;
    display: inline-block;
  }

  /* Tooltip text */
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    width: 120px;
    visibility: visible;
    top: -5px;
    left: 105%;
  }
  .disabled {
    opacity: 0.5;
  }
</style>
