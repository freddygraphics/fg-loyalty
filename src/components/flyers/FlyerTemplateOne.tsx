"use client";

import { forwardRef } from "react";
import BusinessQR from "@/components/dashboard/BusinessQR";

type FlyerTemplateOneProps = {
  businessName: string;
  slug: string;
  phrase: string;
};

const FlyerTemplateOne = forwardRef<HTMLDivElement, FlyerTemplateOneProps>(
  function FlyerTemplateOne({ businessName, slug, phrase }, ref) {
    return (
      <div
        ref={ref}
        className="relative shrink-0 overflow-hidden bg-white"
        style={{
          width: "791px",
          height: "1024px",
        }}
      >
        {/* Diseño base */}
        <img
          src="/flyers/template-1.png"
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />

        {/* Business Name */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: "52%",
            top: "3.2%",
            width: "43%",
            height: "8%",
          }}
        >
          <h2
            className="w-full text-center font-extrabold text-[#181d49]"
            style={{
              fontSize: businessName.length > 25 ? "22px" : "28px",
              lineHeight: "1.15",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {businessName}
          </h2>
        </div>

        {/* Frase promocional debajo de la moneda */}
        <div
          className="absolute flex items-center justify-center px-3 text-center"
          style={{
            left: "50%",
            top: "31.5%",
            width: "45%",
            height: "18%",
          }}
        >
          <p
            className="w-full whitespace-pre-line break-words font-semibold leading-snug text-[#181d49]"
            style={{
              fontSize: "20px",
              overflowWrap: "anywhere",
            }}
          >
            {phrase}
          </p>
        </div>

        {/* QR automático */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: "53.30%",
            top: "57%",
            width: "29.7%",
            aspectRatio: "1 / 1",
          }}
        >
          <BusinessQR slug={slug} size={220} showControls={false} />
        </div>
      </div>
    );
  },
);

export default FlyerTemplateOne;
