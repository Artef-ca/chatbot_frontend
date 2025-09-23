<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import Markdown from "svelte-exmarkdown";

  import AgentResponse from "./AgentResponse.svelte";
  import ChatIcon from "./ChatIcon.svelte";
  import CodeBlock from "./CodeBlock.svelte";
  import DataFrame from "./DataFrame.svelte";
  import Plotly from "./Plotly.svelte";
  import SlowReveal from "./SlowReveal.svelte";
  import Text from "./Text.svelte";
  import type { MessageContents } from "./types";
  import FavoriteModal from "./FavoriteModal.svelte";
  import PdfDashboard from "./PdfDashboard.svelte";
  import { feedbackSet } from "../Feedback.svelte";
  import { newApiRequest, setThumbsModal } from "../Functions.svelte";
  import {
    audienceSegment_writable,
    audienceType_writable,
    report_id_writable,
    withSegment_writable,
  } from "../chatFunctions.svelte";

  // Props passed from parent

  export let index: number;
  export let message: MessageContents;
  let reportId = "";
  report_id_writable.subscribe((data) => {
    reportId = data;
  });
  let segment = "";
  audienceSegment_writable.subscribe((data) => {
    segment = data;
  });
  let audienceType = "";
  audienceType_writable.subscribe((data) => {
    audienceType = data;
  });
  let withSegment = false;
  withSegment_writable.subscribe((data) => {
    withSegment = data;
  });

  function download() {
    let params: any = {
      report_id: reportId.toLowerCase() == 'default'? 'Default' + ' ' + audienceType: reportId,
    };
    if (withSegment) {
      params = { segment_name: segment, report_id: reportId.toLowerCase() == 'default'? 'Default' + ' ' + audienceType: reportId,
    };
      withSegment_writable.set(false)
    }

    newApiRequest(
      "download_report",
      "GET",
      params,
      "audience"
    );
  }
  function copy() {
    navigator.clipboard.writeText(message.report);
  }
  let isFullTextVisible = false;
  function toggleTextVisibility() {
    isFullTextVisible = !isFullTextVisible;
  }

  // Local thumbs state for this message instance
  let localThumbsRating: boolean | null = null;
  let showReport: boolean = false;

  // Thumbs up click: update local state and call API
  function rateUp() {
    if (localThumbsRating === true) {
      localThumbsRating = null;
    } else {
      localThumbsRating = true;
      newApiRequest("rate", "POST", {
        message_id: message.message_id,
        rating: "good",
      });
    }
  }

  // Thumbs down click: update local state and open the feedback dialog
  function rateDown() {
    if (localThumbsRating === false) {
      localThumbsRating = null;
    } else {
      localThumbsRating = false;
      newApiRequest("rate", "POST", {
        message_id: message.message_id,
        rating: "bad",
      });

      // Open the feedback dialog for this message.
      setThumbsModal(true, message, null);
    }
  }
</script>

<AgentResponse {message} isAudience={true}>
  <Text user={false}>
    <Markdown md={message.response} />
    {#if message.report && showReport}
      <div class="report">
        <Markdown
          md={isFullTextVisible
            ? message.report
            : message.report
              ? message.report.slice(0, 500) + "..."
              : ""}
        />
        <button
          on:click={toggleTextVisibility}
          style="margin-top: 0.5rem; opacity:0.6;"
        >
          {isFullTextVisible ? "Show Less" : "Show More"}
        </button>
        <!-- {/if} -->
      </div>
    {/if}
    <!-- <Markdown md={"test"} /> -->
  </Text>

  <div class="icons">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="line">
      <!-- Thumbs Up -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div on:click={rateUp}>
        {#if localThumbsRating === true}
          <ChatIcon icon={"/uptrue.svg"} text={"Answer was correct"} />
        {:else}
          <ChatIcon
            icon={"/up.svg"}
            text={"Answer was correct"}
            isDisabled={false}
          />
        {/if}
      </div>
      <!-- Thumbs Down -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div on:click={rateDown}>
        {#if localThumbsRating === false}
          <ChatIcon icon={"/downtrue.svg"} text={"Answer was wrong"} />
        {:else}
          <ChatIcon
            icon={"/down.svg"}
            text={"Answer was wrong"}
            isDisabled={false}
          />
        {/if}
      </div>
      {#if message.report}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={() => [(showReport = !showReport)]}>
          <ChatIcon icon={"/show.svg"} text={"Show/Hide"} />
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={download}>
          <ChatIcon icon={"/download.svg"} text={"Download"} />
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={copy}>
          <ChatIcon icon={"/copy.svg"} text={"Copy"} />
        </div>
      {/if}
    </div>
  </div>
</AgentResponse>

<style>
  .showSqlBtn {
    padding: 0.3rem;
    border: 1px solid white;
    border-radius: 0.375rem;
    width: max-content;
    background: var(--primary-dark);
    cursor: pointer;
  }
  .icons {
    display: flex;
    flex-direction: column;
  }
  .line {
    display: flex;
    flex-direction: row;
  }
  .line img {
    padding: 0.5rem;
    transform: scale(1.5);
  }
</style>
