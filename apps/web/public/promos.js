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
  const toastHost = document.createElement("div");
  toastHost.className = "toast-host";
  toastHost.setAttribute("aria-live", "polite");
  document.body.appendChild(toastHost);
  const promoTypeLabels = {
    discount: "Descuento",
    "2x1": "2x1",
    combo: "Combo",
    other: "Otra",
  };
  const toneMap = {
    pizza: { emoji: "🍕", tone: "promo-tone-sunset" },
    hamburguesas: { emoji: "🍔", tone: "promo-tone-berry" },
    sushi: { emoji: "🍣", tone: "promo-tone-sage" },
    tacos: { emoji: "🌮", tone: "promo-tone-sunrise" },
    parrilla: { emoji: "🥩", tone: "promo-tone-ember" },
    pollo: { emoji: "🍗", tone: "promo-tone-honey" },
    "comidas-rapidas": { emoji: "🍟", tone: "promo-tone-sunset" },
    asiatica: { emoji: "🥢", tone: "promo-tone-sage" },
    mexicana: { emoji: "🌶️", tone: "promo-tone-ember" },
    cafeteria: { emoji: "☕️", tone: "promo-tone-honey" },
    postres: { emoji: "🍰", tone: "promo-tone-berry" },
    panaderia: { emoji: "🥐", tone: "promo-tone-honey" },
    bebidas: { emoji: "🥤", tone: "promo-tone-sky" },
    arepas: { emoji: "🫓", tone: "promo-tone-sunrise" },
    mariscos: { emoji: "🦐", tone: "promo-tone-sky" },
    helados: { emoji: "🍦", tone: "promo-tone-berry" },
    vegana: { emoji: "🥗", tone: "promo-tone-lime" },
    ensaladas: { emoji: "🥬", tone: "promo-tone-lime" },
    desayunos: { emoji: "🥞", tone: "promo-tone-honey" },
  };
  const defaultTone = { emoji: "✨", tone: "promo-tone-sunrise" };
  const getPromoVisual = (category) => {
    if (!category) return defaultTone;
    return toneMap[category] || defaultTone;
  };
  const formatPromoType = (type) => promoTypeLabels[type] || type;
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastHost.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.add("toast-visible");
    });
    window.setTimeout(() => {
      toast.classList.remove("toast-visible");
      window.setTimeout(() => toast.remove(), 300);
    }, 2800);
  };
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
      .map((promo, index) => {
        const businessName = (promo.business && promo.business.name) || "Negocio local";
        const instagramHandle = String(
          (promo.business && promo.business.instagram) || ""
        )
          .replace("@", "")
          .trim();
        const categories = (promo.business && promo.business.categories) || [];
        const category = categories[0];
        const visual = getPromoVisual(category);
        const promoTypeLabel = formatPromoType(promo.promoType);
        const dateRange = `${new Date(promo.startDate).toLocaleDateString()} - ${new Date(
          promo.endDate
        ).toLocaleDateString()}`;
        const hours = `${promo.startHour} - ${promo.endHour}`;
        const days = promo.daysOfWeek.map((day) => day.slice(0, 3)).join(" · ");
        const value = promo.value ? `<span>${promo.value}</span>` : "";
        const categoryTags = categories
          .slice(0, 3)
          .map((item) => `<span class="promo-pill">#${item}</span>`)
          .join("");
        const instagramLink = instagramHandle
          ? `<a class="promo-link" href="https://instagram.com/${instagramHandle}" target="_blank" rel="noreferrer">@${instagramHandle}</a>`
          : "";
        const delay = Math.min(index * 60, 360);
        return `
          <article class="promo-card" data-promo-title="${promo.title}" data-promo-business="${businessName}" style="animation-delay:${delay}ms">
            <div class="promo-media ${visual.tone}">
              <span class="promo-emoji" aria-hidden="true">${visual.emoji}</span>
            </div>
            <div class="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-wide text-ink-900/50">${businessName}</p>
                <h3 class="text-lg font-semibold">${promo.title}</h3>
                <p class="text-sm text-ink-900/60">${promo.description ?? "Promoción vigente"}</p>
              </div>
              <span class="promo-badge">${promoTypeLabel}</span>
            </div>
            <div class="mt-3 flex flex-wrap gap-2 text-xs text-ink-900/60">
              <span class="promo-chip">${days}</span>
              <span class="promo-chip">${hours}</span>
              <span class="promo-chip">${dateRange}</span>
              ${value ? `<span class="promo-chip">${value}</span>` : ""}
            </div>
            <div class="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-900/60">
              <div class="flex flex-wrap gap-2">${categoryTags}</div>
              ${instagramLink}
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

  const updateLoadMore = (message, loadingState) => {
    if (!loadMore) return;
    if (!message) {
      loadMore.textContent = "";
      return;
    }
    loadMore.innerHTML = loadingState
      ? `<span class="promo-loader"><span class="spinner" aria-hidden="true"></span>${message}</span>`
      : message;
  };

  const fetchPromos = async (append) => {
    if (loading || (!hasMore && append)) {
      return;
    }
    loading = true;
    if (append) {
      updateLoadMore("Cargando más promociones...", true);
    } else {
      updateLoadMore("");
    }

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
    updateLoadMore("");
    fetchPromos(false);
  });

  const initialQuery = buildBaseQuery(new FormData(form));
  if (initialQuery) {
    baseQuery = initialQuery;
  }
  updateLoadMore("");
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

  container.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest("a")) {
      return;
    }
    const card = target.closest("[data-promo-title]");
    if (!card) return;
    const title = card.dataset.promoTitle || "Promo";
    const business = card.dataset.promoBusiness || "tu negocio favorito";
    const messages = [
      `¡Buen provecho! ${title} te espera en ${business}.`,
      `Plan perfecto: ${title}. Encuéntralo en ${business}.`,
      `Hoy toca antojo: ${title}. Dale un vistazo a ${business}.`,
      `Promo activada: ${title}. ${business} te espera.`,
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    showToast(message);
  });
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
