// src/store/useSimplePasswordStore.ts
import { create } from "zustand";

// Define the shape of your state and actions
interface PasswordStore {
  // State: Holds the generated password string
  generatedStrongPassword: string;

  // Action: A function to update the password
  setMainPassword: (password: string) => void;
}

// Create the Zustand store
export const usePasswordStore = create<PasswordStore>((set) => ({
  // Initial State
  generatedStrongPassword: "",

  // Action: Simple setter function
  setMainPassword: (password) => set({ generatedStrongPassword: password }),
}));
