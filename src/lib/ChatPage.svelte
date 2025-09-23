<script lang="ts">
  import type { Agent, MessageContents, MessageResponse } from "./types";
  import UserMessage from "./UserMessage.svelte";
  import AgentResponse from "./AgentResponse.svelte";
  import Text from "./Text.svelte";
  import InChatButton from "./InChatButton.svelte";
  import Banner from "./Banner.svelte";
  import Plotly from "./Plotly.svelte";
  import Thinking from "./Thinking.svelte";
  import GreenButton from "./GreenButton.svelte";
  import Error from "./Error.svelte";
  import SqlInput from "./SqlInput.svelte";
  import BotFullResponse from "./BotFullResponse.svelte";
  import NewLanding from "./newLanding.svelte";
  import NewTextInput from "./newTextInput.svelte";
  import NewTitle from "./newTitle.svelte";
  import BotAudienceResponse from "./BotAudienceResponse.svelte";
  import BotAudienceTextResponse from "./BotAudienceTextResponse.svelte";
  import { messageLogWritable } from "../Functions.svelte";
  import { question_asked_writable, started_writable } from "../chatFunctions.svelte";

  export let messageLog: MessageContents[];
  export let newQuestion: (question: string) => void;
  export let editMessage: (index: number, message: string) => void;
  export let generateFollowUpQuestions: (question: MessageContents) => void;
  export let generateChart: (question: MessageContents) => void;
  export let generateSummary: (question: MessageContents) => void;
  export let addMessage: (msg: MessageResponse) => void;
  export let clearMessages: () => void;
  export let onUpdateSql: (sql: string) => void;
  export let question_asked: boolean;
  export let marked_correct: boolean | null;
  export let thinking: boolean;
  export let started: boolean = false;
  export let agents: Agent[];
  export let agent: Agent;
  export let abort: () => void;

  let toggledSql: boolean[] = [false];
  let toggledChart: boolean[] = [false];
  let toggledDF: boolean[] = [false];
  let showFavoriteModal: boolean;

  messageLogWritable.subscribe((data) => {
    console.log(data);
    messageLog = data;
  });
  question_asked_writable.subscribe(data=>{
    console.log('q',data)
    question_asked=data
  })
  started_writable.subscribe(data=>{
    started=data
  })

  function startChat(agent: { type: string; message: string; title: string; img: string; intro: string }) {
    console.log(agent);
    if (agent && agent.intro !== "") {
      started_writable.set(true)
      // started = true;
      const msg: MessageResponse = {
        data: { type: "bot_msg", message: agent.intro },
        state: true,
      };
      question_asked = true;
    }
  }

  function startChatFromTextBox(question: string) {
    // started = true;
    started_writable.set(true)

    newQuestion(question);
  }

  $: agent, startChat(agent);
  $: messageLog, console.log("TEST", messageLog);

  function toggleChart(i: number) {
    toggledChart = [...toggledChart];
    toggledChart[i] = !toggledChart[i];
  }

  function toggleSql(i: number) {
    toggledSql = [...toggledSql];
    toggledSql[i] = !toggledSql[i];
  }

  function toggleDF(i: number) {
    toggledDF = [...toggledDF];
    toggledDF[i] = !toggledDF[i];
  }
</script>

<div class="relative h-screen w-full">
  <div class="chat {!started ? 'inherit' : 'main'}" id="chatWindow">
    {#if !started}
      <div class="center">
        <NewTitle {started} />
        <NewLanding />
        <NewTextInput onSubmit={startChatFromTextBox} {thinking} {abort} />
        {#if !question_asked}
          <Banner bind:agent {agents} {newQuestion} {addMessage} {startChatFromTextBox} />
        {/if}
      </div>
    {/if}

    <ul class="space-y-5" id="chatWindowMessages">
      {#each messageLog as message, index}
        {#if message.type === "user_question"}
          <UserMessage
            message={message.question}
            id={index}
            {newQuestion}
            {editMessage}
            {thinking}
            {messageLog}
          />
        {:else if message.type === "string"}
          <AgentResponse>
            <Text user={false}>{message.response}</Text>
          </AgentResponse>
        {:else if message.type === "text"}
          <AgentResponse>
            <Text user={false}>{message.text}</Text>
          </AgentResponse>
        {:else if message.type === "bot_msg"}
          <AgentResponse>{message.message}</AgentResponse>
        {:else if message.type === "audience_bot_msg"}
          <BotAudienceResponse {message}>{message.response}</BotAudienceResponse>
        {:else if message.type === "audience"}
          <BotAudienceTextResponse {message} />
        {:else if message.type === "plotly_figure"}
          <AgentResponse {message}>
            <Plotly fig={message.fig} />
          </AgentResponse>
        {:else if message.type === "success"}
          <BotFullResponse
            {generateFollowUpQuestions}
            {generateSummary}
            {generateChart}
            {toggleChart}
            {toggleSql}
            {toggleDF}
            {toggledChart}
            {toggledSql}
            {index}
            {message}
            {marked_correct}
            isCache={false}
          />
          {#if marked_correct === true}
            <UserMessage
              message="Yes, the results were correct."
              id={index}
              {newQuestion}
              {editMessage}
            />
          {:else if marked_correct === false}
            <UserMessage
              message="No, the results were not correct."
              id={index}
              {newQuestion}
              {editMessage}
            />
          {/if}
        {:else if message.type === "error"}
          <AgentResponse>
            {#if message.error === "AbortError: signal is aborted without reason"}
              <Text user={false}>Request was cancelled.</Text>
            {:else}
              <Error message={message.error} />
            {/if}
          </AgentResponse>
        {:else if message.type === "question_cache"}
          <BotFullResponse
            {generateFollowUpQuestions}
            {generateSummary}
            {generateChart}
            {toggleChart}
            {toggleSql}
            {toggleDF}
            {toggledChart}
            {toggledDF}
            {toggledSql}
            {index}
            {message}
            {marked_correct}
            isCache={true}
            bind:showFavoriteModal
          />
        {:else if message.type === "user_sql"}
          <UserMessage
            message="Put your SQL here"
            id={index}
            {newQuestion}
            {editMessage}
          >
            <SqlInput onSubmit={onUpdateSql} />
          </UserMessage>
        {:else if message.type === "follow_up_btn"}
          <AgentResponse>
            <InChatButton
              message="Generate Follow up Questions"
              isGenerate={true}
              onSubmit={() => generateFollowUpQuestions(messageLog[index - 1])}
            />
          </AgentResponse>
        {:else}
          <AgentResponse>
            <Text user={false}>{JSON.stringify(message)}</Text>
          </AgentResponse>
        {/if}
      {/each}

      {#if thinking && started}
        <Thinking />
      {/if}
    </ul>
  </div>

  {#if started}
    <NewTextInput
      onSubmit={startChatFromTextBox}
      {thinking}
      {abort}
      {newQuestion}
      {addMessage}
    />
  {/if}

  <footer class="max-w-4xl mx-auto sticky bottom-0 z-10 p-3 sm:py-6 ftr">
    {#if question_asked}
      {#each messageLog as msg}
        {#if msg.type === "question_cache"}
          <GreenButton
            message="Re-Run"
            onSubmit={() =>
              msg.type === "question_cache" ? newQuestion(msg.question) : undefined
            }
          />
        {/if}
      {/each}
    {/if}
    <div style="display: flex; justify-content: center">
      <div class="disclaimer">
        Conversational Chatbot may display inaccurate info, including about people, so double-check its responses.
      </div>
    </div>
  </footer>
</div>

<style>
  .chat {
    overflow: scroll;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }
  .inherit {
    height: inherit;
  }
  .main {
    height: 72%;
  }
  @media screen and (max-width: 1081px) {
    .main {
      height: 69%;
    }
  }
  @media screen and (max-width: 952px) {
    .main {
      height: 65%;
    }
  }
  ::-webkit-scrollbar {
    width: 10px;
    padding: 0.2rem;
  }
  ::-webkit-scrollbar-track {
    background: var(--primary-dark);
    border-radius: 3rem;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--primary-light);
    border-radius: 3rem;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  .ftr {
    display: flex;
    flex-direction: column;
    position: sticky;
    width: 100%;
    height: 2rem;
    padding: 0;
  }
  .disclaimer {
    position: absolute;
    margin-left: auto;
    display: flex;
    color: var(--text-color);
    font-weight: 100;
    font-size: 0.7rem;
    text-align: center;
    justify-content: center;
    height: 2rem;
    align-items: center;
  }
  .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 77%;
  }
</style>
