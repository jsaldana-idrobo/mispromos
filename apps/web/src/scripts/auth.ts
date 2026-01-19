import { apiFetch } from "./api";
import { showToast, startButtonLoading, stopButtonLoading } from "./ui";

type AuthResponse = {
  id: string;
  email: string;
  role: string;
};

const form = document.querySelector<HTMLFormElement>("[data-auth-form]");
const messageEl = document.querySelector<HTMLElement>("[data-auth-message]");
const emailInput = form?.querySelector<HTMLInputElement>("input[name='email']");
const passwordInput = form?.querySelector<HTMLInputElement>(
  "input[name='password']",
);

const redirectIfAuthenticated = async () => {
  if (!form) return false;
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      credentials: "include",
    });
    if (!response.ok) {
      return false;
    }
    const payload = (await response.json()) as AuthResponse | null;
    if (payload?.id) {
      if (messageEl) {
        messageEl.textContent = "Ya tienes una sesión activa. Redirigiendo...";
      }
      globalThis.location.href = "/dashboard";
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

if (form) {
  const mode = form.dataset.mode === "register" ? "register" : "login";
  const isRegister = mode === "register";

  redirectIfAuthenticated();

  const clearCustomValidity = () => {
    emailInput?.setCustomValidity("");
    passwordInput?.setCustomValidity("");
  };

  const validateAuthFields = () => {
    if (!emailInput || !passwordInput) return true;
    clearCustomValidity();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;
    if (!emailValue) {
      emailInput.setCustomValidity("El email es obligatorio.");
    } else if (emailInput.validity.typeMismatch) {
      emailInput.setCustomValidity("Ingresa un email valido.");
    }
    if (!passwordValue) {
      passwordInput.setCustomValidity("La contrasena es obligatoria.");
    } else if (passwordValue.length < 8) {
      passwordInput.setCustomValidity(
        "La contrasena debe tener al menos 8 caracteres.",
      );
    }
    const isValid = form.checkValidity();
    if (!isValid) {
      form.reportValidity();
      const message =
        emailInput.validationMessage ||
        passwordInput.validationMessage ||
        "Revisa los campos del formulario.";
      if (messageEl) {
        messageEl.textContent = message;
      }
      showToast("Error", message, "error");
    }
    return isValid;
  };

  emailInput?.addEventListener("input", () => {
    emailInput.setCustomValidity("");
  });
  passwordInput?.addEventListener("input", () => {
    passwordInput.setCustomValidity("");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateAuthFields()) {
      return;
    }
    if (messageEl) {
      messageEl.textContent = "Procesando...";
    }
    const submitButton = form.querySelector<HTMLButtonElement>(
      "button[type='submit']",
    );
    if (submitButton) {
      startButtonLoading(submitButton, isRegister ? "Enviando" : "Ingresando");
    }

    const formData = new FormData(form);
    const getField = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value : "";
    };
    const payload: Record<string, unknown> = {
      email: getField("email"),
      password: getField("password"),
    };
    if (isRegister) {
      const categoryValues = Array.from(
        form.querySelectorAll<HTMLSelectElement>(
          "[name='categories'] option:checked",
        ),
      )
        .map((option) => option.value)
        .filter(Boolean);
      payload.name = getField("name");
      payload.slug = getField("slug");
      payload.type = getField("type");
      payload.categories = categoryValues;
      payload.description = getField("description");
      payload.instagram = getField("instagram");
    }

    try {
      await apiFetch<AuthResponse | { ok: true }>(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (isRegister) {
        showToast(
          "Solicitud enviada",
          "Te avisaremos cuando tu negocio sea aprobado.",
          "success",
        );
        if (messageEl) {
          messageEl.textContent =
            "Solicitud enviada. Te avisaremos por correo cuando sea aprobada.";
        }
        form.reset();
      } else {
        try {
          localStorage.setItem("auth", "true");
        } catch {
          // ignore storage errors
        }
        showToast("Listo", "Bienvenido a Tus promos.", "success");
        globalThis.location.href = "/dashboard";
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al autenticar";
      if (messageEl) {
        messageEl.textContent = message;
      }
      showToast("Error", message, "error");
    } finally {
      if (submitButton) {
        stopButtonLoading(submitButton);
      }
    }
  });
}
