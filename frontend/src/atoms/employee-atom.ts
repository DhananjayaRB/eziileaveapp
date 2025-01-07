import { atom } from "recoil";

interface EmployeeLeaveDetails {
  user_id: string;
  leaves: {
    id: number;
    name: string;
    variants: { id: number; name: string }[];
  }[];
  ptoVariants: { id: number; name: string }[];
  compoffVariants: { id: number; name: string }[];
}

export const employeeLeaveDetailsAtom = atom<EmployeeLeaveDetails>({
  key: "employeeLeaveDetailsAtom",
  default: {
    user_id: "",
    leaves: [],
    ptoVariants: [],
    compoffVariants: [],
  },
});
