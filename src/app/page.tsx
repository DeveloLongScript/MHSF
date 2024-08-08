import ServerList from "@/components/ServerList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "the MHSF project by dvelo",
  description: `currently running in ${process.env.NEXT_PUBLIC_VERCEL_ENV} | commit (${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}) ${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE} by ${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME}`,
};

export default function Home() {
  return (
    <main>
      <div className="  pt-[60px] p-4">
        <ServerList />
      </div>
    </main>
  );
}
