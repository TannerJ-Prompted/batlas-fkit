import { currentAdventureChange, userFeedback } from "$lib/dashboardState";
import { db, user } from "$lib/firebase";
import { doc, setDoc, collection, deleteDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { createAlert } from "$lib/dashboardState";

export let disabledSave = false;

export async function saveAdventureToFirebase(currentAdventure, user) {
  console.log("saveAdventureToFirebase fired", currentAdventure);

  const adventuresRef = collection(db, "users", user.uid, "adventures");

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
      map: JSON.stringify(currentAdventure.map),
    });
    createAlert(`${currentAdventure.title} saved!`);
    setTimeout(() => {
      disabledSave = false;
    }, 3000);
  } else {
    console.log("updating new adventure to firebase", currentAdventure);
    const adventureRef = doc(adventuresRef, currentAdventure.adventureId);
    let newUpdateDate = Date.now();
    await setDoc(adventureRef, {
      ...currentAdventure,
      map: JSON.stringify(currentAdventure.map),
      updatedDate: newUpdateDate,
    });
    createAlert(`${currentAdventure.title} updated!`);
    setTimeout(() => {
      disabledSave = false;
    }, 3000);
  }
  currentAdventureChange.set(false);
}

export async function savePremadeAdventureToAccount(currentAdventure, user) {
  console.log("saveAdventureToFirebase fired", currentAdventure);

  const adventuresRef = collection(db, "users", user.uid, "adventures");

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
      map: JSON.stringify(currentAdventure.map),
    });
    createAlert(`${currentAdventure.title} saved!`);
    setTimeout(() => {
      disabledSave = false;
    }, 3000);
  } else {
    console.log("updating new adventure to firebase", currentAdventure);
    const adventureRef = doc(adventuresRef, currentAdventure.adventureId);
    let newUpdateDate = Date.now();
    await setDoc(adventureRef, {
      ...currentAdventure,
      map: JSON.stringify(currentAdventure.map),
      updatedDate: newUpdateDate,
    });
    createAlert(`${currentAdventure.title} updated!`);
    setTimeout(() => {
      disabledSave = false;
    }, 3000);
  }
  currentAdventureChange.set(false);
}

export async function saveNewAdventureToFirebase(newAdventure, user) {
  disabledSave = true;

  const adventuresRef = collection(db, "users", user.uid, "adventures");

  if (newAdventure.title === "") {
    createAlert("Please enter a title for your adventure.");
    return;
  }

  let uniqueId = uuidv4();
  let newUpdateDate = Date.now();

  newAdventure.updatedDate = newUpdateDate;

  newAdventure.adventureId = uniqueId;
  const adventureRef = doc(adventuresRef, newAdventure.adventureId);
  await setDoc(adventureRef, {
    ...newAdventure,
    map: JSON.stringify(newAdventure.map),
  });

  window.location.href = `/dashboard/create/${user?.uid}/${newAdventure.adventureId}`;
}

export async function deleteAdventure(adventure, user) {
  console.log("deleteAdventure fired", adventure, user.uid);
  try {
    let adventureRef = doc(
      db,
      "users",
      user.uid,
      "adventures",
      adventure.adventureId
    );
    await deleteDoc(adventureRef).then(() => {
      createAlert(`${adventure.title} deleted!`);
    });
  } catch (error) {}
}

export async function setCurrentAdventureFromFirebase(creatorId, adventureId) {
  const adventureRef = doc(db, "users", creatorId, "adventures", adventureId);
  const adventureSnapshot = await getDoc(adventureRef);
  let returnedAdventure = {};
  if (adventureSnapshot.exists()) {
    const adventureData = adventureSnapshot.data();
    returnedAdventure = {
      ...adventureData,
      map: JSON.parse(adventureData.map),
    };
  } else {
    console.log("Adventure document does not exist");
  }
  return returnedAdventure;
}

export async function submitFeedback(user, newFeedback) {
  const feedbackRef = collection(db, "feedback");
  const feedbackDoc = doc(feedbackRef, user.uid);
  const feedbackSnapshot = await getDoc(feedbackDoc);
  const feedbackData = feedbackSnapshot.data();
  if (feedbackData !== undefined) {
    console.log("feedbackData exists", feedbackData);
    await setDoc(feedbackDoc, {
      feedback: [...feedbackData.feedback, newFeedback],
    });
  } else {
    console.log("feedbackData does not exist");
    await setDoc(feedbackDoc, {
      feedback: [newFeedback],
    });
  }
  userFeedback.set("");
  createAlert("Feedback submitted! Thank you!");
}
