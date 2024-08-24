"use client";
import FadeIn from "react-fade-in";

export default function ClientFadeIn({
  children,
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  delay?: number;
  id?: string;
}) {
  return (
    <div id={id}>
      <FadeIn delay={delay}>{children}</FadeIn>
    </div>
  );
}
