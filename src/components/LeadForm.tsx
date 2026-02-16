"use client";

export default function LeadForm() {
  return (
    <form
      className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        alert("Conecta este formulario a tu API /api/leads");
      }}
    >
      <div className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Nombre</span>
          <input
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-4 focus:ring-slate-900/10"
            placeholder="Tu nombre"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Negocio</span>
          <input
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-4 focus:ring-slate-900/10"
            placeholder="Ej: Barbería, Car Wash..."
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">
            Teléfono / WhatsApp
          </span>
          <input
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-4 focus:ring-slate-900/10"
            placeholder="(201) 555-1234"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Email</span>
          <input
            type="email"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-4 focus:ring-slate-900/10"
            placeholder="tuemail@correo.com"
            required
          />
        </label>

        <button
          type="submit"
          className="mt-2 h-12 rounded-2xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Enviar solicitud
        </button>

        <p className="text-xs text-slate-500">
          * Conéctalo a tu endpoint /api/leads cuando lo tengas listo.
        </p>
      </div>
    </form>
  );
}
