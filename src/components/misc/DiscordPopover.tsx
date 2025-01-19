/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
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
import { toast } from "sonner";

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
    setValue(get.discord === undefined ? "" : get.discord);
    form.reset({ id: get.discord === undefined ? "" : get.discord });
  }, [get]);

  return (
    <ColorProvider server={server} fetchV={get}>
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
