import { UserPlan } from "@prisma/client"
import type {DefaultSession} from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  isTwoFactorEnabled: boolean,
  isOauth: boolean,
  jobTitle?: string,
  phone?: string,
  address?: string,
  summary?: string,
  hobbies?: string,
  currentPlan?: UserPlan
}

declare module "next-auth"{
  interface Session{
    user: ExtendedUser
  }
}