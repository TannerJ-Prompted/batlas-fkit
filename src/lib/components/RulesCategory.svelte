<script>
    import { currentAdventure } from "$lib/adventureData";
    import { activeRule, screenChoice, activeRuleCategory } from "$lib/dashboardState";
    import Subsection from "./Subsection.svelte";

    $activeRule
    $currentAdventure
    export let category;
    export let i;


    function handleCategoryClick(){
        activeRuleCategory.set(category.title);
    }

</script>

<style>

    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 3rem;
        cursor: pointer;
        transition: background-color 0.15s ease-out;
    }

    .subsectionsContainer {
        width: 100%;
        overflow: hidden;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
        gap: 0.5rem;
        max-height: 0rem;
        transition: max-height 1s ease-out;
        will-change: max-height;
    }

    .categoryButton.active {
        background: var(--batlas-white);
        color: var(--batlas-black);
    }

    .subsectionsContainer.active {
        max-height: 100rem;
    }


</style>
<a class="categoryButton button blackButton" on:click={handleCategoryClick} class:active={$activeRuleCategory === category.title}>
    <p>{category.title}</p>
</a>
<div class="subsectionsContainer" class:active={$activeRuleCategory === category.title}>
    {#each category.subsections as subsection}
        <Subsection {subsection} />
    {/each}
</div>



