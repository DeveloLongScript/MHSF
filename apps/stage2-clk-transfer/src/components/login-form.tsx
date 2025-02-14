import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignIn, SignUp } from "@clerk/nextjs"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("max-sm:w-screen sm:flex sm:flex-col sm:gap-6 sm:w-[28rem]", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Now make your new account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUp routing="virtual" />
        </CardContent>
      </Card> 
    </div>
  )
}
