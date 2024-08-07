"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Form } from "./form";

export default function Setting({
  name,
  description,
  button,
  input,
  onSubmit,
  form,
}: {
  name: string;
  description: JSX.Element;
  button: JSX.Element;
  input?: JSX.Element;
  onSubmit?: () => void;
  form?: UseFormReturn;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {input && form && (
        <Form {...form}>
          <form
            onSubmit={
              onSubmit != undefined ? form.handleSubmit(onSubmit) : undefined
            }
            className="space-y-8"
          >
            <CardContent>{input}</CardContent>
            <CardFooter className="border-t px-6 py-4">{button}</CardFooter>
          </form>
        </Form>
      )}

      {!input && (
        <CardFooter className="border-t px-6 py-4">{button}</CardFooter>
      )}
    </Card>
  );
}
