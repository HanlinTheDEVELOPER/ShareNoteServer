import { getStorage, ref, deleteObject } from "firebase/storage";

export const deleteImage = async (img) => {
  const storage = getStorage();

  // Create a reference to the file to delete
  const desertRef = ref(storage, img);

  // Delete the file
  deleteObject(desertRef)
    .then(() => {
      console.log("delete image successfully");
    })
    .catch((error) => {
      console.log("delete image error", error);
    });
};
