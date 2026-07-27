"use client";

import { type SubmitEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Building2, CheckCircle2, Loader2, Save } from "lucide-react";

type AccountForm = {
  name: string;
  slug: string;
  businessEmail: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

const initialForm: AccountForm = {
  name: "",
  slug: "",
  businessEmail: "",
  phone: "",
  website: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

export default function AccountPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const [form, setForm] = useState<AccountForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!slug) return;

    async function loadAccount() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/business/${slug}/account`, {
          cache: "no-store",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load account");
        }

        setForm({
          name: data.name ?? "",
          slug: data.slug ?? "",
          businessEmail: data.businessEmail ?? "",
          phone: data.phone ?? "",
          website: data.website ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          zipCode: data.zipCode ?? "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load account");
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [slug]);

  function updateField(field: keyof AccountForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/business/${slug}/account`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save changes");
      }

      setForm({
        name: data.business.name ?? "",
        slug: data.business.slug ?? "",
        businessEmail: data.business.businessEmail ?? "",
        phone: data.business.phone ?? "",
        website: data.business.website ?? "",
        address: data.business.address ?? "",
        city: data.business.city ?? "",
        state: data.business.state ?? "",
        zipCode: data.business.zipCode ?? "",
      });

      setSuccess("Business information saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save changes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" size={28} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Account
        </h1>

        <p className="mt-1.5 text-sm text-gray-500 sm:text-base">
          Manage your business information and public details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white"
      >
        <div className="flex items-center gap-3 border-b border-[#ededed] bg-[#fbfbfb] px-5 py-4 sm:px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white">
            <Building2 size={19} />
          </span>

          <div>
            <h2 className="font-semibold text-gray-950">
              Business information
            </h2>

            <p className="text-xs text-gray-500">
              Information associated with your Fideliza account
            </p>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Business Name"
              value={form.name}
              required
              onChange={(value) => updateField("name", value)}
            />

            <Field
              label="Business URL"
              value={form.slug}
              disabled
              helper="The URL does not change when you edit the business name."
              onChange={() => undefined}
            />

            <Field
              label="Business Email"
              type="email"
              value={form.businessEmail}
              onChange={(value) => updateField("businessEmail", value)}
            />

            <Field
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={(value) => updateField("phone", value)}
            />

            <div className="sm:col-span-2">
              <Field
                label="Website"
                type="url"
                placeholder="https://example.com"
                value={form.website}
                onChange={(value) => updateField("website", value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Address"
                value={form.address}
                onChange={(value) => updateField("address", value)}
              />
            </div>

            <Field
              label="City"
              value={form.city}
              onChange={(value) => updateField("city", value)}
            />

            <Field
              label="State"
              value={form.state}
              onChange={(value) => updateField("state", value)}
            />

            <Field
              label="ZIP Code"
              value={form.zipCode}
              onChange={(value) => updateField("zipCode", value)}
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-[#ededed] bg-[#fbfbfb] px-5 py-4 sm:px-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={17} />
            ) : (
              <Save size={17} />
            )}

            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-800">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-950/5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
      />

      {helper && (
        <span className="mt-1.5 block text-xs text-gray-500">{helper}</span>
      )}
    </label>
  );
}
