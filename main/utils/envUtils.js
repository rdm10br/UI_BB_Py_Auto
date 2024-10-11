import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file if it exists
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

// Function to get the value of an environment variable
export const getEnvVariable = (key) => {
  return process.env[key] || null;
};

// Function to set or update an environment variable
export const setEnvVariable = (key, value) => {
  process.env[key] = value;

  // Update the .env file
  const envFileContent = fs.readFileSync(envPath, "utf-8");
  const envVariables = envFileContent.split("\n").filter((line) => line.trim());

  const keyIndex = envVariables.findIndex((line) => line.startsWith(`${key}=`));

  if (keyIndex !== -1) {
    // If the key already exists, update it
    envVariables[keyIndex] = `${key}=${value}`;
  } else {
    // If the key doesn't exist, add it
    envVariables.push(`${key}=${value}`);
  }

  fs.writeFileSync(envPath, envVariables.join("\n"));
};

// Function to delete an environment variable
export const deleteEnvVariable = (key) => {
  delete process.env[key];

  // Update the .env file
  const envFileContent = fs.readFileSync(envPath, "utf-8");
  const envVariables = envFileContent.split("\n").filter((line) => line.trim());

  const updatedEnvVariables = envVariables.filter((line) => !line.startsWith(`${key}=`));

  fs.writeFileSync(envPath, updatedEnvVariables.join("\n"));
};