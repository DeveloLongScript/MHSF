"use client";

import { GalleryVerticalEnd } from "lucide-react"

import { AuthFinish } from "@/components/auth-finish"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function LoginPage() {
  const router = useRouter();
  const {user} = useUser();

  useEffect(() => {
    fetch("/api/v1/validate-stage1").then((c) => {
        c.json().then((v) => {
            console.log(v)
            router.push(process.env.NEXT_PUBLIC_STAGE_2 as string + "?authentication=" + v.validationToken + "&oldId=" + user?.id)
        })
    })
  }, [])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div>
        <AuthFinish />
      </div>
    </div>
  )
}
