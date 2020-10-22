<script>
  import { scale } from 'svelte/transition';

  export let transition = false;
</script>

<div in:scale={{duration: transition ? 400 : 0}} class="container m-auto bg-white overflow-hidden shadow rounded-lg">
  <div class="px-4 py-5 sm:p-6 ">
    <slot />
  </div>
</div>
