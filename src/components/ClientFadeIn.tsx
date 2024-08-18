"use client";
import FadeIn from "react-fade-in";

export default function ClientFadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return <FadeIn delay={delay}>{children}</FadeIn>;
}
