import { atom } from "recoil";

export const setupStepState = atom({
  key: "setupStepState",
  default: { id: 0, label: "Setup" },
});
