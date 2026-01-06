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
const loadMore = document.querySelector("[data-promos-load-more]");
const counter = document.querySelector("[data-promos-counter]");

const PAGE_SIZE = 10;

if (form && container) {
  let loading = false;
  let hasMore = true;
  let offset = 0;
  let totalLoaded = 0;
  let baseQuery = new URLSearchParams();
  const renderMessage = (message) => {
    container.innerHTML = `<div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">${message}</div>`;
    if (counter) {
      counter.textContent = "";
    }
  };
  const renderLoading = (message) => {
    container.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70 flex items-center gap-3">
        <span class="spinner" aria-hidden="true"></span>
        <span>${message}</span>
      </div>
    `;
  };

  const renderPromos = (promos, append) => {
    if ((!Array.isArray(promos) || promos.length === 0) && !append) {
      renderMessage("No encontramos promos activas con esos filtros.");
      return;
    }

    const html = promos
      .map((promo) => {
        const dateRange = `${new Date(promo.startDate).toLocaleDateString()} - ${new Date(
          promo.endDate
        ).toLocaleDateString()}`;
        const hours = `${promo.startHour} - ${promo.endHour}`;
        const days = promo.daysOfWeek.map((day) => day.slice(0, 3)).join(" · ");
        const value = promo.value ? `<span>${promo.value}</span>` : "";
        return `
          <article class="rounded-3xl border border-ink-900/10 bg-white/80 p-4 shadow-sm">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold">${promo.title}</h3>
                <p class="text-sm text-ink-900/60">${promo.description ?? "Promoción vigente"}</p>
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
    if (append) {
      container.insertAdjacentHTML("beforeend", html);
    } else {
      container.innerHTML = html;
    }
  };

  const buildBaseQuery = (formData) => {
    const city = String(formData.get("city") || "").trim();
    const atValue = String(formData.get("at") || "").trim();
    const promoType = String(formData.get("promoType") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const queryText = String(formData.get("q") || "").trim();

    const atDate = atValue ? new Date(atValue) : undefined;
    if (atDate && Number.isNaN(atDate.valueOf())) {
      renderMessage("Formato de fecha inválido.");
      return null;
    }

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
    if (queryText) {
      query.set("q", queryText);
    }
    return query;
  };

  const updateCounter = () => {
    if (!counter) return;
    counter.textContent = totalLoaded > 0 ? `${totalLoaded} promociones cargadas` : "";
  };

  const updateLoadMore = (message) => {
    if (loadMore) {
      loadMore.textContent = message;
    }
  };

  const fetchPromos = async (append) => {
    if (loading || (!hasMore && append)) {
      return;
    }
    loading = true;
    updateLoadMore("Cargando más promociones...");

    try {
      const query = new URLSearchParams(baseQuery);
      query.set("offset", String(offset));
      query.set("limit", String(PAGE_SIZE));
      const queryString = query.toString();
      const promos = await apiFetch(
        `/promotions/active${queryString ? `?${queryString}` : ""}`
      );
      if (!append) {
        totalLoaded = 0;
        offset = 0;
      }
      if (!append && promos.length === 0) {
        renderMessage("No encontramos promos activas con esos filtros.");
        updateLoadMore("");
        hasMore = false;
        return;
      }
      renderPromos(promos, append);
      totalLoaded += promos.length;
      offset += promos.length;
      updateCounter();
      hasMore = promos.length === PAGE_SIZE;
      updateLoadMore(hasMore ? "Desliza para cargar más." : "No hay más promociones.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error consultando promociones";
      renderMessage(message);
      updateLoadMore("");
    } finally {
      loading = false;
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nextBaseQuery = buildBaseQuery(new FormData(form));
    if (!nextBaseQuery) {
      return;
    }
    baseQuery = nextBaseQuery;
    hasMore = true;
    offset = 0;
    totalLoaded = 0;
    renderLoading("Cargando promociones...");
    fetchPromos(false);
  });

  const initialQuery = buildBaseQuery(new FormData(form));
  if (initialQuery) {
    baseQuery = initialQuery;
  }
  fetchPromos(false);

  if (loadMore) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchPromos(true);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMore);
  }
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
