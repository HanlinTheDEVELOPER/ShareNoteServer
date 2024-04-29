import { SavedNotes } from "../models/savedNotes.js";

const isNoteSaved = async (userId, noteSlug) => {
  const savedNotesByUser = await SavedNotes.findOne({ userId }).populate({
    path: "savedNotes",
    select: "slug",
  });

  const isSaved = !!savedNotesByUser?.savedNotes.find(
    (note) => note.slug === noteSlug
  );
  return isSaved;
};
export default isNoteSaved;
