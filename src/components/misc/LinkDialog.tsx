"use client";
import { ShowInfo } from "@/components/misc/InfoClaim";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { linkMCAccount } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SetStateAction, useState } from "react";
import Confetti from "@/components/effects/confetti";

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function CodeDialog({
  linked,
  setLinked,
}: {
  linked: boolean;
  setLinked: (value: SetStateAction<boolean>) => void;
}) {
  const [name, setName] = useState("");
  const [dialog, setDialog] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { code } = data;
    const playerName = await toast.promise(
      new Promise(async (g, b) => {
        const response = await linkMCAccount(code);

        if (response == undefined) {
          b();
          return;
        }
        g(response);
      }),
      {
        loading: "Linking account..",
        error: "Incorrect code",
        success: "Linked account!",
      }
    );
    setName(playerName as string);
    setDialog(true);
    setLinked(true);
  }

  return (
    <div>
      <strong className="text-2xl ">Link your account</strong>
      <br />
      <ShowInfo />
      <br />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the code shown in your chat.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!linked && <Button type="submit">Submit</Button>}

          {linked && (
            <Button type="submit" disabled>
              Already linked
            </Button>
          )}
        </form>
      </Form>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You have linked your account!</DialogTitle>
            <Confetti className="absolute left-0 top-0 z-0 size-full" />
            <DialogDescription>
              You've successfully linked your account, <strong>{name}</strong>!
              Enjoy adding banners, custom accent colors, and other things to
              your server page.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
