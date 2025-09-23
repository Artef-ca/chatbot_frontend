<script lang="ts">
  import { onMount } from "svelte";

  export let fig: string;
  let figJson = JSON.parse(fig);

  // Generate a unique ID for the chart div
  export let id =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  let chartDiv;

  onMount(() => {
    console.log("Chart ID:", id);
    Plotly.newPlot(chartDiv, figJson, { responsive: true });

    // Append a button to open in a new tab
    const newTabButton = document.createElement("button");
    newTabButton.innerText = "Open in New Tab";
    newTabButton.style.position = "absolute";
    newTabButton.style.top = "10px";
    newTabButton.style.right = "10px";
    newTabButton.style.zIndex = "1000";
    newTabButton.style.color = 'gray'
    newTabButton.onclick = openInNewTab;

    chartDiv.appendChild(newTabButton);
  });

  function openInNewTab() {
    const newWindow = window.open("", "_blank");

    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Fullscreen Plotly Chart</title>
            <style>
              html, body {
                margin: 0;
                padding: 0;
                width: 100vw;
                height: 100vh;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              #plotly-chart {
                width: 100vw;
                height: 100vh;
              }
            </style>
          </head>
          <body>
            <div id="plotly-chart"></div>
          </body>
        </html>
      `);
      newWindow.document.close();

      // Inject Plotly script dynamically
      const plotlyScript = newWindow.document.createElement("script");
      plotlyScript.src = "https://cdn.plot.ly/plotly-latest.min.js";
      plotlyScript.onload = () => {
        // Inject script to render the chart
        const renderScript = newWindow.document.createElement("script");
        renderScript.textContent = `
          const figJson = ${JSON.stringify(figJson)};
          Plotly.newPlot("plotly-chart", figJson, { responsive: true }).then(() => {
            Plotly.relayout("plotly-chart", { width: window.innerWidth, height: window.innerHeight });
          });
          window.addEventListener("resize", () => {
            Plotly.relayout("plotly-chart", { width: window.innerWidth, height: window.innerHeight });
          });
        `;
        newWindow.document.body.appendChild(renderScript);
      };
      newWindow.document.head.appendChild(plotlyScript);
    } else {
      alert("Popup blocked! Please allow popups for this site.");
    }
  }
</script>

<style>
  .chart-container {
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 500px;
  }
</style>

<div bind:this={chartDiv} {id} class="chart-container"></div>
