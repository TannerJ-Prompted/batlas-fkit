<script>
    import { user } from "$lib/firebase";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let loading = true;

    onMount(() => {
        user.subscribe(value => {
            if (value) {
                loading = false;
            }
        });
    });
</script>

<style>
    .loading-screen {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        background-color: var(--batlas-black);
        z-index: 9999;
        transition: opacity 0.3s ease;
    }

    h1 {
        color: var(--batlas-white);
        font-size: 2rem;
    }

    .fade-in {
        opacity: 1;
    }

    .fade-out {
        opacity: 0;
    }
</style>
{#if loading}
    <div class="loading-screen" in:fade out:fade>
        <h1>Loading...</h1>
    </div>
{/if}
<slot />