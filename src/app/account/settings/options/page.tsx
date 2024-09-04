"use client";
import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import { ExternalLink, KeyRound, UserPen, Link, Cog } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { default as NextLink } from "next/link";
import { useEffect, useState } from "react";

export default function Settings() {
  const clerk = useClerk();

  const { user, isSignedIn } = useUser();
  const [linked, setLinked] = useState(false);
  useEffect(() => {
    setLinked(user?.publicMetadata.player != undefined);
  }, [user, isSignedIn]);

  return (
    <main className="pt-[48px] p-4">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[calc(100vh-70px)] "
      >
        <ResizablePanel className="min-w-[285px] max-w-[285px] w-[285px] max-md:hidden">
          <div className="w-[300px] mt-[20px] ml-[10px]">
            <NextLink href="/account/settings" className="text-inherit">
              <Button className="mb-[2px] w-[250px]" variant="ghost">
                <Link size={16} className="mr-2" /> Linking
              </Button>
            </NextLink>
            <Button className="mb-[2px] w-[250px]">
              <Cog size={16} className="mr-2" /> Options
            </Button>
            <Button
              className="mb-[2px] w-[250px]"
              variant="ghost"
              onClick={() => clerk.openUserProfile({})}
            >
              <UserPen size={16} className="mr-2" /> Profile{" "}
              <ExternalLink size={16} className="ml-2" />
            </Button>
            <Button
              className="mb-[2px] w-[250px]"
              variant="ghost"
              onClick={() => clerk.openUserProfile({})}
            >
              <KeyRound size={16} className="mr-2" /> Security{" "}
              <ExternalLink size={16} className="ml-2" />
            </Button>
          </div>
        </ResizablePanel>
        <ResizableHandle className="max-md:hidden" />
        <ResizablePanel>
          <div className="p-4">
            <div className="md:hidden">
              <NextLink href="/account/settings" className="text-inherit">
                <Button className="mr-[2px]" variant="ghost">
                  <Link size={16} className="mr-2" /> Linking
                </Button>
              </NextLink>

              <Button className="mr-[2px] ">
                <Cog size={16} className="mr-2" /> Options
              </Button>
              <Button
                className="mr-[2px]"
                variant="ghost"
                onClick={() => clerk.openUserProfile({})}
              >
                <UserPen size={16} className="mr-2" /> Profile{" "}
                <ExternalLink size={16} className="ml-2" />
              </Button>
              <Button
                className="mr-[2px] mb-[30px]"
                variant="ghost"
                onClick={() => clerk.openUserProfile({})}
              >
                <KeyRound size={16} className="mr-2" /> Security{" "}
                <ExternalLink size={16} className="ml-2" />
              </Button>
            </div>
            <strong className="text-3xl">Profile Preferences</strong>
            <br />
            <br />
            <div className="md:grid md:grid-cols-3 gap-1.5">
              <Card>
                <CardContent>
                  <br />
                  <PaddingRadioForm />
                </CardContent>
              </Card>
              <br className="md:hidden" />
              <Card>
                <CardContent>
                  <br />
                  <RowRadioForm />
                </CardContent>
              </Card>
              <br className="md:hidden" />
              <Card>
                <CardContent>
                  <br />
                  <ServerPaddingForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { setAccountSL } from "@/lib/api";
import toast from "react-hot-toast";

const FormSchema = z.object({
  type: z.enum(["15", "30", "40", "60", "100", "200"], {
    required_error: "You need to select a valid padding.",
  }),
});

const FormSchemaGrid = z.object({
  grid: z.enum(["4", "5", "6"], {
    required_error: "You need to select a valid grid type.",
  }),
});

export function RowRadioForm() {
  const { user } = useUser();
  const form = useForm<z.infer<typeof FormSchemaGrid>>({
    resolver: zodResolver(FormSchemaGrid),
    defaultValues: {
      grid: user?.publicMetadata.ipr as "4" | "5" | "6" | undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchemaGrid>) {
    toast.promise(setAccountSL(Number.parseInt(data.grid), "ipr"), {
      loading: "Saving...",
      success: "Saved!",
      error: "Failed to save",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="grid"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Items per row</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      4 items per row
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="5" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      5 items per row
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="6" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      6 items per row
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function PaddingRadioForm() {
  const { user } = useUser();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),

    defaultValues: {
      type: user?.publicMetadata.pad as
        | "15"
        | "30"
        | "40"
        | "60"
        | "100"
        | "200"
        | undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.promise(setAccountSL(Number.parseInt(data.type), "pad"), {
      loading: "Saving...",
      success: "Saved!",
      error: "Failed to save",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Padding of servers</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="15" />
                    </FormControl>
                    <FormLabel className="font-normal">15px</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="30" />
                    </FormControl>
                    <FormLabel className="font-normal">30px</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="40" />
                    </FormControl>
                    <FormLabel className="font-normal">40px</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="60" />
                    </FormControl>
                    <FormLabel className="font-normal">60px</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="100" />
                    </FormControl>
                    <FormLabel className="font-normal">100px</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="200" />
                    </FormControl>
                    <FormLabel className="font-normal">200px</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <Button
          onClick={() => setAccountSL(null, "pad")}
          variant="outline"
          type="button"
          className="ml-2"
        >
          Clear
        </Button>
      </form>
    </Form>
  );
}
const FormSchemaCB = z.object({
  padding: z.boolean().default(false).optional(),
});

export function ServerPaddingForm() {
  const { user } = useUser();
  const srv = user?.publicMetadata.srv as boolean | undefined;
  const form = useForm<z.infer<typeof FormSchemaCB>>({
    resolver: zodResolver(FormSchemaCB),
    defaultValues: {
      padding: srv === undefined ? false : srv,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchemaCB>) {
    toast.promise(
      setAccountSL(data.padding === undefined ? false : data.padding, "srv"),
      {
        loading: "Saving...",
        success: "Saved!",
        error: "Failed to save",
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="padding"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Use padding on the sides of only the servers, not the whole
                  server list
                </FormLabel>
                <FormDescription>
                  Only show the padding settings on the servers themselves, not
                  the whole entire page of the server list.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
