<script lang="ts">
    import Divider from '$lib/components/Divider.svelte';
</script>

<style>

    .tutorial {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 1em;
        width: 100%;
    }

    .tutorialRow {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 1rem;
        width: 100%;
        flex-wrap: wrap;
    }

    .tutorialRow h3 {
        font-size: 1.25rem;
        font-weight: 600;
        width: 33%;
    }

    .tutorialRow p {
        min-width: 16rem;
        width: calc(100% - 33% - 1rem);
        margin: 0em;
    }        
</style>

<div class="tutorial">
            <h2>How to use Batlas</h2>
            <Divider />
            <div class="tutorialRow">
                <h3>Adventures:</h3>
                <p>Edit or play your saved adventures.</p>
            </div>
            <div class="tutorialRow">
                <h3>Create:</h3>
                <p>Create new adventures using the map editor.</p>
            </div>
            <div class="tutorialRow">
                <h3>Dungeons:</h3>
                <p>Pre-made adventures for you to use in any game system.</p>
            </div>
            <div class="tutorialRow">
                <h3>Batlas RPG:</h3>
                <p>A rules-light fantasy role playing game for you to try.</p>
            </div>
            <div class="tutorialRow">
                <h3>Account:</h3>
                <p>Manage your account settings and preferences.</p>
            </div>
        </div>

