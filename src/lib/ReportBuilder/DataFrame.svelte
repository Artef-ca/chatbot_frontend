<script lang="ts">
  export let id: string;
  export let df;
  export let double: boolean = false;
  let data = JSON.parse(df);

  // Extracting column names dynamically from the first record
  let columns = data.length > 0 ? Object.keys(data[0]) : [];
</script>

<!-- Create a dynamic table -->
<div
  class=" border rounded-xl shadow-sm overflow-hidden bg-slate-900 border-gray-700 main {double
    ? 'double'
    : ''}"
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
                    class="text-xs font-semibold uppercase tracking-wide text-gray-200"
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
                    <span class="text-gray-200">{row[column]}</span>
                  </div>
                </td>
              {/each}
            </tr>
          {/each}
          {#if data.length >= 10}
            <tr>
              <td class="h-px w-px whitespace-nowrap">
                <div class="px-6 py-3">
                  <span class="dark:text-gray-200"
                    ><img src="/more.svg" alt="" />
                  </span>
                </div>
              </td>
              <td class="h-px w-px whitespace-nowrap">
                <div class="px-6 py-3">
                  <span class="text-gray-200"> </span>
                </div>
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .main {
    margin: auto;
  }
  .double {
    width: 25vw;
  }
  th,
  tr {
    font-size: 0.7rem;
  }

</style>
