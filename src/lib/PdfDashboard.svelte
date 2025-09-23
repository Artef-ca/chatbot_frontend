<script lang="ts">
  import { jsPDF } from "jspdf";
  import { newApiRequest, showLoader } from "../Functions.svelte";
  import { base64ToPdf } from "../PdfGen.svelte";
  import type { MessageContents } from "./types";

  export let img: string;
  export let dashboard_url: string;
  export let pdf: string;
  export let title: string;
  export let idd: string;
  export let message: MessageContents;
</script>

<div class="dashboard">
  <div style="margin-bottom: 0.5rem;">{title}</div>
  <div
    style="display: flex;
  flex-direction: row;
  align-items: center;"
  >
    <div class="img">
      <img src={img} alt="" />
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="links">
      <a href={dashboard_url} target="”_blank”" class="link">
        <img src="/external.png" alt="" />
        <div>Go to Dashboard</div>
      </a>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <div
        class="link" style="cursor: pointer;"
        on:click={() => {
          showLoader.set({enabled:true})
          newApiRequest("download_pdf", "GET", {
            response_id: message.id,
            idd: idd,
          }).then((data) => {
            console.log(data);

            base64ToPdf(data.data.replace('data:image/png;base64,',''),title+'.pdf')
            showLoader.set({enabled:false})

          });
        }}
      >
        <img src="/download.png" alt="" />
        <div>Download PDF report</div>
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    padding-top: 0.3rem;
    margin: 0.3rem;
    background: var(--primary);
    border-radius: 0.5rem;
    padding: 0.4rem;
  }
  .dashboard .img {
    width: 14rem;
  }
  .dashboard .links {
    margin-left: 0.4rem;
    margin-right: 0.4rem;
    font-size: 0.8rem;
    margin: auto;
    display: flex;
  }
  .dashboard .links .link {
    padding: 0.2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-right: 2rem;
    font-size: 0.7rem;
  }
  .dashboard .links .link img {
    margin-right: 0.4rem;
    width: 1rem;
  }
</style>
