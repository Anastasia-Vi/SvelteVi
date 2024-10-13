<script>
    import { particleAnimation } from '$lib/animation';
</script>

<canvas use:particleAnimation></canvas>

<style>
    canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        pointer-events: none;
    }

</style>
