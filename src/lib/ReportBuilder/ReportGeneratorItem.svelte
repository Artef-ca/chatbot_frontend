<script lang="ts">
  import Markdown from "svelte-exmarkdown";
  import CodeBlock from "../CodeBlock.svelte";
  import Plotly from "../Plotly.svelte";
  import SlowReveal from "../SlowReveal.svelte";
  import Text from "../Text.svelte";
  import DataFrame from "./DataFrame.svelte";

  export let item: any;
  export let index: any;
  export let isGrid: any;
  console.log(isGrid)
  export let removeItem: (index: number) => void;
</script>

<div class="{item.double?'frame':'notFrame'}" style="{item.isGrid==2?'margin-right:-2rem;':''}">
  <div
    style="display: flex;
flex-direction: row;
justify-content: space-between;
margin-left: 2rem;
margin-right: 2rem;
align-items:center;
}"
  >

    <button
      style=" 
        color: var(--text-color);
        height: 1.5rem;
        width: 1.5rem;
        background: var(--primary-dark);
        border-radius: 0.2rem;
        margin-bottom: 0.5rem;
        margin-left: auto;
"
      on:click={() => {
        removeItem(index);
      }}>-</button
    >
  </div>
  <div class="reportItem">
    <div class="question">{item.element.question}</div>

    {#if item.response}
      <div class="response">
        <Text user={false}>
          <Markdown md={item.element.response.replace(/-\s/g, "• ")} />
        </Text>
      </div>
    {/if}
    {#if item.table}
      <DataFrame id={item.element.id} df={item.element.dataframe} double={item.double} />
    {/if}
    <div style="height: 1rem; width:50%"></div>
    {#if item.chart}
      <Plotly fig={item.element.fig} id={item.element.id + index} />
    {/if}

    {#if item.sql}
      <div class="response">
        <Text user={false}>
          <CodeBlock>
            <SlowReveal text={item.element.sql_query} />
          </CodeBlock>
        </Text>
      </div>
    {/if}
  </div>
</div>

<style>
  .reportItem {
    padding: 1rem;
    margin: 2rem;
    margin-top: 0rem;
    background: var(--primary-dark);
    border-radius: 0.5rem;
    min-height: 30rem;
  }
  .response {
    padding: 1rem;
  }
  .question {
    color: var(--text-color);
    padding: 0.5rem;
  }
  .frame {
    flex: 50%;
    
  }
  .notFrame{
    flex: 100%;

  }
</style>
