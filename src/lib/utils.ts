import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";
import { SECRET_KEY } from "@/lib/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const encryptData = (data: string) => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  return ciphertext;
};

export const decryptData = (ciphertext: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedJsonString = bytes.toString(CryptoJS.enc.Utf8);

    // Check if decryption failed (often returns empty string or throws error if key is wrong)
    if (!decryptedJsonString) {
      console.error("Decryption failed: Empty result. Check the secret key.");
      return null;
    }
    const originalData: string = JSON.parse(decryptedJsonString);

    return originalData;
  } catch (error) {
    console.error("Error during decryption:", error);
    return null;
  }
};
