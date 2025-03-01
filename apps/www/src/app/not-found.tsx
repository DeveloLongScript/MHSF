import Footer from "@/components/misc/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <span className="flex justify-center items-center text-center min-h-screen h-max">
        <div className="block">
          That page couldn't be found <br />
          <Link href="/">Go home</Link>
        </div>
      </span>
      <Footer />
    </>
  );
}
