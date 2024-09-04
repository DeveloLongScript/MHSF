import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div className="pt-[60px] p-4">
        <strong>404 - Page not found</strong>
        <br />
        <p>
          We couldn't find the page you were looking for.{" "}
          <Link href="/">Go home</Link>
        </p>
      </div>
    </main>
  );
}
