import { atom } from "recoil";

export interface Setting {
  id: number;
  createdBy: {
    id: string;
    name?: string;
  };
  compOff: { id: number; isEnabled: boolean; variantCount: number };
  pto: { id: number; isEnabled: boolean; variantCount: number };
  orgId: string;
  effectiveDate: string | null;
  setupPercentage: string;
}

export const settingsAtom = atom<Setting>({
  key: "settingsAtom",
  default: {
    id: 0,
    createdBy: {
      id: "",
    },
    compOff: { id: 0, isEnabled: false, variantCount: 0 },
    pto: { id: 0, isEnabled: false, variantCount: 0 },
    orgId: "",
    effectiveDate: null,
    setupPercentage: "0",
  },
});
