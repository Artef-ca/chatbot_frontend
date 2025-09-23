<script lang="ts">
  import ReportItem from "./ReportItem.svelte";
</script>

<div class="main">
  <div class="title">Reports</div>
  <div class="items">
    <ReportItem></ReportItem>
    <ReportItem></ReportItem>
    <ReportItem></ReportItem>
  </div>
  <button style="border-radius:0.5rem;">New Report</button>
</div>

<style>
  .main {
    min-width: 13rem;
    max-width: 15rem;
    background: var(--primary-light);
    height: 90vh;
    margin: 0.5rem;
    border-radius: 1rem;
    padding-bottom: 1rem;
  }
  .title {
    padding: 0.5rem;
    padding-left: 1rem;
    font-weight: 500;
    font-size: 1.2rem;
    color: var(--text-color);
  }
  .items {
    padding: 1rem;
    overflow: scroll;
    height: 83%;
    overflow-x: hidden;
  }
  button {
    color: var(--text-color);
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
    background-color: var(--primary);
    margin: auto;
    display: block;
    font-size: 0.8rem;
  }
</style>
