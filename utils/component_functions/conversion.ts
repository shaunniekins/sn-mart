// Function to convert a URL-friendly string back to the original category name
export const convertUrlFriendlyCategory = (urlFriendlyCategory: string) => {
  return urlFriendlyCategory
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Function to convert a category name to a URL-friendly string
export const convertToUrlFriendly = (categoryName: string): string => {
  if (!categoryName) return "";
  return categoryName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single one
};
