/*
 * MHSF, Minehut Server List
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { AtSign, LogIn, Ship } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "@/lib/useRouter";

export default function SignInPopoverButton({
  className,
  variant,
}: {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "secondary"
    | "outline"
    | "ghost"
    | "link";
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={className} variant={variant}>
          Sign In
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <SignInPopover />
      </PopoverContent>
    </Popover>
  );
}

export function SignInPopover() {
  const clerk = useClerk();
  const router = useRouter();
  return (
    <div className=" grid w-[200px]">
      <strong className="text-center">Login</strong>
      <small className="text-center pb-2">
        Customize your own servers and favorite other servers. Secured by Clerk
        <br className="py-2"/>
        If you created your account before Jan. 29, 2025, use the legacy migration button.
      </small>
      <br />
      <Button variant={"ghost"} onClick={() => clerk.openSignIn()}>
        <LogIn size={18} className="mr-2" />
        Login
      </Button>
      <Button variant={"ghost"} onClick={() => clerk.openSignUp()}>
        <AtSign size={18} className="mr-2" />
        Sign-up
      </Button>
      <Button variant="ghost" onClick={() => router.push(process.env.NEXT_PUBLIC_CLERK_SWITCH_DOMAIN as string)}>
        <Ship size={18} className="mr-2"/>Legacy Migration
      </Button>
    </div>
  );
}
