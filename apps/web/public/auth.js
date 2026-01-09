"use strict";
(() => {
  // apps/web/src/scripts/api.ts
  var readApiBase = () => {
    const base = document.body.dataset.apiBase;
    return base && base.length > 0 ? base : "http://localhost:3000/api/v1";
  };
  var API_BASE2 = readApiBase();
  var parseErrorMessage = (payload) => {
    if (!payload?.message) {
      return "Ocurri\xF3 un error inesperado";
    }
    if (Array.isArray(payload.message)) {
      return payload.message.join(", ");
    }
    return payload.message;
  };
  var apiFetch = async (path, options) => {
    const response = await fetch(`${API_BASE2}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers ?? {}
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
  var getContainer = () => {
    let container = document.querySelector("[data-toast-container]");
    if (!container) {
      container = document.createElement("div");
      container.dataset.toastContainer = "true";
      container.className = "pointer-events-none fixed right-6 top-6 z-50 flex max-w-sm flex-col gap-3";
      document.body.append(container);
    }
    return container;
  };
  var showToast = (title, description, variant = "info") => {
    const container = getContainer();
    const toast = document.createElement("div");
    const variantClass = variant === "success" ? "toast-success" : variant === "error" ? "toast-error" : "";
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
  var setButtonLoading = (button, loading, text) => {
    if (loading) {
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
    } else {
      button.disabled = false;
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        button.dataset.originalText = "";
      }
    }
  };

  // apps/web/src/scripts/auth.ts
  var form = document.querySelector("[data-auth-form]");
  var messageEl = document.querySelector("[data-auth-message]");
  var redirectIfAuthenticated = async () => {
    if (!form) return false;
    try {
      const response = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
      if (!response.ok) {
        return false;
      }
      const payload = await response.json();
      if (payload?.id) {
        if (messageEl) {
          messageEl.textContent = "Ya tienes una sesi\xF3n activa. Redirigiendo...";
        }
        window.location.href = "/dashboard";
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
      const submitButton = form.querySelector("button[type='submit']");
      if (submitButton) {
        setButtonLoading(submitButton, true, "Ingresando");
      }
      const formData = new FormData(form);
      const payload = {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      };
      try {
        await apiFetch(`/auth/${mode}`, {
          method: "POST",
          body: JSON.stringify(payload)
        });
        localStorage.setItem("auth", "true");
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
})();
