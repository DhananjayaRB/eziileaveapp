import { atom } from "recoil";

export interface User {
  orgId: string;
  userId: string;
  role: string;
  email: string;
  token: string;
}

export const userAtom = atom<User | null>({
  key: "userAtom",
  default: null,
});
