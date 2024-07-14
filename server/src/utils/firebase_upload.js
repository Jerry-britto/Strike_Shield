import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import uuid4 from "uuid4";
import fs from "fs"

initializeApp({
  apiKey: "AIzaSyAEEgrqKqahjV-6u0bPfLr-jW2N4f3OWXE",
  authDomain: "ecomm-ead9f.firebaseapp.com",
  projectId: "ecomm-ead9f",
  storageBucket: "ecomm-ead9f.appspot.com",
  messagingSenderId: "357664437025",
  appId: "1:357664437025:web:8bab11f75b37d84f514460",
  measurementId: "G-NQ2Z45B3BG",
});

const storage = getStorage();

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
    fs.unlinkSync(localPath);
    
    return downloadUrl;
  } catch (error) {
    console.log("Error occured due to ", error);
    fs.unlinkSync(localPath);
  }
};
