import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { Resend } from "resend";
import prisma from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUCCESS_MESSAGE =
  "Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "")
      .toLowerCase()
      .trim();

    if (!email) {
      return NextResponse.json(
        { error: "El correo electrónico es requerido." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    /*
     * Siempre devolvemos el mismo mensaje para no revelar
     * si el correo está registrado.
     */
    if (!user) {
      return NextResponse.json({
        success: true,
        message: SUCCESS_MESSAGE,
      });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

    if (!resendApiKey || !fromEmail || !siteUrl) {
      console.error("Faltan variables de entorno para recuperar contraseña.");

      return NextResponse.json(
        { error: "El servicio de recuperación no está configurado." },
        { status: 500 },
      );
    }

    // Token original que recibirá el usuario
    const resetToken = randomBytes(32).toString("hex");

    // Hash que se guardará en la base de datos
    const tokenHash = createHash("sha256").update(resetToken).digest("hex");

    // El enlace tendrá una vigencia de una hora
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: tokenHash,
        passwordResetExpires: expirationDate,
      },
    });

    const resetUrl = `${siteUrl}/reset-password?token=${resetToken}`;

    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Restablece tu contraseña de Fideliza",
      text: `Solicitaste restablecer tu contraseña de Fideliza.

Abre este enlace para crear una contraseña nueva:
${resetUrl}

Este enlace vence en una hora.

Si no solicitaste este cambio, puedes ignorar este correo.`,

      html: `
        <div style="background:#f6f7f9;padding:40px 20px;font-family:Arial,sans-serif;color:#111827;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:36px;">
            <h1 style="margin:0 0 20px;font-size:26px;">
              Restablece tu contraseña
            </h1>

            <p style="font-size:16px;line-height:1.6;color:#4b5563;">
              Recibimos una solicitud para cambiar la contraseña de tu cuenta de Fideliza.
            </p>

            <div style="margin:30px 0;">
              <a
                href="${resetUrl}"
                style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:600;"
              >
                Crear contraseña nueva
              </a>
            </div>

            <p style="font-size:14px;line-height:1.6;color:#6b7280;">
              Este enlace vence en una hora. Si no solicitaste el cambio, puedes ignorar este correo.
            </p>

            <p style="margin-top:30px;font-size:13px;color:#9ca3af;">
              © Fideliza
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND PASSWORD RESET ERROR:", error);

      // Elimina el token porque el correo no pudo enviarse
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      return NextResponse.json(
        { error: "No fue posible enviar el correo. Intenta nuevamente." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      { error: "Ocurrió un error. Intenta nuevamente." },
      { status: 500 },
    );
  }
}
