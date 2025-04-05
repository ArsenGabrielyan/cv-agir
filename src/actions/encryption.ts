"use server"
import crypto from "crypto"

const secretKey = process.env.AES_SECRET!
const encryptionMethod = process.env.AES_ENCRYPTION_METHOD!

const key = crypto.createHash("sha512").update(secretKey).digest("hex").substring(0,32);

export async function encryptData<T extends string>(data: T){
     if(!secretKey || !encryptionMethod){
          throw new Error("Գաղտնագրելու բանալին բացակայում է։")
     }
     if(!data) return "";
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
     if(!data) return "";
     const textParts = data.split(":");
     const ivPart = textParts.shift();
     if (!ivPart) {
          throw new Error("Invalid data: IV part is missing.");
     }
     const iv = Buffer.from(ivPart, "hex");
     const encrypted = Buffer.from(textParts.join(":"),"hex");
     const decipher = crypto.createDecipheriv(
          encryptionMethod,
          Buffer.from(key),
          iv
     );
     let decrypted = decipher.update(encrypted);
     decrypted = Buffer.concat([decrypted,decipher.final()]);
     return decrypted.toString("utf8");
}