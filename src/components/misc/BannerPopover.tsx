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
import { toast } from "sonner";
import ColorProvider from "../ColorProvider";

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
		toast.promise(setCustomization(server, { banner: data.website }), {
			loading: "Setting banner..",
			success: "Set banner!",
			error: "Error while setting banner",
		});
	}

	return (
		<ColorProvider server={server} fetch={get}>
			<div>
				<span className="text-sm">
					All images that are in a web supported format can be used as the
					banner for a server.
				</span>
				<br />
				<br />
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-2/3 space-y-6"
						defaultValue={get?.banner}
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
