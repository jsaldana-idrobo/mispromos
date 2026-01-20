import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  private buildEnvTransportConfig() {
    const host = this.configService.get<string>("SMTP_HOST");
    const port = Number(this.configService.get<string>("SMTP_PORT") ?? "465");
    const user = this.configService.get<string>("SMTP_USER");
    const pass = this.configService.get<string>("SMTP_PASS");
    const from =
      this.configService.get<string>("SMTP_FROM") ??
      this.configService.get<string>("SMTP_USER");

    if (!host || !from) {
      return null;
    }

    if (port !== 465) {
      this.logger.warn(
        "SMTP_PORT debe ser 465 para conexiones TLS seguras.",
      );
      return null;
    }

    return {
      host,
      port,
      secure: true,
      requireTLS: true,
      auth: user && pass ? { user, pass } : undefined,
    };
  }

  private createTransport() {
    const config = this.buildEnvTransportConfig();
    return config ? nodemailer.createTransport(config) : null;
  }

  async sendApprovalEmail(payload: {
    to: string;
    businessName: string;
    password: string;
  }) {
    const transporter = this.createTransport();
    if (!transporter) {
      this.logger.warn("SMTP no configurado, no se envia correo de aprobacion.");
      return false;
    }

    const from =
      this.configService.get<string>("SMTP_FROM") ??
      this.configService.get<string>("SMTP_USER") ??
      "no-reply@mispromos.local";

    const subject = "Tu cuenta de negocio fue aprobada";
    const text = `Hola ${payload.businessName},

Tu cuenta como negocio ha sido aprobada. Ya puedes iniciar sesion en Tus promos.
Tu contrasena registrada es: ${payload.password}

Gracias por unirte a la plataforma.`;

    await transporter.sendMail({
      from,
      to: payload.to,
      subject,
      text,
    });
    return true;
  }
}
