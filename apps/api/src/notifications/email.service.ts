import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  private getResendConfig() {
    const apiKey = this.configService.get<string>("RESEND_API_KEY");
    const from =
      this.configService.get<string>("RESEND_FROM") ??
      this.configService.get<string>("SMTP_FROM") ??
      this.configService.get<string>("SMTP_USER") ??
      "no-reply@mispromos.local";

    if (!apiKey || !from) {
      return null;
    }

    return { apiKey, from };
  }

  async sendApprovalEmail(payload: {
    to: string;
    businessName: string;
    password: string;
  }) {
    const resendConfig = this.getResendConfig();
    if (!resendConfig) {
      this.logger.warn(
        "RESEND_API_KEY no configurado, no se envia correo de aprobacion.",
      );
      return false;
    }

    const subject = "Tu cuenta de negocio fue aprobada";
    const text = `Hola ${payload.businessName},

Tu cuenta como negocio ha sido aprobada. Ya puedes iniciar sesion en Tus promos.
Tu contrasena registrada es: ${payload.password}

Entra a https://tuspromos.com/dashboard para gestionar tus promos, sedes y horarios.
Si necesitas ayuda, escribe a soporte@tuspromos.com.

Gracias por unirte a la plataforma.`;
    const html = `
      <div style="background:#f8f6f2;padding:32px 20px;font-family:Arial,sans-serif;color:#1f1f1f;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;padding:28px 26px;border:1px solid rgba(0,0,0,0.08);">
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="https://tuspromos.com/logo.png" alt="Tus promos" style="width:52px;height:52px;border-radius:14px;object-fit:contain;" />
            <div>
              <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#6b5d4f;">Tus promos</p>
              <p style="margin:0;font-size:12px;color:#9a8f85;">Facil y cerca de ti.</p>
            </div>
          </div>
          <h1 style="margin:18px 0 8px;font-size:22px;color:#1f1f1f;">Tu cuenta fue aprobada</h1>
          <p style="margin:0 0 14px;font-size:14px;color:#4a3f37;">
            Hola <strong>${payload.businessName}</strong>, ya puedes administrar tu negocio en Tus promos.
          </p>
          <div style="background:#f3efe9;border-radius:16px;padding:14px 16px;margin:16px 0;">
            <p style="margin:0;font-size:12px;color:#6b5d4f;">Contrasena registrada</p>
            <p style="margin:6px 0 0;font-size:16px;font-weight:700;color:#1f1f1f;">${payload.password}</p>
          </div>
          <p style="margin:0 0 16px;font-size:14px;color:#4a3f37;">
            Entra al panel para subir promos, sedes y horarios. Si necesitas ayuda,
            escribe a <strong>soporte@tuspromos.com</strong>.
          </p>
          <a href="https://tuspromos.com/dashboard" style="display:inline-block;background:#1f1f1f;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:13px;font-weight:700;">
            Ir al panel
          </a>
          <p style="margin:18px 0 0;font-size:11px;color:#8a817a;">
            Gracias por unirte a la comunidad de negocios locales.
          </p>
        </div>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendConfig.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendConfig.from,
        to: payload.to,
        subject,
        text,
        html,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      this.logger.warn(`Resend fallo: ${response.status} ${errorText}`);
      return false;
    }
    return true;
  }
}
