"use client";
import { AuthFinish } from "@/components/auth-finish";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem("mhsf-transfer--auth");
    const oldId = sessionStorage.getItem("mhsf-transfer--oldId");

    fetch("/api/v1/migrate", {
      method: "POST",
      body: JSON.stringify({ oldUserId: oldId, verificationToken: auth }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((c) => {
      c.json().then((v) => {
        if (v.error !== undefined) {
          toast.error(JSON.stringify(v));
        } else router.push("https://mhsf.app");
      });
    });
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div>
        <AuthFinish />
      </div>
    </div>
  );
}
