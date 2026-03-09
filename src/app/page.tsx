// app/(marketing)/page.tsx
// Landing Page — Loyalty App (Next.js + Tailwind)
// ✅ Paste as-is. No extra libs required.

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";

const features = [
  {
    title: "Fast QR scanning in seconds",
    desc: "Scan the customer’s QR and add points instantly. No paper, no complicated apps.",
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
    title: "Goals & rewards",
    desc: "Set the goal (e.g., 10 points) and the earning step (e.g., 1 per visit or per purchase).",
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
    title: "Dashboard & metrics",
    desc: "Track daily scans, points issued, customers, and progress toward the goal.",
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
    title: "PIN security",
    desc: "Protect the scanner and prevent unauthorized use at the counter with a business PIN.",
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
  "Restaurants & coffee shops",
  "Barbershops & beauty salons",
  "Car wash / detailing",
  "Gyms",
  "Landscaping & local services",
  "Stores & retail",
];

const howItWorks = [
  {
    step: "1",
    title: "Customer signs up",
    desc: "They receive their personal (unique) QR to collect points.",
  },
  {
    step: "2",
    title: "Purchase / visit",
    desc: "A staff member opens the scanner and scans the QR.",
  },
  {
    step: "3",
    title: "Instant points",
    desc: "The system adds points and shows the updated total.",
  },
  {
    step: "4",
    title: "Redeem reward",
    desc: "Once they hit the goal, they redeem the reward and come back again.",
  },
];

const faqs = [
  {
    q: "Do I need to print physical cards?",
    a: "No. Everything is digital. Customers use their QR on their phone (or you can print the QR if you want).",
  },
  {
    q: "Does it work for any type of business?",
    a: "Yes. Any business with repeat customers can use it: food, beauty, auto, services, retail, and more.",
  },
  {
    q: "Can I customize it with my brand?",
    a: "Yes. You can use your logo, colors, and even your domain (e.g., app.yourbrand.com).",
  },
  {
    q: "How do I prevent anyone from scanning?",
    a: "The scanner is protected with a business PIN, perfect for employees at the counter.",
  },
];

export default function LandingPage() {
  const router = useRouter();
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
              <div className="text-sm font-semibold">Loyalty App</div>
              <div className="text-xs text-slate-500">QR-based loyalty</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#benefits" className="hover:text-slate-900">
              Benefits
            </a>
            <a href="#how-it-works" className="hover:text-slate-900">
              How it works
            </a>
            <a href="#features" className="hover:text-slate-900">
              Features
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
              Sign in
            </Link>

            <Link
              href="/register"
              className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
            >
              Start free
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
              Digital card • QR • Dashboard
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Turn customers into repeat buyers with a{" "}
              <span className="text-slate-900">modern loyalty app</span>.
            </h1>

            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Replace paper punch cards with a digital QR system. Add points in
              seconds, increase repeat visits, and manage everything from a
              dashboard.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
              >
                Create my program for free
              </Link>

              <Link
                href="#how-it-works"
                className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                See how it works
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="Setup" value="Fast" />
              <Stat label="Scan" value="QR" />
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
                  <div className="text-xs text-slate-500">Loyalty program</div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MiniMetric title="Scans today" value="24" />
                <MiniMetric title="Points today" value="48" />
                <MiniMetric title="Customers" value="312" />
                <MiniMetric title="Goal" value="10 pts" />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Recent scan</div>
                  <div className="text-xs text-slate-500">2 min ago</div>
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
                      +1 point • Total:{" "}
                      <span className="font-semibold text-slate-900">8</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      80% progress
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-white">
                    <div className="h-2 w-[80%] rounded-full bg-slate-900" />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>0</span>
                    <span>Goal 10</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                  Open Scanner
                </button>
                <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                  View History
                </button>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                * Mock preview. Your real system connects to your business and
                customers.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / social proof (simple) */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm">
          <div className="text-center text-sm font-semibold text-slate-700">
            Perfect for local businesses that want repeat customers
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
      <section id="benefits" className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              More visits. More sales. Less friction.
            </h2>
            <p className="mt-3 text-slate-600">
              Instead of relying only on ads, turn every purchase into a reason
              to come back. Retention is cheaper than acquiring new customers.
            </p>

            <div className="mt-6 grid gap-3">
              <Benefit
                title="Increase repeat visits"
                desc="Clear rewards motivate customers to complete their goal."
              />
              <Benefit
                title="Control & reporting"
                desc="Track scans, points, and customers to measure results."
              />
              <Benefit
                title="Professional experience"
                desc="Modern QR system with a fast workflow for your team."
              />
              <Benefit
                title="No lost cards"
                desc="Digital: customers always have their QR available."
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Program example
                </div>
                <div className="text-xs text-slate-500">
                  “Buy 9, get the 10th free”
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Popular
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Goal</div>
                <div className="text-lg font-bold">10 points</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Earn</div>
                <div className="text-lg font-bold">+1 per visit</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Reward</div>
                <div className="text-lg font-bold">Free</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Control</div>
                <div className="text-lg font-bold">Dashboard</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold">Who is it for?</div>
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
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            How it works
          </h2>
          <p className="mt-3 text-slate-600">
            A simple 4-step flow for your team and your customers.
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
              <div className="text-sm font-semibold">Quick tip</div>
              <p className="mt-2 text-sm text-slate-600">
                You can use it as a program per visit or per purchase (depending
                on your settings). Example: every $10 = 1 point, or every visit
                = 1 point.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                I want a demo
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
              Key features
            </h2>
            <p className="mt-2 text-slate-600">
              Everything you need to build loyalty—without the hassle.
            </p>
          </div>
          <Link
            href="#contact"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
          >
            Talk now
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
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Plans & pricing
          </h2>
          <p className="mt-3 text-slate-600">
            Choose the plan that fits your business. No long-term contracts.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* STARTER */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold">Starter</h3>
            <p className="mt-2 text-sm text-slate-500">
              Ideal for small businesses
            </p>

            <div className="mt-6">
              <span className="text-4xl font-extrabold">$29</span>
              <span className="text-slate-500 text-sm"> / month</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>✔ Up to 300 customers</li>
              <li>✔ Basic loyalty program</li>
              <li>✔ QR scanning</li>
              <li>✔ Simple dashboard</li>
              <li>✔ Email support</li>
            </ul>

            <button
              onClick={() => router.push("/register")}
              className="bg-black text-white px-6 py-3 rounded"
            >
              Start your free trial
            </button>
          </div>

          {/* PRO (Featured) */}
          <div className="relative rounded-[2rem] border-2 border-slate-900 bg-white p-8 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold text-white">
              Most Popular
            </div>

            <h3 className="text-lg font-semibold">Pro</h3>
            <p className="mt-2 text-sm text-slate-500">
              For growing businesses
            </p>

            <div className="mt-6">
              <span className="text-4xl font-extrabold">$59</span>
              <span className="text-slate-500 text-sm"> / month</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>✔ Unlimited customers</li>
              <li>✔ Advanced points rules</li>
              <li>✔ Full history</li>
              <li>✔ PIN protection</li>
              <li>✔ Custom domain</li>
              <li>✔ Priority support</li>
            </ul>

            <button className="mt-8 w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Start Pro
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          * Cancel anytime. No required contracts.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-[2.5rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-xl">
          <div className="grid gap-8 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-extrabold">
                Launch your loyalty program in minutes.
              </h3>
              <p className="mt-2 text-white/80">
                Perfect for local businesses. QR scanning, points, and metrics
                in one place.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Create my loyalty program
              </Link>
              <Link
                href="#faq"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">FAQ</h2>
          <p className="mt-3 text-slate-600">
            The most common questions before getting started.
          </p>
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
      <section id="contact" className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Request a demo
              </h2>
              <p className="mt-3 text-slate-600">
                Leave your info and we’ll show you how it works for your type of
                business.
              </p>

              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Fast setup and assistance
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Brand + domain customization
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Great for local businesses and small chains
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
            © {new Date().getFullYear()} Loyalty App • Freddy Graphics /
            Fideliza
          </div>
          <div className="flex gap-4 text-sm text-slate-600">
            <a className="hover:text-slate-900" href="#benefits">
              Benefits
            </a>
            <a className="hover:text-slate-900" href="#how-it-works">
              How it works
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
