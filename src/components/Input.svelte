 <script>
    export let id;
    export let styles = '';
    export let value = '';
    export let placeholder;
 </script>

 <input id={id} class="form-input block w-full sm:text-sm sm:leading-5 {styles}" {placeholder} on:input bind:value />
