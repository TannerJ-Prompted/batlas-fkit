<script>
    import { currentAdventure } from "$lib/adventureData";
    import { activeRule, screenChoice } from "$lib/dashboardState";

    $activeRule
    $currentAdventure
    export let subsection

    function setActive(e) {
        document.querySelectorAll('.subsection').forEach((element) => {
            element.classList.remove("brutalismBorderInverted");
        });
        e.target.closest('a').classList.toggle("brutalismBorderInverted");
        screenChoice.set("rulesContent");
    }

    function handleCategoryClick(event, categoryChoice){
        setActive(event);
        activeRule.set(categoryChoice);
    }

    function handleRuleChoice(){
        activeRule.set(subsection);
    }

</script>

<style>

.subsection {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 90%;
    height: 3rem;
    cursor: pointer;
    transition: background-color 0.15s ease-out;
    padding: 0.5rem;
    color: var(--batlas-white);
}

.subsection.active {
    background: var(--batlas-white);
    color: var(--batlas-black);
}
</style>
    <p class="subsection blackBox" on:click={handleRuleChoice} class:active={$activeRule.title === subsection.title}>{subsection.title}</p>

