"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";

export default function BusinessQR({ slug }: { slug: string }) {
  const qrRef = useRef<HTMLDivElement>(null);

  const url = `https://app.getfideliza.com/join/${slug}`;

  const downloadQR = async () => {
    if (!qrRef.current) return;

    const dataUrl = await htmlToImage.toPng(qrRef.current);

    const link = document.createElement("a");
    link.download = `qr-${slug}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR container */}
      <div ref={qrRef} className="bg-white ">
        <QRCode value={url} size={200} />
      </div>

      <p className="text-xs text-gray-500 text-center">
        Scan to join the rewards program
      </p>

      {/* Download button */}
      <button
        onClick={downloadQR}
        className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Download QR
      </button>
    </div>
  );
}
