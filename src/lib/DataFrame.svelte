<script lang="ts">
  import DownloadButton from "./DownloadButton.svelte";

  export let id: string;
  export let df; // Expected to be a JSON string or already parsed as an array

  // Reactive variable for parsed data
  let data: Array<Record<string, any>> = [];
  let columns: string[] = [];
  const headers = ["Name", "Age", "Email"];
  function convertToCSV(data: Array<Record<string, any>>, headers: string[]) {
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(","));

    // Add rows
    for (const row of data) {
      csvRows.push(Object.values(row).join(","));
    }

    return csvRows.join("\n");
  }
  function downloadCSV() {
    const csvContent = convertToCSV(data, headers);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a link element
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Parse and validate the input `df`
  $: {
    try {
      data = typeof df === "string" ? JSON.parse(df) : df; // Parse if `df` is a string
      if (Array.isArray(data) && data.length > 0) {
        columns = Object.keys(data[0]); // Extract column names from the first record
      } else {
        columns = [];
        console.warn("Data is not a valid array or is empty.");
      }
    } catch (error) {
      console.error("Error parsing dataframe:", error);
      data = [];
      columns = [];
    }
  }
</script>

<!-- Render the dynamic table -->
<div
  class="border rounded-xl shadow-sm overflow-hidden bg-slate-900 border-gray-700"
>
  <div class="-m-1.5 overflow-x-auto">
    <div class="p-1.5 min-w-full inline-block align-middle">
      <table class="min-w-full divide-y divide-gray-700">
        <thead class="bg-gray-50" style="background: var(--primary-dark);">
          <tr>
            {#each columns as column}
              <th scope="col" class="px-6 py-3 text-left">
                <div class="flex items-center gap-x-2">
                  <span
                    class="text-xs font-semibold uppercase tracking-wide text-white"
                  >
                    {column}
                  </span>
                </div>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody
          class="divide-y divide-gray-700"
          style="background: var(--primary);"
        >
          {#each data as row}
            <tr>
              {#each columns as column}
                <td class="h-px w-px whitespace-nowrap">
                  <div class="px-6 py-3">
                    <span class="text-gray-200">
                      {isNaN(Number(row[column]))
                        ? row[column]
                        : Number(row[column]).toFixed(2)}
                    </span>
                  </div>
                </td>
              {/each}
            </tr>
          {/each}
          {#if data.length >= 10}
            <tr>
              <td colspan={columns.length} class="h-px w-px whitespace-nowrap">
                <div class="px-6 py-3 text-center">
                  <img src="/more.svg" alt="More rows available" />
                </div>
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:click={downloadCSV}
  style="cursor: pointer;     border: solid 1px #374151;
    border-radius: 0.5rem;
}"
>
  <DownloadButton {id} />
</div>
