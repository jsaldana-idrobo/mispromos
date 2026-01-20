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

Gracias por unirte a la plataforma.`;

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
