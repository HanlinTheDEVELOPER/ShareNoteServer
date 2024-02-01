import Note from "../models/note.js";

export const data = [
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
  {
    title: "title",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae autem molestias reiciendis rem explicabo nemo numquam, eius distinctio ullam! Earum repellat fuga excepturi nemo praesentium a sequi incidunt suscipit quisquam!",

    sender: "6592f4178993c81cf2752400",
  },
];

export function seeds() {
  const notes = data.map(async (note) => {
    const newNote = await Note.create(note);
    return newNote;
  });
}
