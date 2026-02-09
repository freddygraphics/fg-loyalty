import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">FG Loyalty</h1>

      <p className="text-gray-600 max-w-xl mb-8">
        Reward your customers with points, QR scans, and a simple loyalty system
        for your business.
      </p>

      <div className="flex gap-4">
        <Link
          href="/register"
          className="bg-black text-white px-6 py-3 rounded"
        >
          Register Business
        </Link>

        <Link href="/access" className="border px-6 py-3 rounded">
          Access Dashboard
        </Link>
      </div>
    </main>
  );
}
