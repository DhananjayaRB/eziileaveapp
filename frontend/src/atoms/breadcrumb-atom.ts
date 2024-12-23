import { atom } from "recoil";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export const breadcrumbState = atom<BreadcrumbItem[]>({
  key: "breadcrumbState",
  default: [{ name: "Leave Management", href: "/" }],
});
