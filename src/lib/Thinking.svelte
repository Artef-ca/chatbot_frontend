<script lang="ts">
    import Text from "./Text.svelte";


</script>

<li class="max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4">
    <img src="/groqlogo.png" class="flex-shrink-0 w-[4rem]
     animate-bounce "    style="object-fit:cover; height:auto; background-size: cover; -webkit-background-size: cover;"
     alt="agent logo" >
    
    <div class="space-y-3">
        <Text user={false}>
            Is thinking...
        </Text>
    </div>
</li>  