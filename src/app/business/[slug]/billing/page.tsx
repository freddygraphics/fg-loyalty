export default async function BillingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-4 text-3xl font-semibold">Subscription Required</h1>

        <p className="mb-6 text-gray-600">
          Your subscription has expired, was canceled, or requires payment.
        </p>

        <a
          href={`/api/stripe/portal?slug=${encodeURIComponent(slug)}`}
          className="inline-flex rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          Manage Billing
        </a>
      </div>
    </div>
  );
}
