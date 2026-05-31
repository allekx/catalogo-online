"use client";

import { ScrollRecovery } from "@/components/layout/ScrollRecovery";
import { DevServiceWorkerCleanup } from "@/components/dev/DevServiceWorkerCleanup";
import { AppSplash } from "@/components/pwa/AppSplash";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { PwaInstallListener } from "@/components/pwa/PwaInstallListener";
import { IosInstallHint } from "@/components/pwa/IosInstallHint";
import { OfflineNotice } from "@/components/pwa/OfflineNotice";
import { ToastContainer } from "../components/Toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollRecovery />
      <DevServiceWorkerCleanup />
      <AppSplash />
      <OfflineNotice />
      <PwaInstallListener />
      <InstallPrompt />
      <IosInstallHint />
      {children}
      <ToastContainer />
    </>
  );
}
