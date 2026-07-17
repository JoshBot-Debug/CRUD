import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export default {
  hash: async (plainText: string) => {
    if (!process.env.PASSWORD_HASH_LENGTH) throw new Error("Please set a PASSWORD_HASH_LENGTH");
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(
      plainText,
      salt,
      parseInt(process.env.PASSWORD_HASH_LENGTH as string)
    ).toString("hex");
    return `${salt}.${hash}`;
  },

  compair: async (plainText: string, encrypted: string) => {
    if (!process.env.PASSWORD_HASH_LENGTH) throw new Error("Please set a PASSWORD_HASH_LENGTH");

    const [salt, hash] = encrypted.split(".");
    const hashedBuffer = scryptSync(
      plainText,
      salt,
      parseInt(process.env.PASSWORD_HASH_LENGTH as string)
    );

    const originalBuffer = Buffer.from(hash, "hex");

    return timingSafeEqual(hashedBuffer, originalBuffer);
  }
}