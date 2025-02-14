import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="sm:flex sm:w-full sm:max-w-sm sm:flex-col sm:gap-6">
        <LoginForm />
      </div>
    </div>
  )
}
