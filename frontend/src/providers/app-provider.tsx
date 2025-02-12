"use client";

import { settingsAtom } from "@/atoms/settings-atom";
import { User, userAtom } from "@/atoms/user-atom";
import SidebarWithHeader from "@/components/navigation";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import useSWR from "swr";
import { NotAuthenticated } from "./not-authenticated";
import { Skeleton } from "@chakra-ui/react";

const fetcher = async (url: string) => {
  const tokens = localStorage.getItem("resolve-tokens");
  if (!tokens) throw new Error("No auth token");

  const { token } = JSON.parse(tokens);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) throw new Error(data.error || "Failed to fetch");
  return data;
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<User | null>(null);
  const [user, setUser] = useRecoilState(userAtom);

  const [s, setSettingAtom] = useRecoilState(settingsAtom);
  const {
    data: organisation,
    isLoading,
    error,
  } = useSWR("https://qa-api.resolveindia.com/leave/api/organisation", fetcher);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("resolve-tokens") ||
      sessionStorage.getItem("resolve-tokens");
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(JSON.parse(storedToken));
      setUser(JSON.parse(storedToken));

      setCookie("resolve-tokens", storedToken);
    }
  }, []);

  useEffect(() => {
    if (organisation) {
      setSettingAtom({
        id: organisation.id,
        effectiveDate: organisation.effectiveDate,
        setupPercentage: organisation.setupPercentage,
        createdBy: organisation.createdBy,
        compOff: organisation.compOff,
        pto: organisation.pto,
        orgId: organisation.orgId,
      });
      toast.success("Organisation loaded", {
        description: `Organisation #${organisation.orgId} data loaded`,
      });
    } else if (organisation === null) {
      setSettingAtom({
        id: 0,
        createdBy: {
          id: "",
        },
        compOff: { id: 0, isEnabled: false, variantCount: 0 },
        pto: { id: 0, isEnabled: false, variantCount: 0 },
        orgId: "",
        effectiveDate: null,
        setupPercentage: "0",
      });
    }
  }, [organisation, setSettingAtom]);

  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton height="95%" width="95%" borderRadius="md" />
      </div>
    );

  return <SidebarWithHeader>{children}</SidebarWithHeader>;
}
