<script lang='ts'>
    export let user:boolean
</script>
<p  style="white-space:pre-wrap; color:white;" class:user={user}>
    <slot />
</p>
<style>
    .user{
        color: white !important;
        /* color: var(--text-color); */
    }
    
   
</style>