"use client";
import BusinessQR from "@/components/dashboard/BusinessQR";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import FlyerTemplateOne from "./FlyerTemplateOne";

type FlyerBuilderProps = {
  businessName: string;
  slug: string;
};

export default function FlyerBuilder({
  businessName,
  slug,
}: FlyerBuilderProps) {
  const flyerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const preview = previewRef.current;

    if (!preview) return;

    const updateScale = () => {
      const availableWidth = preview.clientWidth;

      const scale = Math.min(availableWidth / 791, 1);

      setPreviewScale(scale);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);

    observer.observe(preview);

    return () => observer.disconnect();
  }, []);
  const [phrase, setPhrase] = useState(
    "Forma parte de nuestro programa de fidelidad y comienza a ganar puntos para canjearlos por los productos que ya te encantan.",
  );

  const [downloading, setDownloading] = useState(false);

  async function downloadFlyer() {
    if (!flyerRef.current || downloading) return;

    try {
      setDownloading(true);

      const dataUrl = await toPng(flyerRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });

      const link = document.createElement("a");

      link.download = `${businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}-loyalty-flyer.png`;

      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Flyer download error:", error);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-950">QR & Flyers</h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a promotional flyer for your loyalty program.
        </p>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="self-start rounded-2xl border border-[#e8e8e8] bg-white p-5">
          <label className="text-sm font-semibold text-gray-800">
            Promotional phrase
          </label>

          <textarea
            value={phrase}
            onChange={(event) => {
              const value = event.target.value;

              // Evita demasiados saltos de línea
              const limitedLines = value.split("\n").slice(0, 3).join("\n");

              setPhrase(limitedLines);
            }}
            rows={3}
            maxLength={60}
            placeholder="Ejemplo: Gana puntos en cada compra y recibe recompensas."
            className="mt-2 min-h-[110px] w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-sm leading-5 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
          />

          <p className="mt-1 text-right text-xs text-gray-400">
            {phrase.length}/60
          </p>

          <button
            type="button"
            onClick={downloadFlyer}
            disabled={downloading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={17} />

            {downloading ? "Preparing..." : "Download Flyer PNG"}
          </button>
          <div className="mt-3">
            <BusinessQR
              slug={slug}
              size={700}
              showControls={true}
              showPreview={false}
              buttonText="Download QR only"
            />
          </div>
        </aside>

        <section className="min-w-0 rounded-2xl border border-[#e8e8e8] bg-[#f6f7f9] p-3 sm:p-5">
          <div ref={previewRef} className="mx-auto w-full max-w-[791px]">
            <div
              className="relative mx-auto"
              style={{
                width: `${791 * previewScale}px`,
                height: `${1024 * previewScale}px`,
              }}
            >
              <div
                className="absolute left-0 top-0 origin-top-left shadow-xl"
                style={{
                  width: "791px",
                  height: "1024px",
                  transform: `scale(${previewScale})`,
                }}
              >
                <FlyerTemplateOne
                  ref={flyerRef}
                  businessName={businessName}
                  slug={slug}
                  phrase={phrase}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
