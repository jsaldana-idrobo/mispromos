export type ToastVariant = "success" | "error" | "info";

const getContainer = () => {
  let container = document.querySelector<HTMLDivElement>(
    "[data-toast-container]",
  );
  if (!container) {
    container = document.createElement("div");
    container.dataset.toastContainer = "true";
    container.className =
      "pointer-events-none fixed right-6 top-6 z-50 flex max-w-sm flex-col gap-3";
    document.body.append(container);
  }
  return container;
};

export const showToast = (
  title: string,
  description?: string,
  variant: ToastVariant = "info",
) => {
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

export const startButtonLoading = (
  button: HTMLButtonElement,
  text?: string,
) => {
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

export const stopButtonLoading = (button: HTMLButtonElement) => {
  button.disabled = false;
  if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
    button.dataset.originalText = "";
  }
};
