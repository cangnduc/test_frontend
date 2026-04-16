import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p>Wellcome to my app</p>
      <Link href="/test">Test</Link>
      <Link href="/login">Sign In</Link>
      <Link href="/sign-up">Sign Up</Link>
    </div>
  );
}
