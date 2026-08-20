"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings/theme");
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center font-mono text-xs text-[var(--text-muted)]">
      Redirecting to Theme & Engine Settings...
    </div>
  );
}
