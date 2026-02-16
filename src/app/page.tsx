// app/(marketing)/page.tsx
// Landing Page — App de Puntos (Next.js + Tailwind)
// ✅ Pega este archivo tal cual (o cámbiale la ruta). No requiere libs extra.

import Link from "next/link";
import LeadForm from "@/components/LeadForm";

const features = [
  {
    title: "QR rápido en segundos",
    desc: "Escanea el QR del cliente y suma puntos al instante. Sin papel, sin apps complicadas.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 7V4h3M20 7V4h-3M4 17v3h3M20 17v3h-3" />
        <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7z" />
        <path d="M14 14h3v3h-3z" />
      </svg>
    ),
  },
  {
    title: "Metas y recompensas",
    desc: "Define la meta (ej. 10 puntos) y el paso de ganancia (ej. 1 por visita o por compra).",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 20s7-4 7-10V6l-7-2-7 2v4c0 6 7 10 7 10z" />
        <path d="M9 12l2 2 4-5" />
      </svg>
    ),
  },
  {
    title: "Dashboard y métricas",
    desc: "Ve escaneos del día, puntos entregados, clientes y progreso hacia la meta.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 3v18h18" />
        <path d="M7 14l3-3 3 2 5-6" />
      </svg>
    ),
  },
  {
    title: "Seguridad con PIN",
    desc: "Protege el scanner y evita usos no autorizados en caja con un PIN del negocio.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 11V7a4 4 0 0 1 8 0v4" />
        <path d="M6 11h16v10H6z" />
        <path d="M10 16h0" />
        <path d="M14 16h0" />
        <path d="M18 16h0" />
      </svg>
    ),
  },
];

const useCases = [
  "Restaurantes y cafeterías",
  "Barberías y salones de belleza",
  "Car wash / detailing",
  "Gimnasios",
  "Landscaping y servicios locales",
  "Tiendas y comercios",
];

const howItWorks = [
  {
    step: "1",
    title: "Cliente se registra",
    desc: "Recibe su QR personal (único) para acumular puntos.",
  },
  {
    step: "2",
    title: "Compra / visita",
    desc: "El empleado abre el scanner y escanea el QR.",
  },
  {
    step: "3",
    title: "Puntos al instante",
    desc: "El sistema suma puntos y muestra el total actualizado.",
  },
  {
    step: "4",
    title: "Canje de recompensa",
    desc: "Al llegar a la meta, se canjea el premio y el cliente regresa.",
  },
];

const faqs = [
  {
    q: "¿Necesito imprimir tarjetas físicas?",
    a: "No. Todo es digital. El cliente usa su QR desde el teléfono (o puedes imprimir el QR si lo deseas).",
  },
  {
    q: "¿Funciona para cualquier tipo de negocio?",
    a: "Sí. Cualquier negocio con clientes recurrentes puede usarlo: comida, belleza, auto, servicios, retail, etc.",
  },
  {
    q: "¿Se puede personalizar con mi marca?",
    a: "Sí. Puedes usar tu logo, colores y dominio (ej: app.tumarca.com).",
  },
  {
    q: "¿Cómo evito que cualquiera escanee?",
    a: "El scanner se protege con un PIN del negocio, ideal para empleados en caja.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.7),rgba(255,255,255,1))]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
              <span className="text-sm font-bold">FG</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">App de Puntos</div>
              <div className="text-xs text-slate-500">Fidelización con QR</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#beneficios" className="hover:text-slate-900">
              Beneficios
            </a>
            <a href="#funciona" className="hover:text-slate-900">
              Cómo funciona
            </a>
            <a href="#features" className="hover:text-slate-900">
              Funciones
            </a>
            <a href="#faq" className="hover:text-slate-900">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/register"
              className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Tarjeta digital • QR • Dashboard
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Fideliza clientes con una{" "}
              <span className="text-slate-900">App de Puntos</span> moderna.
            </h1>

            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Reemplaza tarjetas de papel con un sistema digital con QR. Suma
              puntos en segundos, aumenta visitas recurrentes y controla todo
              desde un dashboard.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
              >
                Crear mi programa gratis
              </Link>

              <Link
                href="#como-funciona"
                className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Ver cómo funciona
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="Setup" value="Rápido" />
              <Stat label="Escaneo" value="QR" />
              <Stat label="Control" value="Dashboard" />
            </div>
          </div>

          {/* Mock card */}
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.10),transparent_60%)]" />
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Demo Coffee Shop</div>
                  <div className="text-xs text-slate-500">
                    Programa de puntos
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Activo
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MiniMetric title="Escaneos hoy" value="24" />
                <MiniMetric title="Puntos hoy" value="48" />
                <MiniMetric title="Clientes" value="312" />
                <MiniMetric title="Meta" value="10 pts" />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Escaneo reciente</div>
                  <div className="text-xs text-slate-500">hace 2 min</div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 7V4h3M20 7V4h-3M4 17v3h3M20 17v3h-3" />
                      <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      Juan Pérez
                    </div>
                    <div className="text-xs text-slate-600">
                      +1 punto • Total:{" "}
                      <span className="font-semibold text-slate-900">8</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Progreso 80%
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-white">
                    <div className="h-2 w-[80%] rounded-full bg-slate-900" />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>0</span>
                    <span>Meta 10</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                  Abrir Scanner
                </button>
                <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                  Ver Historial
                </button>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                * Mock visual. Tu sistema real se conecta a tu negocio y
                clientes.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / social proof (simple) */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm">
          <div className="text-center text-sm font-semibold text-slate-700">
            Perfecto para negocios locales que quieren clientes recurrentes
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm text-slate-500 sm:grid-cols-3 lg:grid-cols-6">
            {[
              "Coffee",
              "Barber",
              "Beauty",
              "Car Wash",
              "Gym",
              "Landscaping",
            ].map((x) => (
              <div
                key={x}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                {x}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Más visitas. Más ventas. Menos fricción.
            </h2>
            <p className="mt-3 text-slate-600">
              En vez de depender solo de anuncios, convierte cada compra en una
              razón para regresar. Retener es más barato que conseguir clientes
              nuevos.
            </p>

            <div className="mt-6 grid gap-3">
              <Benefit
                title="Aumenta la recurrencia"
                desc="Recompensas claras motivan al cliente a completar su meta."
              />
              <Benefit
                title="Control y reportes"
                desc="Mira escaneos, puntos y clientes para medir resultados."
              />
              <Benefit
                title="Imagen profesional"
                desc="Sistema moderno con QR y experiencia rápida para tu equipo."
              />
              <Benefit
                title="Sin tarjetas perdidas"
                desc="Digital: el cliente siempre tiene su QR disponible."
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Ejemplo de programa
                </div>
                <div className="text-xs text-slate-500">
                  “Compra 9, el 10 es gratis”
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Popular
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Meta</div>
                <div className="text-lg font-bold">10 puntos</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Ganancia</div>
                <div className="text-lg font-bold">+1 por visita</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Recompensa</div>
                <div className="text-lg font-bold">Gratis</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Control</div>
                <div className="text-lg font-bold">Dashboard</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold">¿Quién puede usarla?</div>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                {useCases.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="funciona" className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Cómo funciona
          </h2>
          <p className="mt-3 text-slate-600">
            Flujo simple en 4 pasos para tu equipo y tus clientes.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((s) => (
            <div
              key={s.step}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white">
                  <span className="text-sm font-bold">{s.step}</span>
                </div>
                <div className="text-sm font-semibold">{s.title}</div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <div className="text-sm font-semibold">Tip rápido</div>
              <p className="mt-2 text-sm text-slate-600">
                Puedes usarlo como programa por visitas o por compra (según tu
                configuración). Ejemplo: por cada $10 = 1 punto, o por cada
                visita = 1 punto.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Link
                href="#contacto"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Quiero una demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Funciones principales
            </h2>
            <p className="mt-2 text-slate-600">
              Lo esencial para fidelizar sin complicarte.
            </p>
          </div>
          <Link
            href="#contacto"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
          >
            Hablar ahora
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
                  {f.icon}
                </div>
                <div>
                  <div className="text-base font-semibold">{f.title}</div>
                  <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Pricing */}
      <section id="precios" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Planes y precios
          </h2>
          <p className="mt-3 text-slate-600">
            Elige el plan ideal para tu negocio. Sin contratos largos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* STARTER */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold">Starter</h3>
            <p className="mt-2 text-sm text-slate-500">
              Ideal para negocios pequeños
            </p>

            <div className="mt-6">
              <span className="text-4xl font-extrabold">$29</span>
              <span className="text-slate-500 text-sm"> / mes</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>✔ Hasta 300 clientes</li>
              <li>✔ Programa de puntos básico</li>
              <li>✔ Escaneo QR</li>
              <li>✔ Dashboard simple</li>
              <li>✔ Soporte por email</li>
            </ul>

            <button className="mt-8 w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold hover:bg-slate-50">
              Empezar Starter
            </button>
          </div>

          {/* PRO (Destacado) */}
          <div className="relative rounded-[2rem] border-2 border-slate-900 bg-white p-8 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold text-white">
              Más Popular
            </div>

            <h3 className="text-lg font-semibold">Pro</h3>
            <p className="mt-2 text-sm text-slate-500">
              Para negocios en crecimiento
            </p>

            <div className="mt-6">
              <span className="text-4xl font-extrabold">$59</span>
              <span className="text-slate-500 text-sm"> / mes</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>✔ Clientes ilimitados</li>
              <li>✔ Reglas avanzadas de puntos</li>
              <li>✔ Historial completo</li>
              <li>✔ Protección con PIN</li>
              <li>✔ Dominio personalizado</li>
              <li>✔ Soporte prioritario</li>
            </ul>

            <button className="mt-8 w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Empezar Pro
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          * Puedes cancelar en cualquier momento. Sin contratos obligatorios.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-[2.5rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-xl">
          <div className="grid gap-8 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-extrabold">
                Activa tu programa de fidelización en minutos.
              </h3>
              <p className="mt-2 text-white/80">
                Ideal para negocios locales. Escaneo QR, puntos y métricas en un
                solo lugar.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="#contacto"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Crear mi programa de puntos
              </Link>
              <Link
                href="#faq"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                Ver preguntas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Preguntas frecuentes
          </h2>
          <p className="mt-3 text-slate-600">Lo más común antes de empezar.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-base font-semibold">{f.q}</div>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Solicita una demo
              </h2>
              <p className="mt-3 text-slate-600">
                Déjanos tu info y te mostramos cómo funciona con tu tipo de
                negocio.
              </p>

              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Setup rápido y asistencia
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Personalización con marca y dominio
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Ideal para locales y cadenas pequeñas
                </div>
              </div>
            </div>

            {/* Simple form (front-only) */}
            <LeadForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} App de Puntos • Freddy Graphics /
            Fideliza
          </div>
          <div className="flex gap-4 text-sm text-slate-600">
            <a className="hover:text-slate-900" href="#beneficios">
              Beneficios
            </a>
            <a className="hover:text-slate-900" href="#funciona">
              Cómo funciona
            </a>
            <a className="hover:text-slate-900" href="#faq">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-extrabold">{value}</div>
    </div>
  );
}

function MiniMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="mt-1 text-xl font-extrabold text-slate-900">{value}</div>
    </div>
  );
}

function Benefit({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30" />
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{desc}</div>
        </div>
      </div>
    </div>
  );
}
