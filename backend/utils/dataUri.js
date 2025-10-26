import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

/**
 * Converts a multer file object to a Data URI string.
 * @param {Object} file - multer file object
 * @returns {string} - Data URI
 */
export const getDataUri = (file) => {
  if (!file || !file.buffer || !file.originalname) {
    throw new Error("Invalid file input");
  }

  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer).content;
};

export default getDataUri;
