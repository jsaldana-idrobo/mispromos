import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  private createTransport() {
    const smtpUrl = this.configService.get<string>("SMTP_URL");
    if (smtpUrl) {
      try {
        const parsed = new URL(smtpUrl);
        if (parsed.protocol !== "smtp:" && parsed.protocol !== "smtps:") {
          this.logger.warn(
            "SMTP_URL debe usar smtp:// o smtps://, no http/https.",
          );
          return null;
        }
        const user =
          parsed.username.length > 0
            ? decodeURIComponent(parsed.username)
            : undefined;
        const pass =
          parsed.password.length > 0
            ? decodeURIComponent(parsed.password)
            : undefined;
        const port = parsed.port ? Number(parsed.port) : undefined;
        return nodemailer.createTransport({
          host: parsed.hostname,
          port,
          secure: parsed.protocol === "smtps:",
          auth: user && pass ? { user, pass } : undefined,
        });
      } catch {
        this.logger.warn("SMTP_URL invalida.");
        return null;
      }
    }

    const host = this.configService.get<string>("SMTP_HOST");
    const port = Number(this.configService.get<string>("SMTP_PORT") ?? "587");
    const user = this.configService.get<string>("SMTP_USER");
    const pass = this.configService.get<string>("SMTP_PASS");
    const from =
      this.configService.get<string>("SMTP_FROM") ??
      this.configService.get<string>("SMTP_USER");

    if (!host || !from) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
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
