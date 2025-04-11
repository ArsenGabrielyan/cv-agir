"use server"
import crypto from "crypto"
import { env } from "@/lib/env"

const secretKey = env.AES_SECRET
const encryptionMethod = env.AES_ENCRYPTION_METHOD

const key = crypto.createHash("sha512").update(secretKey).digest("hex").substring(0,32);

export async function encryptData<T extends string>(data: T){
     if (typeof data !== "string") {
          throw new Error("Գաղտնագրելու տվյալները պետք է լինի վավերական տեքստ։");
     }
     if (!data) return "";
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv(
          encryptionMethod,
          Buffer.from(key),
          iv
     );
     let encrypted = cipher.update(data,"utf8");
     encrypted = Buffer.concat([encrypted,cipher.final()]);
     return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export async function decryptData<T extends string>(data: T){
     if (typeof data !== "string") {
          throw new Error("Գաղտնագրելու տվյալները պետք է լինի վավերական տեքստ։");
     }
     if (!data) return "";
     
     const textParts = data.split(":");
     const ivPart = textParts.shift();
     if (!ivPart) {
          throw new Error("Գաղտնագրելու ինչ-որ մաս բացակայում է։");
     }
     
     const iv = Buffer.from(ivPart, "hex");
     const encryptedText = textParts.join(":");
     if (!encryptedText) {
          throw new Error("Այսպիսի գաղտնագրված տվյալ գոյություն չունի։");
     }
     
     const encryptedBuffer = Buffer.from(encryptedText, "hex");
     const decipher = crypto.createDecipheriv(encryptionMethod, Buffer.from(key), iv);
     let decrypted = decipher.update(encryptedBuffer);
     decrypted = Buffer.concat([decrypted, decipher.final()]);
     return decrypted.toString("utf8");
}