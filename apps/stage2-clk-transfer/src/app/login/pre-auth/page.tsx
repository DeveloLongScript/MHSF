"use client";

import { GalleryVerticalEnd } from "lucide-react"

import { AuthFinish } from "@/components/auth-finish"
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div>
        <AuthFinish />
        <Suspense>
            <PreAuthLogic />
        </Suspense>
      </div>
    </div>
  )
}

function PreAuthLogic() {
    const searchParams = useSearchParams();
    const router = useRouter();
  
    useEffect(() => {
      const authentication = searchParams?.get("authentication");
      const oldId = searchParams?.get("oldId");
  
      if (typeof authentication === "string" && typeof oldId === "string") {
          sessionStorage.setItem("mhsf-transfer--auth", authentication)
          sessionStorage.setItem("mhsf-transfer--oldId", oldId)
          router.push("/login")
      }
    }, [])

    return <></>
}
