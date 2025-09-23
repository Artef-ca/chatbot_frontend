<script lang="ts">
  import FavoritesBar from "../FavoritesBar.svelte";
  import ReportBar from "./ReportBar.svelte";
  import ReportGenerator from "./ReportGenerator.svelte";
</script>

<div class="relative h-screen w-full">
  <div
    class=""
    style="overflow-y: scroll;
      height: 45rem;"
  >
    <div class="main">
      <FavoritesBar></FavoritesBar>
      <ReportGenerator></ReportGenerator>
      <ReportBar></ReportBar>
    </div>
  </div>
</div>

<style>
  .main {
    display: flex;
    flex-direction: row;
    background: #002638b5;
    /* background: var(--primary); */
  }
</style>
