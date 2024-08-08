"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setCustomization } from "@/lib/api";
import { useEffect, useState } from "react";
import ColorProvider from "../ColorProvider";
import toast from "react-hot-toast";

const FormSchema = z.object({
  id: z.string().min(2, {
    message: "ID must be at least 2 characters.",
  }),
});

export function DiscordPopover({ server, get }: { server: string; get: any }) {
  const [value, setValue] = useState("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: value,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.promise(setCustomization(server, { discord: data.id }), {
      loading: "Setting Discord",
      success: "Set Discord",
      error: "Error while setting Discord",
    });
  }

  useEffect(() => {
    setValue(get.discord == null ? "" : get.discord);
    form.reset({ id: get.discord == null ? "" : get.discord });
  }, [get]);

  return (
    <ColorProvider server={server} fetch={get}>
      <div>
        <span className="text-sm">
          To embed a Discord server into your server page, first enable the
          Server widget (Server Settings, Widget, Enable Server Widget) and then
          copy your Server ID and put it below.
        </span>
        <br />
        <br />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-[30px]">
              Submit
            </Button>
            <Button
              className="ml-2 h-[30px]"
              type="button"
              onClick={async () => {
                setValue("");
                toast.promise(setCustomization(server, { discord: null }), {
                  loading: "Clearing Discord",
                  success: "Cleared Discord",
                  error: "Error while clearing Discord",
                });
              }}
            >
              Clear
            </Button>
          </form>
        </Form>
      </div>
    </ColorProvider>
  );
}
