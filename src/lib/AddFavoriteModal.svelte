<script lang="ts">
  import {
    clickedElement,
    currentReport,
    isadding,
    setFavoriteModal,
    showAddFavoriteModal,
    showFavoriteModal,
  } from "../Functions.svelte";

  let ENABLED: boolean;
  let element: any;
  let report: any;
  showAddFavoriteModal.subscribe((data) => {
    console.log("subscribed");
    ENABLED = data.enabled;
  });
  clickedElement.subscribe((data) => {
    console.log("subscribed");
    element = data;
  });
  currentReport.subscribe((data:any) => {
    console.log("subscribed");
    report = data;
  });

  let dialog: any; // HTMLDialogElement
  let chart: boolean=false;
  let table: boolean=false;
  let response: boolean=false;
  let sql: boolean=false;
  let double: boolean=false;

  $: if (dialog && ENABLED) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => {
    isadding.set({ enabled: false });
    ENABLED = false;
    //   setFavoriteModal(false,null)
  }}
  on:click|self={() => {
    isadding.set({ enabled: false });
    dialog.close();
  }}
>
  Select Elements
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="close" on:click={() => dialog.close()}>
    <img src="/close.svg" alt="" style="width: 0.7rem;" />
  </div>
  <hr style="width: 93%;" />
  <!-- svelte-ignore a11y-no-static-element-interactions -->

  <div class="input">
    <div class="row">
      <input type="checkbox" id="name"  checked={chart} on:change={()=>{chart=!chart}} />
      <label for="name">Chart</label>
    </div>
    <div class="row">
      <input type="checkbox" id="table"   checked={table} on:change={()=>{table=!table}}/>
      <label for="table">Table</label>
    </div>
    <div class="row">
      <input type="checkbox" id="response"  checked={response} on:change={()=>{response=!response}} />
      <label for="response">Response</label>
    </div>
    <div class="row">
      <input type="checkbox" id="sql"  checked={sql} on:change={()=>{sql=!sql}} />
      <label for="sql">SQL</label>
    </div>
    <button style="border-radius: 0.5rem;"
      on:click={() => {
        //   if (title != "") {
        //     addToFavorite(title);
        //     dialog.close();
        //   }
        isadding.set({ enabled: false });
        currentReport.set([
          ...report,
          {
            element: element,
            chart: chart,
            table: table,
            response: response,
            sql: sql,
            double:double,
            isGrid:0
          },
        ]);
        double=false
        chart=false
        table=false
        response=false
        sql=false
        element={}
        dialog.close();
      }}>Add</button
    >
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
  .close {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }

  .input {
    color: white;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }
  input,
  select {
    background-color: var(--primary-light);
    /* width: 100%; */
    padding: 15px;
    padding-right: 0.5rem;
    padding-top: 15px;
    margin: 5px 0;
    border: none;
    resize: none;
    /* height: 3rem; */
    font-size: 0.8rem;
    color: var(--text-color);
    scrollbar-color: transparent transparent;
    /* margin-left: 10px; */
    margin-right: 0.5rem;
  }
  button {
    color: var(--text-color);
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
    background-color: var(--primary-light);
    margin: auto;
    margin-top: 1rem;
    display: block;
    font-size: 0.8rem;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
</style>
