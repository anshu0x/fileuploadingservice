import path, { resolve } from "path";
import fs from "fs/promises"; // Import the 'fs/promises' module

export let file_upload_location = path.join(resolve(),"/public/images");

// Function to check if a directory exists and create it if not
export async function ensureDirectoryExists() {
    try {
      await fs.access(file_upload_location, fs.constants.F_OK); // Check if it exists
    } catch (error) {
      // If the directory doesn't exist, create it
      await fs.mkdir(file_upload_location, { recursive: true });
    }
  }
  