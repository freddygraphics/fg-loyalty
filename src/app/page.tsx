import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Tarjeta de Fidelización Digital
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Premia a tus clientes, aumenta la recompra y olvídate de las tarjetas
          físicas.
        </p>

        <div className="mt-8">
          <Link
            href="/register"
            className="bg-white text-black px-6 py-3 rounded font-semibold"
          >
            Registrar mi negocio
          </Link>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          ¿Por qué usar nuestro sistema?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded p-6">
            <h3 className="font-semibold mb-2">📱 Sin tarjetas físicas</h3>
            <p className="text-gray-600 text-sm">
              Todo funciona con QR. Tus clientes no pierden su tarjeta.
            </p>
          </div>

          <div className="border rounded p-6">
            <h3 className="font-semibold mb-2">⚙️ Control total</h3>
            <p className="text-gray-600 text-sm">
              Define puntos, límites y reglas desde tu panel.
            </p>
          </div>

          <div className="border rounded p-6">
            <h3 className="font-semibold mb-2">📊 Historial y métricas</h3>
            <p className="text-gray-600 text-sm">
              Mira quién vuelve, cuántos puntos ganan y redimen.
            </p>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-2xl font-bold text-center mb-10">
          ¿Cómo funciona?
        </h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">1️⃣</div>
            <p>Registras tu negocio</p>
          </div>

          <div>
            <div className="text-3xl mb-2">2️⃣</div>
            <p>Asignas puntos por compra</p>
          </div>

          <div>
            <div className="text-3xl mb-2">3️⃣</div>
            <p>El cliente redime su premio</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Empieza hoy mismo</h2>
        <p className="text-gray-600 mb-6">
          Configura tu programa de fidelización en minutos.
        </p>

        <Link
          href="/register"
          className="bg-black text-white px-6 py-3 rounded font-semibold"
        >
          Registrar mi negocio
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Loyalty System
      </footer>
    </main>
  );
}
