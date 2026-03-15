export default function BillingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold mb-4">Subscription Required</h1>

        <p className="text-gray-600 mb-6">
          Your subscription has expired or payment failed.
        </p>

        <a
          href="/api/stripe/portal"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Manage Billing
        </a>
      </div>
    </div>
  );
}
