import fs from "fs";
import path from "path";

export const readFile = (filePath) => {
  return fs.promises.readFile(filePath, "utf8");
};

export const writeFile = (filePath, content) => {
  return fs.promises.writeFile(filePath, content, "utf8");
};

export const deleteFile = (filePath) => {
  return fs.promises.unlink(filePath);
};

export const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};