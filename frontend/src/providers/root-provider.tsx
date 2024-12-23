"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import { chakraTheme } from "../lib/chakra-config";
import AppProvider from "./app-provider";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={chakraTheme}>
        <AppProvider>{children}</AppProvider>
      </ChakraProvider>
    </RecoilRoot>
  );
}
