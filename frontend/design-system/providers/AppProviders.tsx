"use client";

import { ScrollRecovery } from "@/components/layout/ScrollRecovery";
import { DevServiceWorkerCleanup } from "@/components/dev/DevServiceWorkerCleanup";
import { AppSplash } from "@/components/pwa/AppSplash";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
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
      <InstallPrompt />
      <IosInstallHint />
      {children}
      <ToastContainer />
    </>
  );
}
