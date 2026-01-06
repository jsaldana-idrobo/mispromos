const readApiBase = () => {
  const base = document.body?.dataset?.apiBase;
  return base && base.length > 0 ? base : "http://localhost:3000/api/v1";
};

const API_BASE = readApiBase();

const parseErrorMessage = (payload) => {
  if (!payload || !payload.message) {
    return "Ocurrio un error inesperado";
  }
  if (Array.isArray(payload.message)) {
    return payload.message.join(", ");
  }
  return payload.message;
};

const apiFetch = async (path, options) => {
  const method = options && options.method ? options.method : "GET";
  const headers = {
    ...(options && options.headers ? options.headers : {}),
  };
  if (method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers,
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : undefined;

  if (!response.ok) {
    const message = parseErrorMessage(payload);
    throw new Error(message);
  }

  return isJson ? payload : undefined;
};

const form = document.querySelector("[data-promos-form]");
const container = document.querySelector("[data-promos-container]");
const categorySelect = document.querySelector("[data-category-select]");
const citySelect = document.querySelector("[data-city-select]");

if (form && container) {
  const renderMessage = (message) => {
    container.innerHTML = `<div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">${message}</div>`;
  };
  const renderLoading = (message) => {
    container.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70 flex items-center gap-3">
        <span class="spinner" aria-hidden="true"></span>
        <span>${message}</span>
      </div>
    `;
  };

  const renderPromos = (promos) => {
    if (!Array.isArray(promos) || promos.length === 0) {
      renderMessage("No encontramos promos activas con esos filtros.");
      return;
    }

    container.innerHTML = promos
      .map((promo) => {
        const dateRange = `${new Date(promo.startDate).toLocaleDateString()} - ${new Date(
          promo.endDate
        ).toLocaleDateString()}`;
        const hours = `${promo.startHour} - ${promo.endHour}`;
        const days = promo.daysOfWeek.map((day) => day.slice(0, 3)).join(" · ");
        const value = promo.value ? `<span>${promo.value}</span>` : "";
        return `
          <article class="rounded-3xl border border-ink-900/10 bg-white/80 p-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold">${promo.title}</h3>
                <p class="text-sm text-ink-900/60">${promo.description ?? "Promocion vigente"}</p>
              </div>
              <span class="rounded-full border border-ink-900/10 px-3 py-1 text-xs uppercase">
                ${promo.promoType}
              </span>
            </div>
            <div class="mt-3 flex flex-wrap gap-3 text-xs text-ink-900/60">
              <span class="rounded-full border border-ink-900/10 px-3 py-1">${days}</span>
              <span class="rounded-full border border-ink-900/10 px-3 py-1">${hours}</span>
              <span class="rounded-full border border-ink-900/10 px-3 py-1">${dateRange}</span>
              ${value ? `<span class="rounded-full border border-ink-900/10 px-3 py-1">${value}</span>` : ""}
            </div>
          </article>
        `;
      })
      .join("");
  };

  const loadPromos = async (formData) => {
    const city = String(formData.get("city") || "").trim();
    const atValue = String(formData.get("at") || "").trim();
    const promoType = String(formData.get("promoType") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const businessType = String(formData.get("businessType") || "").trim();
    const queryText = String(formData.get("q") || "").trim();

    renderLoading("Cargando promociones...");
    const atDate = atValue ? new Date(atValue) : undefined;
    if (atDate && Number.isNaN(atDate.valueOf())) {
      renderMessage("Formato de fecha invalido.");
      return;
    }

    try {
      const query = new URLSearchParams();
      if (city) {
        query.set("city", city);
      }
      if (atDate) {
        query.set("at", atDate.toISOString());
      }
      if (promoType) {
        query.set("promoType", promoType);
      }
      if (category) {
        query.set("category", category);
      }
      if (businessType) {
        query.set("businessType", businessType);
      }
      if (queryText) {
        query.set("q", queryText);
      }
      const queryString = query.toString();
      const promos = await apiFetch(
        `/promotions/active${queryString ? `?${queryString}` : ""}`
      );
      renderPromos(promos);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error consultando promociones";
      renderMessage(message);
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    loadPromos(new FormData(form));
  });

  loadPromos(new FormData(form));
}

if (categorySelect) {
  categorySelect.disabled = true;
  categorySelect.innerHTML = `<option value="">Cargando categorias...</option>`;
  apiFetch("/categories")
    .then((categories) => {
      categorySelect.innerHTML = [
        `<option value=\"\">Todas</option>`,
        ...categories.map((category) => `<option value=\"${category.slug}\">${category.name}</option>`),
      ].join("");
      categorySelect.disabled = false;
    })
    .catch(() => {
      categorySelect.innerHTML = `<option value=\"\">Todas</option>`;
      categorySelect.disabled = false;
    });
}

if (citySelect) {
  const initialCity = citySelect.dataset.initialCity || "";
  citySelect.disabled = true;
  citySelect.innerHTML = `<option value="">Cargando ciudades...</option>`;
  apiFetch("/cities")
    .then((cities) => {
      const options = cities.map((city) => `<option value=\"${city.name}\">${city.name}</option>`);
      citySelect.innerHTML = [`<option value=\"\">Todas</option>`, ...options].join("");
      if (initialCity) {
        citySelect.value = initialCity;
      }
      citySelect.disabled = false;
    })
    .catch(() => {
      citySelect.innerHTML = `<option value=\"\">Todas</option>`;
      citySelect.disabled = false;
    });
}
