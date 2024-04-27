<script lang="ts">
    import type { PageData } from './$types';
        import { premiumUser } from "$lib/dashboardState";
        import { screenChoice } from "$lib/dashboardState";
    import RulesCategory from '$lib/components/RulesCategory.svelte';
    import RulesContent from '$lib/components/RulesContent.svelte';
    import { rules } from '$lib/rules';
    import { onMount } from 'svelte';
    import { activeRule } from '$lib/dashboardState';
    import RulesExamplesList from '$lib/components/RulesExamplesList.svelte';
    
    export let data: PageData;


</script>

<style>
    .dashboardContainer {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        gap: 1rem;
        padding: 1rem;
    }

    .column {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0.5rem;
        max-height: calc(100lvh - 2rem);
    }

    .exampleColumn {
        padding: 0rem;
    }

    .scrollColumn {
        padding: 0rem;
    }

    .scrollColumn div {
        height: 100%;
        width: 100%;
        overflow-y: scroll;
        padding: 1rem;
    }

    .categoryColumn {
        overflow-y: visible;
    }

</style>

<div class="dashboardContainer">
    <div class="thirdsColumn column categoryColumn">
            {#each rules as category}
                <RulesCategory {category}/>
            {/each}
    </div>
    <div class="blackBox thirdsColumn column scrollColumn">
        <div class="subcategories">
            <RulesContent rule={$activeRule}/>
        </div>
    </div>
    {#if $activeRule.content !== ""}
    <div class="blackBox thirdsColumn column scrollColumn">
        <div class="examples">
            <RulesExamplesList rule={$activeRule}/>
        </div>
    </div>
    {/if}
</div>
