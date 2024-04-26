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
  console.log("checking premium status", user);
  const userQuery = query(collection(db, "users", user.uid, "payments"));
  const userDocSnap = await getDocs(userQuery);
  userDocSnap.forEach((doc) => {
    let document = doc.data();
    let items = document.items;
    items?.forEach((item) => {
      console.log(item.price.id);
      if (item.price.id === "price_1P89xRJBUqZ2A3eLPTvNu6df") {
        premiumUser.set(true);
        console.log("Access");
      } else {
        premiumUser.set(false);
        console.log("No Access");
      }
    });
  });
}
