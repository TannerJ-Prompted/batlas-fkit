<script>
    import TileNotesIndicator from '$lib/components/TileNotesIndicator.svelte';
    import CombinedUserControls from '$lib/components/CombinedUserControls.svelte';
    import AdventureNotes from '$lib/components/AdventureNotes.svelte';
    import CombinedTileWindow from '$lib/components/CombinedTileWindow.svelte';
    import { page } from '$app/stores';
    import { activeTile, setActiveTile, currentAdventureChange, activeTileSidebar, adventureNotesDisplayed } from "$lib/dashboardState";
    import { currentAdventure } from "$lib/adventureData";
    import { onDestroy, onMount } from 'svelte';
    import { generateMap } from "$lib/mapGen";
    import {premadeAdventures} from "$lib/adventureData";
    import { db, user } from "$lib/firebase";
  import { saveAdventureToFirebase, setCurrentAdventureFromFirebase } from '$lib/firebaseFunctions';
  import { onSnapshot, doc} from 'firebase/firestore';


  
    export let role;
  
    let mapDisabled = false;
    let guideText = "As you click around helpful text will appear here";
    let dungeonId = $page.params.dungeonId;
    let creatorId = $page.params.creatorId;
    let adventureId = $page.params.adventureId;
    let adventureSnapshot = null;
    let updatedAdventure = null;
    let matchingAdventure = null;


  
    $: $currentAdventure, changeAlert();
  
    onMount(() => {
      console.log("Batlas Map role:", role);
      console.log(adventureId, creatorId, dungeonId, $page.url.href)
      if ($page.url.href.includes("/demo/adventure")) {
        currentAdventure.set(premadeAdventures[0]);
      } else if (role==="demoEditor"){
          currentAdventure.set({
            title: "Demo",
            notes: {
              primer: "A short introduction to the overall idea of the adventure.",
              notes: "More in depth notes about the specifics of the adventure."
            }
          });
          generateMap();
        } else if (role === "player") {
          setCurrentAdventureFromFirebase(creatorId, adventureId);
          const docRef = doc(db, "users", creatorId, "adventures", adventureId);
          const unsubscribe = onSnapshot(docRef, (doc) => {
            console.log("Current data: ", doc.data());
            updatedAdventure = doc.data();
            currentAdventure.set({
            ...updatedAdventure,
            map: JSON.parse(updatedAdventure.map),
            })
            console.log("updated adventure", updatedAdventure);
          });
        } else if (role === "editor" || role === "gameMaster") {
          if (adventureId !== undefined) {
          setCurrentAdventureFromFirebase(creatorId, adventureId);
          } else if (dungeonId !== undefined) {
            let matchingAdventure = premadeAdventures.find(adventure => adventure.dungeonId === dungeonId);
            currentAdventure.set(matchingAdventure);
          }
        }
    });
  
    function changeAlert() {
      currentAdventureChange.set(true);
    }
  
    function updateGuideText(newText) {
      guideText = newText;
    }
  
    function handleTileClick(e, cell, i, j){
      updateGuideText("Click on the tile to change it, or add notes to it.");
      mapDisabled = true;
  
        setActiveTile(cell, i, j)
        activeTileSidebar.set(true);
        adventureNotesDisplayed.set(false);
        let floatingTiles = document.getElementsByClassName("tileFloat");
        for (let i = 0; i < floatingTiles.length; i++) {
          floatingTiles[i].classList.remove("tileFloat");
        }
    }
    
    async function handleFogToggle(e, newAdventure, cell, i, j) {
      newAdventure.map[i][j].fogOfWar = !newAdventure.map[i][j].fogOfWar;
      currentAdventure.set(newAdventure);
      saveAdventureToFirebase($currentAdventure, $user);
    }
  
  </script>
  
  <style>
  
    .mapContainer {
        background-color: var(--batlas-black);
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 2rem;
        align-items: stretch;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        height: 100%;
        width: 100%;
        max-width: 100%;
        position: static;
        overflow-x: scroll;
        max-height: 100lvh;
        min-height: 100lvh;
    }
  
    .map::-webkit-scrollbar {
        color: var(--batlas-black);
        background-color: var(--batlas-black);
    }
  
    .map::-webkit-scrollbar-thumb {
        color: var(--batlas-black);
        background: var(--batlas-black);
        border: 0.1rem solid var(--batlas-white);
    }
  
    .map::-webkit-scrollbar-corner {
        display: none;
    }
  
    .map {
          overflow: visible;
          background-color: var(--batlas-black);
          height: 100%;
          width: 100%;
          max-height: none;
          margin-right: 15rem;
    }
  
  
    .gridTile{
      width: 200px;
      min-width: 200px;
      height: 150px;
      min-height: 150px;
      margin: 0px;
      padding: 0px;
      overflow: visible;
      background-size: cover;
      background-position: bottom ;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      pointer-events: none;
    }
  
    
    .gridTile img {
      width: 100%;
      object-fit: cover;
      object-position: bottom center;
      overflow: visible;
      pointer-events: none;
    }
  
    .gridRow {
      display: flex;
      flex-direction: row;
      padding: 0px;
      margin: 0px;
      margin-top: -100px;
    }
    
    .gridRow:nth-child(1){
      margin-top: 3rem;
    }
    
    .gridRow:nth-last-child(1){
      margin-bottom: 3rem;
    }
    
    .gridRow:nth-child(even){
      transform: translateX(100px);
    }
  
    .tileSelectorHoverDetector {
      height: 75px;
      width: 75px;
      border-radius: 50px;
      position: absolute;
      bottom: 25%;
      pointer-events: auto;
      z-index: 50;
      opacity: 1;
    }
  
    .tileSelectorHoverDetector:hover .tileSelector {
      visibility: visible;
      cursor: pointer;
    }
  
    .tileSelectorHoverDetector + img {
      transition: all 0.3s ease;
    }
  
    .tileSelectorHoverDetector:hover + img, .tileFloat img {
      transform: translate(0em, -0.5rem);
    }
  
    .tileSelector {
      visibility: hidden;
      position: absolute;
      bottom: calc(50% - 38px);
      left: calc(50% - 38px);
      height: 75px;
      width: 75px;
      border: 0rem solid var(--batlas-white);
      background: rgba(0, 0, 0, 0);
      border-radius: 100px;
      pointer-events: auto;
      cursor: pointer;
      z-index: 999;
    }
  
    .dialogueContainer {
      transition: all 0.2s ease-in-out;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      height: 100%;
      width: auto;
      max-width: 20rem;
      position: sticky;
      left: 0rem;
      top: 0rem;
      pointer-events: none;
      gap: 2em;
      padding: 1rem;
      padding-right: 1rem;
      z-index: 100;
    }
  
    :global(.dialogueContainer *) {
      pointer-events: auto;
    }
  
    :global(.notesIndicatorIndex) {
      color: var(--batlas-white);
    }
  
    :global(.masterFoggedTile img) {
      filter: brightness(0.5);
    }
  
    :global(.mapDisabled){
      pointer-events: none;
    }
  
    .emptyMap {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      color: var(--batlas-white);
      font-size: 1.5rem;
      padding: 2rem;
      border-radius: 1rem;
      background-color: var(--batlas-black);
      height: 100%;
      width: 80%;
    }
  
    @media(max-width:735px){
  
      .mapContainer {
        height: 100%;
        width: 100%;
        margin: 0em;
        flex-direction: column;
        margin-bottom: 5rem;

      }

      .mapContainer::-webkit-scrollbar {
        display:none;
      }
  
      .map {
        width: 100%;
        margin: 0rem;
        padding: 0rem;
        padding-top: 10rem;
        min-height: 100%;
      }



      .dialogueContainer {
          width: 100%;
          max-width: none;
          height: 100%;
          top: 0rem;
          bottom: 1rem;
          left: 0rem;
          position: fixed;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          padding: 1rem;
      }
  
      .emptyMap {
        margin: 0em;
        padding: 2rem;
        border-radius: 0em;
        max-height: 100%;
        max-width: 100%;
        font-size: 1rem;
        justify-content: flex-start;
      }
    }
  
  </style>
  
  <div class="mapContainer">
  
    <div class="dialogueContainer">
      {#if $user !== null && role !== "player" || role==="demoEditor"}
      <CombinedUserControls guideText={guideText} updateGuideText={updateGuideText} {role}/>
      {/if}
        <AdventureNotes {role} />
      {#if $activeTile.rowIndex !== null}
      <CombinedTileWindow handleFogToggle={handleFogToggle} tileOptions={true} {role}/>
      {/if}
    </div>
    <div class="map" id="mapScreenshot"> 
      {#if $currentAdventure.map.length === 0 && $currentAdventure.map.title === "" && role==="editor"}
      <div class="emptyMap" >
        <p>Hit 'random map' until you get a starting point that looks good to you. Then click the tiles to alter them and add notes. Happy dungeon delving!</p>
      </div>
    {/if}  
        {#each $currentAdventure.map as row, i}
            <div class="gridRow">
                {#each row as cell, j}
                  <div class="gridTile" style="background-image: {cell.chosenTile?.img}; position: relative; bottom: 0em;" class:masterFoggedTile = {cell.fogOfWar} class:playerFoggedTile = {cell.fogOfWar && role === "player"}>
                    {#if role==="gameMaster" || role==="editor" || role==="demoEditor"}
                      {#if cell.tileNotes != "" || cell.interestPoints.length > 0 || cell.tileTitle != ""}
                        <TileNotesIndicator/>
                      {/if}
                    {/if}
                    {#if role !== "player"}
                      <div class="tileSelectorHoverDetector">
                        <div
                          on:click={(e) => handleTileClick(e, cell, i, j)}
                          class="tileSelector"
                          class:disabledHoverSelector = {mapDisabled}
                          on:keydown={(e) => handleTileClick(e, cell, i, j)}
                          role="button"
                          tabindex="0">
                        </div>
                      </div>
                    {/if}
                    {#if
                      cell.chosenTile?.img === "/tiles/dungeon/roomBlank.webp" && role === "player" ||
                      cell.chosenTile?.img === "/tiles/dungeon/roomBlank.webp" && role === "gameMaster"
                      }
                      <img src="/img/tiles/dungeon/roomBlankPlay.webp" alt="{cell.chosenTile?.img}">
                    {:else}
                      <img src="/img{cell.chosenTile?.img}" alt="{cell.chosenTile?.img}">
                    {/if}
                  </div>
                {/each}
            </div>
        {/each}
      </div>
  </div>
  
  