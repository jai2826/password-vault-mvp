// lib/crypto.ts
import CryptoJS from 'crypto-js';

// --- Configuration ---
const KEY_SIZE = 256 / 32; // AES 256
const ITERATIONS = 1000;  // PBKDF2 iterations (higher is more secure, but slower)

// --- Types ---
interface PlaintextData {
  title: string;
  username: string;
  password?: string;
  url: string;
  notes: string;
}

interface EncryptedVaultPayload {
  cipherText: string;
  salt: string;
  iv: string;
}


// 1. Key Derivation Function (KDF)
// Safely derives a strong, fixed-size key from the user's variable-length Master Password.
const deriveKey = (masterPassword: string, salt: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray => {
    return CryptoJS.PBKDF2(masterPassword, salt, {
        keySize: KEY_SIZE,
        iterations: ITERATIONS
    });
};


// 2. Encryption Function
export const encryptItem = (
    data: PlaintextData, 
    masterPassword: string
): EncryptedVaultPayload => {
    // 1. Convert plaintext object to a string
    const plaintext = JSON.stringify(data);

    // 2. Generate unique Salt and IV (Initialization Vector) for this entry
    const salt = CryptoJS.lib.WordArray.random(128 / 8); // 128-bit salt
    const iv = CryptoJS.lib.WordArray.random(128 / 8);  // 128-bit IV

    // 3. Derive key using the Master Password and the new Salt
    const key = deriveKey(masterPassword, salt);

    // 4. Encrypt the data using AES
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC, // CBC mode is common with PBKDF2
        padding: CryptoJS.pad.Pkcs7
    });

    // 5. Package the result for storage (Ciphertext, Salt, IV)
    return {
        cipherText: encrypted.toString(), // The encrypted data
        salt: salt.toString(CryptoJS.enc.Base64),
        iv: iv.toString(CryptoJS.enc.Base64),
    };
};


// 3. Decryption Function
export const decryptItem = (
    encryptedPayload: EncryptedVaultPayload, 
    masterPassword: string
): PlaintextData | null => {
    try {
        // 1. Parse the stored Salt and IV from Base64
        const salt = CryptoJS.enc.Base64.parse(encryptedPayload.salt);
        const iv = CryptoJS.enc.Base64.parse(encryptedPayload.iv);

        // 2. Re-derive the key using the Master Password and the stored Salt
        const key = deriveKey(masterPassword, salt);

        // 3. Decrypt the Ciphertext
        const decrypted = CryptoJS.AES.decrypt(encryptedPayload.cipherText, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        // 4. Convert the WordArray result back to a string
        const plaintextStr = decrypted.toString(CryptoJS.enc.Utf8);
        
        // 5. Handle empty or invalid decryption (Common if the key is wrong)
        if (!plaintextStr) {
            console.error("Decryption failed: Empty string result.");
            return null;
        }

        return JSON.parse(plaintextStr) as PlaintextData;

    } catch (error) {
        // This catch handles JSON parsing errors or corrupted data
        console.error("Error during decryption process:", error);
        return null;
    }
};