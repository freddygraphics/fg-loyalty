import Link from "next/link";

export default function ScanPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">Escanear tarjeta</h1>

      <p className="text-gray-600 mb-4">
        Escanea el QR del cliente o pega el token:
      </p>

      <Link
        href={`/business/${params.slug}/scan`}
        className="inline-block bg-black text-white px-4 py-2 rounded"
      >
        Ir al scanner
      </Link>
    </>
  );
}
