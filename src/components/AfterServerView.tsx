"use client";
import { getCustomization } from "@/lib/api";
import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Markdown from "react-markdown";
import { useTheme } from "next-themes";
import FadeIn from "react-fade-in/lib/FadeIn";

export default function AfterServerView({ server }: { server: string }) {
  const [description, setDescription] = useState("");
  const [discord, setDiscord] = useState("");
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomization(server).then((b) => {
      if (b != null) {
        setDescription(b.description == null ? "" : b.description);
        setDiscord(b.discord == null ? "" : b.discord);
      }
      setLoading(false);
    });
  }, []);
  if (loading) return <></>;

  return (
    <>
      <FadeIn>
        <div className="grid sm:grid-cols-4 pl-4 pr-4 gap-3.5">
          {description != "" && (
            <Card className="sm:col-span-3">
              <CardDescription className="p-4 prose dark:prose-invert">
                <Markdown disallowedElements={["img"]}>{description}</Markdown>
              </CardDescription>
            </Card>
          )}
          {discord != "" && (
            <Card>
              <CardHeader>
                <CardTitle>Discord Server</CardTitle>
                <CardDescription className="p-4 prose dark:prose-invert">
                  <iframe
                    src={`https://discord.com/widget?id=${discord}&theme=${resolvedTheme}`}
                    height="500"
                    allowTransparency={true}
                    className="rounded-lg lg:w-[350px]"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <br />
        </div>
      </FadeIn>
    </>
  );
}
