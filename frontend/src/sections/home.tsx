"use client";

import { settingsAtom } from "@/atoms/settings-atom";
import { userAtom } from "@/atoms/user-atom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { NotSetup } from "./not-setup";
import { EmployeeHome } from "./employee-home";

export function HomePage() {
  const [user] = useRecoilState(userAtom);
  const settings = useRecoilValue(settingsAtom);
  const [loading, setLoading] = useState(false);
  const userRole = user?.role || "";
  const router = useRouter();

  useEffect(() => {
    if (
      settings.orgId &&
      userRole === "admin" &&
      parseInt(settings.setupPercentage) < 100
    ) {
      router.push("/setup");
    }
  }, [userRole, settings.orgId, router]);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const tokens = localStorage.getItem("resolve-tokens");
      if (!tokens) return;

      const { token } = JSON.parse(tokens);
      const response = await fetch("https://qa-api.resolveindia.com/leave/api/organisation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to create organisation");
      window.location.reload();
    } catch (error: any) {
      console.error("Error setting up organisation:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!settings.orgId) {
    return <NotSetup handleSetup={handleSetup} loading={loading} />;
  }

  if (userRole === "employee") {
    return <EmployeeHome />;
  }

  if (userRole === "admin") {
    console.log("admin");
  }

  return <>fallback</>;
}
