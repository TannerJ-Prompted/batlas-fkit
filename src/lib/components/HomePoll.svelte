<script lang="ts">
  import Divider from '$lib/components/Divider.svelte';


    import type { PageData } from '../../routes/(app)/dashboard/$types';
        import { screenChoice, offScreenMenu, activeRule, activeTile, premiumUser, createAlert } from "$lib/dashboardState";
    import { db, userData, auth, user, app } from "$lib/firebase";
    import { collection, query, orderBy, limit, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
  import { onMount } from 'svelte';
  
  let mostRecentPoll = {options: []};
  let chosenPollOption = null;
  let freePollAnswer = "";
  let freePollAnswered = false;

  $: userVoted = null;

  const pollsCollection = collection(db, 'polls');




  onMount(async () => {
    mostRecentPoll = await getMostRecentPoll();
    let userVoteData = await checkUserVote();
    console.log(userVoteData);
    userVoted = userVoteData ? userVoteData.option : null;
    chosenPollOption = userVoted;
    console.log(userVoted);
});




async function getMostRecentPoll() {
    const q = query(pollsCollection, orderBy('startDate', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    const recentPoll = querySnapshot.docs[0].data();
    return recentPoll;
}

async function checkUserVote() {
    if (mostRecentPoll && mostRecentPoll.id) {
        const pollVotesRef = collection(db, 'polls', mostRecentPoll.id, 'votes');
        const querySnapshot = await getDocs(pollVotesRef);
        const userVote = querySnapshot.docs.find(doc => doc.id === $user?.uid)?.data();
        if(userVote){
            freePollAnswered = true;
        }
        return userVote;
    }
    return false;
}

async function createPollVote(optionChosen, userId) {
    const pollVotesRef = collection(db, 'polls', mostRecentPoll.id, 'votes');
    const vote = doc(pollVotesRef, userId);
      await setDoc(vote, {
        option: optionChosen
      });
      createAlert(`Vote saved!`)
}

async function createFreePollVote(answer, userId) {
    const pollVotesRef = collection(db, 'polls', mostRecentPoll.id, 'votes');
    const vote = doc(pollVotesRef, userId);
      await setDoc(vote, {
        answer: answer
      });
      createAlert(`Vote saved!`)
      freePollAnswered = true;
}

export let data: PageData;

</script>

<style>
    .dashboardContainer {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto auto;
        width: 100%;
        height: 100%;
        max-height: calc(100lvh - 4em);
        gap: 2rem;
        padding: 1rem;
    }

    
    .disabled {
        opacity: 0.5;
        pointer-events: none;
    }

    .votingOptions {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 1em;
        width: 100%;
    }

    .votingOptions .button {
        text-align: left;
    }

    .votingOptions input[type="text"] {
        width: 100%;
        padding: 0.5em;
        border: 0.1rem solid var(--batlas-black);
        background-color: var(--batlas-white);
        border-radius: 0.25em;
    }

    .poll {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 1em;
        width: 100%;
    }



    .whiteButton input, .whiteButton label {
        cursor: pointer;
    }

    .whiteButton input {
        display: none;
    }

    .whiteButton::selection {
        background-color: var(--batlas-black);
        color: var(--batlas-white);
    }

    .whiteButton:hover {
        background-color: var(--batlas-black);
        color: var(--batlas-white);
    }

    .whiteButton:has(input:checked) {
        background-color: var(--batlas-black);
        color: var(--batlas-white);
    }

</style>


<div class="poll">
    <div class="pollHeader">
        <h2>Current Poll</h2>
        <h5>{mostRecentPoll.question}</h5>
    </div>
    <Divider/>
    <form class="votingOptions" on:change|preventDefault={() => createPollVote(chosenPollOption, $user.uid)}>
        {#each mostRecentPoll.options as option, index}
            <div class="button whiteButton">
                <input type="radio" id={`option${index}`} name="votingOption" bind:group={chosenPollOption} value={index}>
                <label for={`option${index}`}>{option}</label>
            </div>
        {/each}
    </form>
</div>