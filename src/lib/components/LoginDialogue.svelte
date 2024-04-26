<script lang="ts">
  import { db, userData, auth, user } from "$lib/firebase";
  import { doc, getDoc, writeBatch, deleteDoc, collection, addDoc, onSnapshot, setDoc } from "firebase/firestore";

  import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, deleteUser, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";
    import { error } from "@sveltejs/kit";
    import { currentAdventure } from "$lib/adventureData";
    import { screenChoice, createAlert, currentAdventureChange, premiumUser } from "$lib/dashboardState";
  import { onMount, onDestroy } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import { checkPremiumStatus, upgradeToPremium } from "$lib/stripeFunctions";
  import Divider from "./Divider.svelte";


  let disabledSave = false;
  let premium = false;


  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);

    const idToken = await credential.user.getIdToken();

    const res = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'CSRF-Token': csrfToken  // HANDLED by sveltekit automatically
      },
      body: JSON.stringify({ idToken }),
    });
    createUserDoc().then(() => {
      upgradeToPremium('price_1P89xRJBUqZ2A3eLPTvNu6df', $user)
      // window.location.href = "/dashboard/play/";
    });
  }

  async function signOutSSR() {
    const res = await fetch("/api/signin", { method: "DELETE" });
    await signOut(auth);
  }

  async function createUserDoc() {
    console.log("creating doc");
    const batch = writeBatch(db);
    batch.set(doc(db, "users", $user!.uid), {
      published: true
    });

    await batch.commit();
  }

  async function promptForCredentials() {
    const credential = prompt(
      "Please enter your password to confirm account deletion."
    );
    return credential;
  }

  async function deleteThisUser(thisUser) {
        let userRef = doc(db, "users", thisUser.uid);
        let userSnap = await getDoc(userRef);
        let deleteId = userSnap.id;
        console.log(deleteId, userSnap.data())

        deleteDoc(userRef)
        .then(() => {
            console.log("User successfully deleted!");
            signOutSSR();
        }).catch((error) => {
            console.error("Error removing user: ", error);
        });
    }

  async function handleDeleteUser(thisUser) {
      try {
        await deleteThisUser(thisUser);
      } catch {
        console.log (error)
      } finally {
        createAlert(`Your account has been deleted`)
      }
    }

    let interval;

    onMount(() => {
      setTimeout(() => {
        checkPremiumStatus($user);
      interval = setInterval(() => {
        if ($user && $premiumUser===true && window.location.pathname.includes("/demo/map-maker/")) {
          saveAdventureToFirebase($currentAdventure, $user);
        } else if ($user && $premiumUser===true) {
          window.location.href = "/dashboard";
        } else if ($user) {
          upgradeToPremium('price_1P89xRJBUqZ2A3eLPTvNu6df', $user)
        }
      }, 1000);
    }, 1000);
  });


    onDestroy(() => {
      clearInterval(interval);
    });



    let legalToggle = false;

    function alignLegalToggle() {
      let currentLegalToggle = document.getElementById('legalToggleCheckbox');
      legalToggle = currentLegalToggle.checked;
    }

    async function saveAdventureToFirebase(currentAdventure) {
    console.log("saveAdventureToFirebase fired", currentAdventure);

    disabledSave = true;

    const adventuresRef = collection(db, "users", $user.uid, "adventures");

    if (currentAdventure.title === "") {
      createAlert("Please enter a title for your adventure.");
      return;
    }

    if (currentAdventure.adventureId === "") {
      let uniqueId = uuidv4();
      currentAdventure.adventureId = uniqueId;
      console.log("saving new adventure to firebase", currentAdventure);
      const adventureRef = doc(adventuresRef, currentAdventure.adventureId);
      await setDoc(adventureRef, {
        ...currentAdventure,
        map : JSON.stringify(currentAdventure.map)
      });
      createAlert(`${currentAdventure.title} saved!`)
      setTimeout(() => {
          disabledSave = false;
        }, 3000);      
    } else {
      console.log("updating new adventure to firebase", currentAdventure);
      const adventureRef = doc(adventuresRef, currentAdventure.adventureId);
      let newUpdateDate = Date.now();
      await setDoc(adventureRef, {
        ...currentAdventure,
        map : JSON.stringify(currentAdventure.map),
        updatedDate: newUpdateDate
      });
      createAlert(`${currentAdventure.title} updated!`)
      if (window.location.pathname.includes("/demo/map-maker")) {
      window.location.href = "/dashboard/play/";
      }
      setTimeout(() => {
          disabledSave = false;
        }, 3000); 
    }    
    currentAdventureChange.set(false);
  }

</script>

<style>

  a:hover {
    cursor: pointer;
    text-decoration: underline;
  }


  .loginBox {
    padding: 3rem;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 30em;
    color: var(--batlas-white);
  }

  .loginBox a {
    transition: all 0.3 ease;
    margin-top: 1rem;
    font-family: 'Poppins', sans-serif;
    border: 0.1rem solid var(--batlas-white);
    border-radius: 0.6rem;
    font-size: 1rem;
    font-weight: 400;
    background-color: var(--batlas-black);
    padding: 0.5rem 1rem;
    color: var(--batlas-white);
  }

  .loginBox a:hover {
    cursor: pointer;
    background-color: var(--batlas-white);
    color: var(--batlas-black);
  }

  .loginBox h2 {
    color: var(--batlas-white)
  }

  .loginBox p {
    text-align: center;
    color: var(--batlas-white);
  }

  label {
    font-size: 1rem;
    text-align: center;
    margin-top: 3rem;
    color: var(--batlas-white);
  }

  a.simpleLink {
    border: none;
    text-decoration: underline;
    background-color: transparent;
    color: var(--batlas-white);
    padding: 0rem;
    text-align: center;
  }

  a.simpleLink:hover {
    cursor: pointer;
    color: var(--batlas-white);
    background-color: transparent;
  }

  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  .legal {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    margin-top: 1em;
  }

  .legalLabel {
    font-size: 0.8rem;
    text-align: center;
    margin-top: 0rem;
    color: var(--batlas-white);
  }

  .legalLabel a {
    font-size: 0.8rem;;
  }

  .blackBox {
    text-align: center;
    border: none;
  }

  .legals {
    font-size: 0.8rem;
    margin-top: 1rem;
    opacity: 0.5;
  }

  .legals a {
    font-size: 0.8rem;
    border: 0;
    background: none;
    padding: 0;
    text-decoration: underline;
  }

  .legals a:hover{
    border: 0;
    background: none;
    padding: 0;
    color: var(--batlas-white)
  }

  .info {
    font-size: 1.6rem;
    margin-top: 2rem;
  }

  h4 {
    font-size: 1rem;
  }

  .loginBox .button {
    margin-top: 2rem;
  }

  .loginBox img {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .nonPremium {
    font-size: 1rem;
    opacity: 0.6;
    margin-bottom: 2rem;
  }

  .simpleLink {
    font-size: 0.8rem;
  }

</style>

<div class=" loginBox blackBox">
      {#if $user && premium===true}
        <h4>Welcome, {$user.displayName}</h4>
        <p class="info">You will be redirected to your dashboard.</p>
        <a class="button blackButton" href="/dashboard" >If you aren't redirected, click here</a>
      {:else if $user && premium===false}
        <h4 class="nonPremium">Thanks for making an account,<br> {$user.displayName}</h4>
        <Divider color="white" />
        <p class="info">You'll be redirected shortly to a Stripe checkout page to finish signing up!</p>
        <img src="/img/warrior.webp" alt="Upgrade to Premium" width="300px" height="auto" />
        <Divider color="white" />
        <p class="button blackButton" on:click={() => upgradeToPremium('price_1P89xRJBUqZ2A3eLPTvNu6df', $user)
      } >If you aren't redirected, click here</p>
      {:else}
        <h2>Enter the dungeon</h2>
        <a class:disabled={!legalToggle} on:click={signInWithGoogle}>Log in / Sign up through Google</a>
        <div class="legal">
          <input name="legal" type="checkbox" id="legalToggleCheckbox" on:change={alignLegalToggle}>
          <label class="legalLabel" for="legal">I agree to the Batlas <a class="simpleLink" href="/legalities" target="_blank">Terms & Conditions, Privacy Policy, and Cyber Security Policy.</a></label>
        </div>
        {/if}
        <p class="legals">By signing up or logging in you agree to the Batlas <a href="https://batlas.art/terms-and-conditions" target="_blank">Terms & Conditions</a>, <a href="https://batlas.art/privacy-policy" target="_blank">Privacy Policy</a>, and <a href="https://batlas.art/privacy-policy" target="_blank">Cyber Security Policy</a>.</p>
    </div>

