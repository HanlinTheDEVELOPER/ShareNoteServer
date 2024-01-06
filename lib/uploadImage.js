import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

import getCurrentDateTime from "../lib/getCurrentDateTime.js";
import { errorResponse } from "./response.js";

const uploadImage = async (req, res) => {
  const storage = getStorage();
  const metadata = {
    contentType: req.file.mimetype,
  };
  try {
    const dateTime = getCurrentDateTime();
    const storageRef = ref(
      storage,
      `avatar/${req.file.originalname}_${dateTime}`
    );

    // 'file' comes from the Blob or File API
    const uploadTask = await uploadBytes(storageRef, req.file.buffer, metadata);

    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        )
      );
  }
};

export default uploadImage;
