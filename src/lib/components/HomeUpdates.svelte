<script lang="ts">

    import type { PageData } from '../../routes/(app)/dashboard/$types';
        import { createAlert, userFeedback } from "$lib/dashboardState";
    import { db, user } from "$lib/firebase";
    import { collection, query, orderBy, limit, getDocs, doc, setDoc } from "firebase/firestore";
    import { submitFeedback } from '$lib/firebaseFunctions';
  import { onMount } from 'svelte';
  import Divider from './Divider.svelte';
  
  let mostRecentPoll = {options: []};
  let chosenPollOption = null;

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
  
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  }

  return null;
}

async function checkUserVote() {
    if (mostRecentPoll && mostRecentPoll.id) {
        const pollVotesRef = collection(db, 'polls', mostRecentPoll.id, 'votes');
        const querySnapshot = await getDocs(pollVotesRef);
        const userVote = querySnapshot.docs.find(doc => doc.id === $user?.uid)?.data();
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

export let data: PageData;

</script>

<style>
    .updates {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 1rem;
        width: 100%;
    }

    .feedbackForm {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .feedbackForm textarea {
      width: 100%;
      background-color: var(--batlas-white);
      border: 0.1rem solid var(--batlas-black);
      padding: 0.5rem;
      border-radius: 0.5rem;
    }
    

</style>

        <div class="updates">
            <div class="updateHeader">
            <h2>Latest updates</h2>
            <h5>Launch Version 1.0</h5>
        </div>
            <Divider />
            <div class="updateBody">
              <p>This is the launch version of Batlas 🎉</p>
              <p>Thanks for jumping on the band wagon so early and being willing to give your two cents to make this tool as good as it can be.</p>
              <p>There will undoubtedly be bugs and I'll be working to iron them out but the main thing I'd love at this point is user feedback. I can't think of everything after all.</p>
              <p>There's a poll below with a few things I want to add and you can help prioritise them by voting. You can also submit whatever comments you have here:</p>
              <h3>Feedback:</h3>
              <form class="feedbackForm" on:submit={submitFeedback($user, $userFeedback)}>
                <textarea rows="4" cols="50" bind:value={$userFeedback}></textarea>
                <button class="button blackButton">Submit</button>
              </form>
            </div>
    </div>

