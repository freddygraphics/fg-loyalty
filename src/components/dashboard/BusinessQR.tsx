"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";

type BusinessQRProps = {
  slug: string;
  size?: number;
  showControls?: boolean;
  showPreview?: boolean;
  buttonText?: string;
};

export default function BusinessQR({
  slug,
  size = 200,
  showControls = true,
  showPreview = true,
  buttonText = "Download QR",
}: BusinessQRProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const url = `https://getfideliza.com/join/${slug}`;

  const downloadQR = async () => {
    if (!qrRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(qrRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");

      link.download = `qr-${slug}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("QR download error:", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        ref={qrRef}
        className={
          showPreview
            ? "bg-white p-2"
            : "fixed -left-[9999px] top-0 bg-white p-4"
        }
      >
        <QRCode
          value={url}
          size={size}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
        />
      </div>

      {showControls && (
        <>
          {showPreview && (
            <p className="text-center text-xs text-gray-500">
              Scan to join the rewards program
            </p>
          )}

          <button
            type="button"
            onClick={downloadQR}
            className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            {buttonText}
          </button>
        </>
      )}
    </div>
  );
}
