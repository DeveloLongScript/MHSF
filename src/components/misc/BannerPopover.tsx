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
