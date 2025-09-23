<script lang="ts">
  import { onMount } from "svelte";
  import { clickedElement, currentReport, isadding } from "../../Functions.svelte";

  import ReportGeneratorItem from "./ReportGeneratorItem.svelte";
  import { writable } from "svelte/store";
  import { generatePDF } from "../../PdfGen.svelte";

  async function downloadPDF() {
    genPdf = true;
    await generatePDF("pdf-content", "example.pdf");
  }

  let genPdf = false;
  let reportName: string;
  let startDate: Date;
  let endDate: Date;
  let users: string[];
  let frequency: string[];
  let adding: boolean;
  let isSingle: boolean = false;
  let isDouble: boolean = false;
  let isGrid: boolean = true;
  let report: any = [];
  let reportWritable: any = writable([]);
  let counter = 0;
  reportWritable.subscribe((data: any) => {
    data.forEach((item: any, index: number) => {
      report = data;
      // if(isGrid){
      setTimeout(() => {
        let config = {
          plot_bgcolor: "#011c28",
          paper_bgcolor: "#011c28",
          displayModeBar: false,
          modeBarButtonsToRemove: [
            "sendDataToCloud",
            "autoScale2d",
            "hoverClosestCartesian",
            "hoverCompareCartesian",
            "lasso2d",
            "select2d",
          ],
          displaylogo: false,
          showTips: true,
   
          showlegend: false,
          yaxis: {
            title: {
              text: "",
            },
          },
        };
        if (item.double) {
          config = {
            width: 350,
            height: 300,

            plot_bgcolor: "#011c28",
            paper_bgcolor: "#011c28",
          };
        }
        Plotly.relayout(
          document.getElementById(item.element.id + index),
          config
        );
      }, 200);
      // }
    });
  });
  isadding.subscribe((data) => {
    adding = data.enabled;
  });
  clickedElement.subscribe((data) => {
    if (adding) {
      console.log(data);
      // clickedElement.set(null);
      adding = false;
    }
  });

  onMount(() => {
    currentReport.subscribe((data: any) => {
      console.log(data);
      let temp: any[] = [];
      if (data.length > 0) {
        let it = data[data.length - 1];
        temp = data;
        temp.pop();
        it.double = isDouble;
        if (isDouble) {
          it.isGrid = counter;
        }
        temp.push(it);
      }

      reportWritable.set(temp);
      report = temp;

      setTimeout(() => {
        isSingle = false;
        if (isDouble) {
          counter--;
          if (counter == 0) {
            isDouble = false;
          }
        }
      }, 100);
    });
  });

  function removeItem(index: any) {
    console.log(index);
    report.splice(index, 1);
    currentReport.set(report);
    console.log(report);
  }

  //  let favgetAllFavorites()
</script>

<div class="main" id="pdf-content">
  <!-- <button
    on:click={() => {
      isGrid = false;
    }}>List</button
  >
  <button
    on:click={() => {
      isGrid = true;
    }}>2 by 2 Grid</button
  > -->
  <div class="inputs">
    <div class="input">
      <label for="name">Report Name</label>
      <input
        type="text"
        placeholder="Report name"
        id="name"
        bind:value={reportName}
      />
      <p class="forPdf">{reportName}</p>
    </div>

    <div class="input">
      <label for="startDate">Start Date</label>
      <input type="date" placeholder="" id="startDate" bind:value={startDate} />
      <p class="forPdf">{startDate}</p>
    </div>
    <div class="input">
      <label for="endDate">End Date</label>
      <input type="date" placeholder="" id="endDate" bind:value={endDate} />
      <p class="forPdf">{endDate}</p>
    </div>
    <div class="input">
      <label for="list">List of Users</label>
      <div
        style="padding-right: 0.5rem;
      background: var(--primary-light);
      border-radius: 0.5rem;"
      >
        <select name="cars" id="list" bind:value={users} style="margin: 0;">
          <option value="ali.ibrahim@nakheel.com"
            >ali.ibrahim@nakheel.com</option
          >
          <option value="layla.khalid@nakheel.com"
            >layla.khalid@nakheel.com</option
          >
          <option value="omar.abbas@nakheel.com">omar.abbas@nakheel.com</option>
          <option value="noura.ali@nakheel.com">noura.ali@nakheel.com</option>
          <option value="youssef.hassan@nakheel.com"
            >youssef.hassan@nakheel.com</option
          >
        </select>
      </div>
      <p class="forPdf">{users}</p>
    </div>
    <div class="input">
      <label for="frequency">Frequency</label>
      <div
        style="padding-right: 0.5rem;
      background: var(--primary-light);
      border-radius: 0.5rem;"
      >
        <select
          name="cars"
          id="frequency"
          bind:value={frequency}
          style="margin: 0;"
        >
          <option value="Once a day">Once a day</option>
          <option value="Once a week">Once a week</option>
          <option value="Once a Month">Once a Month</option>
          <option value="Every 3 Months">Every 3 Months</option>
        </select>
      </div>
      <p class="forPdf">{frequency}</p>
    </div>
  </div>
  <div
    class="frames"
    style={isGrid
      ? "flex-wrap:wrap; flex-direction:row;"
      : "flex-direction:column;"}
  >
    {#each report as item, index}
      <ReportGeneratorItem {item} {index} {removeItem} isGrid={counter}
      ></ReportGeneratorItem>
    {/each}
    {#if isSingle}
      <div class="addReport" style="flex: 100%;">
        <button
          on:click={() => {
            isadding.set({ enabled: true });
            console.log(adding);
          }}>+</button
        >
      </div>
    {/if}
    {#if isDouble}
      <div class="dbl">
        <div class="addReport" style="flex: 50%;">
          <button
            on:click={() => {
              isadding.set({ enabled: true });
              console.log(adding);
            }}>+</button
          >
        </div>
        {#if counter == 2}
          <div class="addReport" style="flex: 50%;">
            <button
              on:click={() => {
                isadding.set({ enabled: true });
                console.log(adding);
              }}>+</button
            >
          </div>
        {/if}
      </div>
    {/if}
  </div>
  {#if !isSingle && !isDouble}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="selectLayout">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="single"
        on:click={() => {
          isSingle = true;
          counter = 0;
        }}
      >
        <img src="/single.svg" alt="" />
        Single
      </div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="double"
        on:click={() => {
          isDouble = true;
          counter = 2;
        }}
      >
        <img src="/double.svg" alt="" />

        Double
      </div>
    </div>
  {/if}

  <button
    class="downloadPdfBtn"
    on:click={() => {
      downloadPDF();
    }}>Export PDF</button
  >
</div>

<style>
  .downloadPdfBtn {
    margin: auto;
    padding: 1rem;
    font-size: 1rem;
    display: flex;
    color: var(--primary-dark);
    font-weight: 500;
    background: var(--text-color);
  }
  .dbl {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin: auto;
  }
  .selectLayout {
    display: flex;
    flex-direction: row;
  }
  .selectLayout div {
    padding: 3rem;
    width: 50%;
    background-color: var(--primary-dark);
    color: var(--text-color);
    text-align: center;
    transition: 200ms ease;
    border-radius: 0.5rem;
    margin: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .selectLayout img {
    width: 2rem;
    margin-right: 0.5rem;
  }
  .selectLayout div:hover {
    background-color: var(--primary-light);
  }
  .main {
    width: -webkit-fill-available;
    /* background: var(--primary); */
    height: 90vh;
    /* margin: 1rem; */
    /* border-radius: 1rem; */
    padding-bottom: 1rem;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-top: 1rem;
    background-color: var(--primary);
  }
  .inputs {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
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
    padding-top: 5px;
    padding-bottom: 5px;
    margin: 5px 0;
    border: none;
    resize: none;
    height: 2.4rem;
    font-size: 0.8rem;
    color: var(--text-color);
    scrollbar-color: transparent transparent;
    /* margin-left: 10px; */
    border-radius: 0.5rem;
  }
  .addReport {
    padding: 4rem;
  }
  .addReport button {
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    font-size: 1.4rem;
    background: gray;
    color: var(--text-color);
    display: block;
    margin: auto;
    border-radius: 0.5rem;
  }
  .frames {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  button {
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--primary-dark);
    color: var(--text-color);
    font-size: 0.6rem;
    margin: auto;
  }
  .forPdf {
    color: var(--text-color);
    font-weight: 200;
    display: none;
    /* display: flex;
    flex-direction: row; */
  }
  /* .forPdf p{
    padding: 1rem;
  } */
</style>
