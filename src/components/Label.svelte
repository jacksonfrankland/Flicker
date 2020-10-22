<script>
    export let control;
    export let styles = ''
</script>

<label for={control} class="block text-sm font-medium leading-5 text-gray-700 {styles}">
    <slot />
</label>
