import slugify from "slugify";

export function generateSlug(title: string) {
  return slugify(title, {
    lower: true, // Convert the string to lowercase
    strict: true, // Remove special characters
    remove: /[*+~.()'"!:@]/g, // Remove characters that could cause issues
  });
}
