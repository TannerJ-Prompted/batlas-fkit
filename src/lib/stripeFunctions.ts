import { createAlert } from "$lib/dashboardState";
import { db, user } from "$lib/firebase";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import { premiumUser } from "$lib/dashboardState";

export async function upgradeToPremium(priceId, user) {
  // Reference to the Firestore document
  const checkoutSessionsRef = collection(
    db,
    "users",
    user.uid,
    "checkout_sessions"
  );

  try {
    // Create a new checkout session in Firestore
    const checkoutSessionRef = await addDoc(checkoutSessionsRef, {
      price: priceId,
      success_url: "https://app.batlas.art/dashboard/",
      cancel_url: "https://batlas.art",
      mode: "payment",
    });

    // Wait for the CheckoutSession to get attached by the extension
    onSnapshot(checkoutSessionRef, (snap) => {
      const data = snap.data();
      if (data) {
        const { error, url } = data;
        if (error) {
          // Show an error to your customer and
          // inspect your Cloud Function logs in the Firebase console.
          alert(`An error occured: ${error.message}`);
        }
        if (url) {
          // We have a Stripe Checkout URL, let's redirect.
          window.location.assign(url);
        }
      }
    });
  } catch (e) {
    console.error("Error creating checkout session", e);
    createAlert("Error creating checkout session");
  }
}

export async function checkPremiumStatus(user) {
  console.log("checking premium status", user.uid);
  // Checks a subscription status for a user
  // console.log("checking premium status", user.uid);
  // const subscriptions = await getDocs(
  //   collection(db, "users", user.uid, "subscriptions")
  // );
  // subscriptions.forEach((doc) => {
  //   let document = doc.data();
  //   console.log(document);
  //   if (document.status === "active") {
  //     premiumUser.set(true);
  //   } else {
  //     premiumUser.set(false);
  //   }
  // });

  // One-time-payment check
  const userQuery = query(
    collection(db, "users", user.uid, "payments"),
    where("id", "==", "pi_3P8AkfJBUqZ2A3eL0n3ZTSzQ")
  );
  const userDocSnap = await getDocs(userQuery);
  userDocSnap.forEach((doc) => {
    let document = doc.data();
    if (document.id === "pi_3P8AkfJBUqZ2A3eL0n3ZTSzQ") {
      premiumUser.set(true);
      console.log("Access");
    } else {
      premiumUser.set(false);
      console.log("No Access");
    }
  });
}
