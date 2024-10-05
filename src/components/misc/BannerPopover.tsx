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
import { useEffect } from "react";
import ColorProvider from "../ColorProvider";
import toast from "react-hot-toast";

const FormSchema = z.object({
  website: z
    .string()
    .min(2, {
      message: "ID must be at least 2 characters.",
    })
    .url({ message: "Image must be in URL form." }),
});

export function BannerPopover({ server, get }: { server: string; get: any }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      website: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.website.startsWith("https://i.imgur.com")) {
      let imageId = data.website.split(".com")[1];
      imageId = imageId.substring(1);

      toast.promise(setCustomization(server, { banner: imageId }), {
        loading: "Setting banner..",
        success: "Set banner!",
        error: "Error while setting banner",
      });
    } else {
      toast.error(
        "To avoid view loggers, the Image URL must be from Imgur. (do not use the generic imgur.com URL, copy the direct image URL with i.imgur.com) "
      );
    }
  }

  useEffect(() => console.log(get.discord), [get]);

  return (
    <ColorProvider server={server} fetch={get}>
      <div>
        <span className="text-sm">
          Make sure the image is from Imgur, and the image format is png or gif.
        </span>
        <br />
        <br />
        <strong>Tutorial:</strong>
        <video width="600" height="600" className="rounded w-[600px]" autoPlay>
          <source src="/videos/imgurTutorial.mp4" type="video/mp4" />
        </video>
        <br />
        <br />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
            defaultValue={get.discord}
          >
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
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
              onClick={() => {
                console.log("hi");
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
