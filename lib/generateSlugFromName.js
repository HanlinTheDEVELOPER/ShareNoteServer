import User from "../models/user.js"; // Assuming you have a User model

export default async function generateUniqueSlug(username) {
  let slug = generateSlug(username);
  let userWithSlug = await User.findOne({ slug });

  let counter = 1;
  while (userWithSlug) {
    slug = generateSlug(username) + counter;
    userWithSlug = await User.findOne({ slug });
    counter++;
  }

  return slug;
}

function generateSlug(username) {
  /* /[aeiou\s]/gi 
  is a regular expression that 
  matches any vowel ([aeiou]) or whitespace (\s) 
  globally (g) and case-insensitively (i).
 */
  let slug = username.replace(/[aeiou\s]/gi, "");
  slug += Math.random().toString().slice(1, 7); // Appending a random 6-digit number
  return slug;
}
