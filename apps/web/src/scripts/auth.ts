import { apiFetch } from "./api";
import { showToast, setButtonLoading } from "./ui";

type AuthResponse = {
  id: string;
  email: string;
  role: string;
};

const form = document.querySelector<HTMLFormElement>("[data-auth-form]");
const messageEl = document.querySelector<HTMLElement>("[data-auth-message]");

if (form) {
  const mode = form.dataset.mode === "register" ? "register" : "login";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (messageEl) {
      messageEl.textContent = "Procesando...";
    }
    const submitButton = form.querySelector<HTMLButtonElement>("button[type='submit']");
    if (submitButton) {
      setButtonLoading(submitButton, true, "Ingresando");
    }

    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      await apiFetch<AuthResponse>(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      showToast("Listo", "Bienvenido a Mis promos.", "success");
      window.location.href = "/dashboard";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al autenticar";
      if (messageEl) {
        messageEl.textContent = message;
      }
      showToast("Error", message, "error");
    } finally {
      if (submitButton) {
        setButtonLoading(submitButton, false);
      }
    }
  });
}
