// import DataUriParser from "datauri/parser.js";
// import path from "path";

// const parser = new DataUriParser();

// const getDataUri = (file) => {
//   const extName = path.extname(file.originalname).toString();
//   return parser.format(extName, file.buffer).content;
// };

// export default getDataUri;

import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

const getDataUri = (file) => {
  if (!file || !file.buffer) return null; // safety check
  return parser.format(path.extname(file.originalname), file.buffer);
};

export default getDataUri;
