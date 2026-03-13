import { customAlphabet } from "nanoid";

// Safe alphabet: no ambiguous characters (0/O, l/1)
const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
const nanoid = customAlphabet(alphabet, 6);

export function generatePortraitId(): string {
  return nanoid();
}
