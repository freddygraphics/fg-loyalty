"use client";

export default function BillingButton({ businessId }: { businessId: string }) {
  async function openBillingPortal() {
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessId }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <button
      onClick={openBillingPortal}
      className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
    >
      Manage Billing
    </button>
  );
}
