// apps/web/src/scripts/api.ts
let readApiBase = () => {
  const base = document.body.dataset.apiBase;
  return base && base.length > 0 ? base : "http://localhost:3000/api/v1";
};
let API_BASE2 = readApiBase();
let parseErrorMessage = (payload) => {
  if (!payload?.message) {
    return "Ocurri\xF3 un error inesperado";
  }
  if (Array.isArray(payload.message)) {
    return payload.message.join(", ");
  }
  return payload.message;
};
let apiFetch = async (path, options) => {
  const response = await fetch(`${API_BASE2}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : void 0;
  if (!response.ok) {
    const message = parseErrorMessage(payload);
    throw new Error(message);
  }
  if (!isJson) {
    return void 0;
  }
  return payload;
};

// apps/web/src/scripts/ui.ts
let getContainer = () => {
  let container = document.querySelector(
    "[data-toast-container]"
  );
  if (!container) {
    container = document.createElement("div");
    container.dataset.toastContainer = "true";
    container.className = "pointer-events-none fixed right-6 top-6 z-50 flex max-w-sm flex-col gap-3";
    document.body.append(container);
  }
  return container;
};
let showToast = (title, description, variant = "info") => {
  const container = getContainer();
  const toast = document.createElement("div");
  let variantClass = "";
  if (variant === "success") {
    variantClass = "toast-success";
  } else if (variant === "error") {
    variantClass = "toast-error";
  }
  toast.className = `toast ${variantClass}`;
  toast.innerHTML = `
    <div>
      <p class="toast-title">${title}</p>
      ${description ? `<p class="text-xs text-ink-900/60">${description}</p>` : ""}
    </div>
  `;
  container.append(toast);
  setTimeout(() => {
    toast.remove();
  }, 3600);
};
let startButtonLoading = (button, text) => {
  button.dataset.originalText = button.textContent ?? "";
  button.disabled = true;
  button.innerHTML = `
    <span class="loader">
      <span class="loader-dot"></span>
      <span class="loader-dot"></span>
      <span class="loader-dot"></span>
      ${text ?? "Procesando"}
    </span>
  `;
};
let stopButtonLoading = (button) => {
  button.disabled = false;
  if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
    button.dataset.originalText = "";
  }
};

// apps/web/src/scripts/auth.ts
let form = document.querySelector("[data-auth-form]");
let messageEl = document.querySelector("[data-auth-message]");
let redirectIfAuthenticated = async () => {
  if (!form) return false;
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      credentials: "include"
    });
    if (!response.ok) {
      return false;
    }
    const payload = await response.json();
    if (payload?.id) {
      if (messageEl) {
        messageEl.textContent = "Ya tienes una sesi\xF3n activa. Redirigiendo...";
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
  redirectIfAuthenticated();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (messageEl) {
      messageEl.textContent = "Procesando...";
    }
    const submitButton = form.querySelector(
      "button[type='submit']"
    );
    if (submitButton) {
      startButtonLoading(submitButton, "Ingresando");
    }
    const formData = new FormData(form);
    const getField = (key) => {
      const value = formData.get(key);
      return typeof value === "string" ? value : "";
    };
    const payload = {
      email: getField("email"),
      password: getField("password")
    };
    try {
      await apiFetch(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      try {
        localStorage.setItem("auth", "true");
      } catch {
      }
      showToast("Listo", "Bienvenido a Tus promos.", "success");
      globalThis.location.href = "/dashboard";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al autenticar";
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
