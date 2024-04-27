<script>
      import { screenChoice } from '$lib/dashboardState';
      import { currentAdventure } from '$lib/adventureData';
      import { activeRule } from '$lib/dashboardState';

      $currentAdventure;
      $activeRule
      $screenChoice

      export let rule;
  
  
      function stringToHTML(str) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(str, 'text/html');
          let subsectionContent = doc.body;
          return subsectionContent;
      };

  
  </script>
  
  <style>

    h3, :global(.exampleContent h3) {
        font-size: 1.5rem;
        margin-top: 2rem;
    }

    .exampleContainer {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0rem;
        width: 100%;
        height: 100%;
        color: var(--batlas-white);
    }

    .exampleContainer:not(:first-child) {
        margin-top: 4rem;
    }

    .exampleContent {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0rem;
        width: 100%;
        height: 100%;
        color: var(--batlas-white);
    }

  </style>

{#if rule.examples}
{#each rule.examples as example, i}
    <div class="exampleContainer">
        <div class="title">
            <h2>{example.title}</h2>
        </div>
        <div class="subtitle">
            <h3>{example.subtitle}</h3>
        </div>
        <div class="subsection">
            <div class="exampleContent" id="exampleContainer{i}">
                {@html example.content}
            </div>
        </div>
    </div>
{/each}
{/if}
  