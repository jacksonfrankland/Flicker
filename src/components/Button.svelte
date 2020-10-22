<script>
    export let styles = '';
</script>

<button on:click class="bg-blue-600 text-sm rounded-md p-2 text-white font-medium w-full {styles}">
    <slot />
</button>
