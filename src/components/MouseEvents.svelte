<script>
    export let element;
    import Vector from '../game/Vector.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function mouseEvent (e, event) {
        dispatch(event, new Vector((e.pageX - element.getBoundingClientRect().left) / elementSize(), (e.pageY - element.getBoundingClientRect().top) / elementSize()));
    }

    function touchEvent (e, event) {
        dispatch(event, new Vector((e.touches[0].pageX - element.getBoundingClientRect().left) / elementSize(), (e.touches[0].pageY - element.getBoundingClientRect().top) / elementSize()));
    }

    function elementSize () {
        return Math.min(element.clientWidth, element.clientHeight);
    }
</script>

<svelte:body
    on:click={e => {mouseEvent(e, 'click')}}
    on:mousedown={e => {mouseEvent(e, 'mouseDown')}}
    on:mousemove={e => {mouseEvent(e, 'mouseMove')}}
    on:mouseup={() => {dispatch('mouseUp')}}
    on:touchstart|passive={e => {touchEvent(e, 'mouseDown')}}
    on:touchmove|passive={e => {touchEvent(e, 'mouseMove')}}
    on:touchend|passive={() => {dispatch('mouseUp')}}
    on:gesturestart|preventDefault={() => {}}
/>

