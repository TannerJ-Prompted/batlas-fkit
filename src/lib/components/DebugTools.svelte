<script>
    import CombinedMap from "$lib/components/CombinedMap.svelte";
    import html2canvas from 'html2canvas';
    import { currentAdventure } from "$lib/adventureData";
  import { onMount } from "svelte";
  import { generateMap, map } from "$lib/mapGen";
  import { generateMultiplePrompts, monster, offensiveQuirk, defensiveQuirk, vowelCheck } from "$lib/promptGen";




async function createSocialImage() {
    for (let i = 0; i < 5; i++) {
            await generateMap().then(async () => {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                    await mapScreenshot().then(async () => {
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                        await downloadImage();
                    });
            });
    }
}

    async function mapScreenshot() {
        if(document.querySelector("#currentScreenshot")) {
            document.querySelector("#currentScreenshot").remove();
        }
        html2canvas(document.querySelector("#mapScreenshot"), {
            backgroundColor: "#101010",
            ignoreElements: (element) => element.classList.contains("tileNotesIndicator"),
            x: -30,
        }).then(canvas => {
            let imgURL = canvas.toDataURL("image/png");
            // let win = window.open();
            // win.document.write('<img src="' + imgURL + '"/>');
            let img = document.createElement("img");
            img.src = imgURL;
            img.id = "currentScreenshot";
            img.style.width = "calc(100% + 100px)";
            img.style.objectPosition = "left center";
            img.style.objectFit = "cover";
            img.style.transform = "translateX(-15px)";
            img.style.height = "auto";
            document.querySelector("#mapScreenshotContainer").appendChild(img);
        });
    }

    function downloadImage() {
        const squareContainer = document.querySelector("#squareContainer");
        html2canvas(squareContainer).then(canvas => {
            let imgURL = canvas.toDataURL("image/png");
            let link = document.createElement("a");
            link.href = imgURL;
            link.download = "screenshot.png";
            link.click();
        });
    }

    function insertPrefix(word) {
        if(word[0].match(/[aeiou]/i)) {
            return `an `;
        } else {
            return `a `;
        }
    }

    function createPrompts() {
        generateMultiplePrompts(['monster', 'offensiveQuirk', 'defensiveQuirk']);
        console.log($monster, $offensiveQuirk, $defensiveQuirk);
        let monsterPrompt = `Home to ${insertPrefix($monster.description[0])} ${$monster.description} with ${$offensiveQuirk.description} and ${$defensiveQuirk.description}.`;
        document.querySelector(".enemyPrompt").innerText = monsterPrompt;
    }

    onMount(() => {
        createSocialImage();
    });
  </script>

<style>
      .mapColumn {
          grid-column: 1/18;
          grid-row: 1/3;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          max-width: 100%;
      }

      
    .debugTools {
        position: fixed;
        top: auto;
        bottom: 0;
        right: 0;
        z-index: 999;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 100%;
        gap: 1rem;
    }

    .debugButtons {
        max-width: 15rem;
    }

    .overlay {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        color: white;
        font-size: 2rem;
        font-weight: bold;
    }

    #squareContainer {
        width: 100vh;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        right: 0;
        background-color: var(--batlas-black);
        overflow: hidden;
    }

    #squareContainer .logo {
        color: white;
        font-size: 6rem;
        font-weight: 800;
        position: absolute;
        top: 0rem;
        left: 1rem;
        z-index: 9999;

    }

    #squareContainer .slogan {
        color: white;
        font-size: 2.12rem;
        font-weight: 400;
        position: absolute;
        top: 6rem;
        left: 1.1rem;
        z-index: 9999;
    }

    #squareContainer .enemyPrompt {
        color: white;
        font-size: 3rem;
        font-weight: 400;
        font-family: var(--batlas-font);
        position: absolute;
        line-height: 3.2rem;
        bottom: 0.5rem;
        left: 0.5rem;
        padding-left: 2rem;
        border-left: 0.2rem solid var(--batlas-white);
        text-align: left;
        margin: 0;
        text-transform: uppercase;
    }

    #mapScreenshotContainer {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

  
      @media (max-width: 700px){
          .mapColumn {
          margin: 0em;
          }
      }
  
  </style>

    <div class="debugTools">
        <div class="debugButtons">
            <p class="button blackButton" on:click={() => console.log($currentAdventure)}>Current Adventure</p>
            <p class="button blackButton" on:click={createSocialImage}>Image Screenshot</p>
        </div>
    </div>

