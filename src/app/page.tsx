import Image from "next/image";

export default function Home() {
  return (
    <div data-theme="luxury" className="">
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Welcome to My Unique App</h1>
        <p className="mt-4 text-lg">This is a sample page using Next.js and Tailwind CSS.</p>
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </main>
      <footer className="flex items-center justify-center h-24 border-t">
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-blue-600 hover:underline"
        >
          Powered by Next.js
        </a>
      </footer>
    </div>
  );
}
