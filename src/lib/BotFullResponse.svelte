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

  // Props passed from parent
  export let toggledChart: boolean[] = [false];
  export let toggledDF: boolean[] = [false];
  export let toggledSql: boolean[] = [false];
  export let table: boolean = false;
  export let sql: boolean = false;

  export let index: number;
  export let message: MessageContents;

  export let isCache: boolean;

  export let generateFollowUpQuestions: (question: MessageContents) => void;
  export let generateChart: (question: MessageContents) => void;
  export let generateSummary: (question: MessageContents) => void;

  export let toggleChart: (i: number) => void;
  export let toggleDF: (i: number) => void;
  export let toggleSql: (i: number) => void;

  // Local thumbs state for this message instance
  let localThumbsRating: boolean | null = null;

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

<AgentResponse toggledChart={toggledChart[index]} {message}>
  <Text user={false}>
    <Markdown md={message.response} />
  </Text>
  {#if message.dataframe != ""}
    {#if toggledChart[index]}
      <DataFrame id={message.message_id} df={message.dataframe} />
    {/if}
  {/if}
  {#if toggledDF[index]}
    <Plotly fig={message.fig} />
  {/if}
  {#if message.sql_query != ""}
    {#if toggledSql[index]}
      <Text user={false}>
        <CodeBlock>
          <SlowReveal text={message.sql_query} />
        </CodeBlock>
      </Text>
    {/if}
  {/if}
  {#if message.dashboards}
    <div style="display: flex; flex-direction: column;">
      {#each message.dashboards as item}
        <PdfDashboard
          img={item.image_base64}
          dashboard_url={item.link}
          title={item.title}
          pdf={""}
          {message}
          idd={item.idd}
        />
      {/each}
    </div>
  {/if}
  <div class="icons">
    <div class="line">
      <!-- Toggle table display -->
      <div
        on:click={() => {
          toggleChart(index);
          table = !table;
        }}
      >
        {#if table}
          <ChatIcon
            icon={"/table.svg"}
            text={"Hide table"}
            isDisabled={message.dataframe == ""}
          />
        {:else}
          <ChatIcon
            icon={"/table.svg"}
            text={"Show table"}
            isDisabled={message.dataframe == ""}
          />
        {/if}
      </div>
      <!-- Toggle SQL display -->
      <div
        on:click={() => {
          toggleSql(index);
          sql = !sql;
        }}
      >
        {#if sql}
          <ChatIcon
            icon={"/sql.svg"}
            text={"Hide SQL"}
            isDisabled={message.sql_query == ""}
          />
        {:else}
          <ChatIcon
            icon={"/sql.svg"}
            text={"Show SQL"}
            isDisabled={message.sql_query == ""}
          />
        {/if}
      </div>
      <!-- Generate chart -->
      <div on:click={() => generateChart(message)}>
        <ChatIcon
          icon={"/plot.svg"}
          text={"Generate chart"}
          isGenerate={true}
          isDisabled={message.sql_query == "" || message.dataframe == ""}
        />
      </div>
      <!-- Thumbs Up -->
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
    </div>
  </div>
</AgentResponse>

{#if !isCache}
  <!-- Additional UI for non-cached messages if needed -->
{/if}

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
