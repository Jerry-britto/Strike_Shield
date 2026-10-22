import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import uuid4 from "uuid4";
import fs from "fs"

initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID,
});

const storage = getStorage();

// Second call throws if the temp file is already gone (e.g. upload failed
// before the file existed, or cleanup raced) — never let cleanup mask the
// real error.
const cleanupTempFile = (p) => {
  try {
    if (p && fs.existsSync(p)) fs.unlinkSync(p);
  } catch {
    /* best-effort cleanup */
  }
};

export const uploadToFirebase = async (localPath, type) => {
  try {
    if (!localPath || !type) return null;

    const storageRef = ref(storage, `coverImage/${localPath}` + uuid4());

    const metaData = {
      contentType: type,
    };

    const snapShot = await uploadBytes(storageRef, localPath, metaData);

    const downloadUrl = await getDownloadURL(snapShot.ref);
    console.log(`Your downoload url ${downloadUrl}`);
    cleanupTempFile(localPath);

    return downloadUrl;
  } catch (error) {
    console.log("Error occured due to ", error);
    cleanupTempFile(localPath);
  }
};
