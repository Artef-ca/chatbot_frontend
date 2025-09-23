<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    import AgentResponse from "./AgentResponse.svelte";
    import ChatIcon from "./ChatIcon.svelte";
    import CodeBlock from "./CodeBlock.svelte";
    import DataFrame from "./DataFrame.svelte";
    import InChatButton from "./InChatButton.svelte";
    import Plotly from "./Plotly.svelte";
    import SlowReveal from "./SlowReveal.svelte";
    import Text from "./Text.svelte";
    import UserMessage from "./UserMessage.svelte";
    import type { MessageContents } from "./types";
  
    export let toggledChart: boolean[] = [false];
    export let toggledDF: boolean[] = [false];
    export let toggledSql: boolean[] = [false];
  
    export let index: number;
    export let message: MessageContents;
  
    export let marked_correct: boolean | null;
    export let isCache: boolean;
  
    export let generateFollowUpQuestions: (question: MessageContents) => void;
    export let generateChart: (question: MessageContents) => void;
    export let generateSummary: (question: MessageContents) => void;
  
    export let toggleChart: (i: number) => void;
    export let toggleDF: (i: number) => void;
    export let toggleSql: (i: number) => void;
  </script>
  
  <AgentResponse toggledChart={toggledChart[index]}>
    <Text user={false}>
      <SvelteMarkdown source={message.response}></SvelteMarkdown>
    </Text>
    {#if message.df !='' }
    {#if toggledChart[index]}
    <DataFrame id={message.id} df={message.df} />
    {/if}
    {/if}
    {#if toggledDF[index]}
      <Plotly fig={message.fig} />
    {/if}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- <div on:click={() => toggleChart(index)} class="showSqlBtn">
      {#if toggledChart[index]}Hide Chart{:else}Show Chart{/if}
    </div> -->
    {#if message.sql_query !='' }
  
    {#if toggledSql[index]}
      <Text user={false}>
        <CodeBlock>
          <SlowReveal text={message.sql_query} />
        </CodeBlock>
      </Text>
    {/if}
    {/if}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- <div on:click={() => toggleSql(index)} class="showSqlBtn">
      {#if toggledSql[index]}Hide SQL{:else}Show SQL{/if}
    </div> -->
    <!-- <InChatButton
      message={"Generate Follow up Questions"}
      isGenerate={true}
      onSubmit={() => generateFollowUpQuestions(message)}
    />
    <InChatButton
      message={"Generate Summary"}
      isGenerate={true}
      onSubmit={() => generateSummary(message)}
    /> -->
    <div class="icons">
      <div class="line">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={() => toggleChart(index)}>
          <ChatIcon icon={"/chart.svg"} text={'Toggle dataframe'}/>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={() => toggleSql(index)}>
          <ChatIcon icon={"/sql.svg"} text={'Toggle SQL'}/>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={() => (marked_correct = true)}>
          <ChatIcon icon={"/up.svg"} text={'Answer was correct'} />
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={() => (marked_correct = false)}>
          <ChatIcon icon={"/down.svg"} text={'Answer was wrong'} />
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={() => generateChart(message)}>
          <ChatIcon icon={"/plot.svg"} text={'Generate chart'} isGenerate={true}/>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- <div on:click={() => generateFollowUpQuestions(message)}>
          <ChatIcon icon={"/moreQuestions.svg"} text={'Generate follow up questions'} isGenerate={true}/>
        </div> -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- <div on:click={() => generateSummary(message)}>
          <ChatIcon icon={"/summarize.svg"}  text={'Generate summary'} isGenerate={true}/>
        </div> -->
      </div>
    </div></AgentResponse
  >
  
  {#if !isCache}
    <!-- <AgentResponse>
      <Text user={false}>Were the results correct?</Text>
      {#if marked_correct === null}
        <InChatButton message="Yes" onSubmit={() => (marked_correct = true)} />
        <InChatButton message="No" onSubmit={() => (marked_correct = false)} />
      {/if}
    </AgentResponse> -->
    {#if marked_correct === true}
      <UserMessage message="Yes, the results were correct." />
    {:else if marked_correct === false}
      <UserMessage message="No, the results were not correct." />
    {/if}
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
  