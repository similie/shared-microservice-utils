/**
 * Converts a camel case string to snake case and turns it to lowercase.
 * @param {string} input - The camel case string to be converted.
 * @returns {string} The snake case version of the input string in lowercase.
 */
export const toSnakeCase = (input: string): string => {
  // Convert the camel case to snake case
  const snakeCase = input.replace(/([a-z])([A-Z])/g, "$1_$2");

  // Convert the snake case string to lowercase
  return snakeCase.toLowerCase();
};

export const toCamelCase = (input: string): string => {
  return input
    .split("_")
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

export const deepCloneObject = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const pullCookieValueInBrowser = (key: string) => {
  if (typeof document === "undefined") {
    return null;
  }
  // Add the equals sign to match the key precisely
  const nameEQ = key + "=";
  // Split the cookie string into individual key=value pairs
  const ca = document.cookie.split(";");
  // Loop through the array to find and return the right cookie value
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    // Trim spaces that might be present around the cookie
    while (c.charAt(0) === " ") c = c.substring(1);
    // Check if the cookie string starts with the desired name
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length); // Extract and return the value
  }
  // If not found, return null
  return null;
};
