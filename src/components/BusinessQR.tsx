"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function BusinessQR({ slug }: { slug: string }) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // ✅ URL REAL DONDE CORRE LA APP
    setUrl(`${window.location.origin}/join/${slug}`);
  }, [slug]);

  // Evita render hasta tener la URL
  if (!url) return null;

  return (
    <div className="border rounded-xl p-6 bg-white">
      <h2 className="text-lg font-bold mb-2">Your Loyalty QR</h2>

      <div className="flex justify-center my-4">
        <QRCode value={url} size={180} />
      </div>

      <p className="text-sm text-gray-600 text-center">
        Customers scan this QR to join your loyalty program
      </p>

      <p className="text-xs text-gray-500 text-center mt-2 break-all">{url}</p>

      <div className="flex justify-center gap-2 mt-4">
        <button className="border px-3 py-1 rounded text-sm">Download</button>
        <button className="border px-3 py-1 rounded text-sm">Print</button>
      </div>
    </div>
  );
}
