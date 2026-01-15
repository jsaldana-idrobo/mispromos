// apps/web/src/scripts/api.ts
var readApiBase = () => {
  const base = document.body.dataset.apiBase;
  return base && base.length > 0 ? base : "http://localhost:3000/api/v1";
};
var API_BASE = readApiBase();
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
  const response = await fetch(`${API_BASE}${path}`, {
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

// apps/web/src/scripts/promos/formatters.ts
var promoTypeLabels = {
  discount: "Descuento",
  "2x1": "2x1",
  combo: "Combo",
  other: "Otra"
};
var toneMap = {
  pizza: { emoji: "\u{1F355}", tone: "promo-tone-sunset" },
  hamburguesas: { emoji: "\u{1F354}", tone: "promo-tone-berry" },
  sushi: { emoji: "\u{1F363}", tone: "promo-tone-sage" },
  tacos: { emoji: "\u{1F32E}", tone: "promo-tone-sunrise" },
  parrilla: { emoji: "\u{1F969}", tone: "promo-tone-ember" },
  pollo: { emoji: "\u{1F357}", tone: "promo-tone-honey" },
  "comidas-rapidas": { emoji: "\u{1F35F}", tone: "promo-tone-sunset" },
  asiatica: { emoji: "\u{1F962}", tone: "promo-tone-sage" },
  mexicana: { emoji: "\u{1F336}\uFE0F", tone: "promo-tone-ember" },
  cafeteria: { emoji: "\u2615\uFE0F", tone: "promo-tone-honey" },
  postres: { emoji: "\u{1F370}", tone: "promo-tone-berry" },
  panaderia: { emoji: "\u{1F950}", tone: "promo-tone-honey" },
  bebidas: { emoji: "\u{1F964}", tone: "promo-tone-sky" },
  arepas: { emoji: "\u{1FAD3}", tone: "promo-tone-sunrise" },
  mariscos: { emoji: "\u{1F990}", tone: "promo-tone-sky" },
  helados: { emoji: "\u{1F366}", tone: "promo-tone-berry" },
  vegana: { emoji: "\u{1F957}", tone: "promo-tone-lime" },
  ensaladas: { emoji: "\u{1F96C}", tone: "promo-tone-lime" },
  desayunos: { emoji: "\u{1F95E}", tone: "promo-tone-honey" }
};
var defaultTone = { emoji: "\u2728", tone: "promo-tone-sunrise" };
var dayLabels = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Mi\xE9rcoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "S\xE1bado",
  sunday: "Domingo"
};
var orderedDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];
var getPromoVisual = (category) => {
  if (!category) return defaultTone;
  return toneMap[category] ?? defaultTone;
};
var formatPromoType = (type) => promoTypeLabels[type] ?? type;
var formatDaysShort = (days) => orderedDays.filter((day) => days.includes(day)).map((day) => dayLabels[day] ?? day).join(" \xB7 ");
var formatDaysFull = (days) => {
  const daySet = new Set(days);
  const hasWeekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"].every(
    (day) => daySet.has(day)
  ) && daySet.size === 5;
  const hasWeekend = ["friday", "saturday", "sunday"].every((day) => daySet.has(day)) && daySet.size === 3;
  if (daySet.size === 7) {
    return "Todos los d\xEDas";
  }
  if (hasWeekdays) {
    return "Entre semana";
  }
  if (hasWeekend) {
    return "Fin de semana";
  }
  return orderedDays.filter((day) => daySet.has(day)).map((day) => dayLabels[day] ?? day).join(", ");
};

// apps/web/src/scripts/promos/filters.ts
var initFiltersToggle = (filtersToggle2, filtersBody2) => {
  if (!filtersToggle2 || !filtersBody2) return;
  const updateFiltersToggle = (isOpen) => {
    filtersBody2.classList.toggle("hidden", !isOpen);
    filtersBody2.toggleAttribute("hidden", !isOpen);
    filtersToggle2.textContent = isOpen ? "Ocultar" : "Mostrar";
    filtersToggle2.setAttribute("aria-expanded", String(isOpen));
  };
  filtersBody2.classList.add("hidden");
  filtersBody2.setAttribute("hidden", "true");
  updateFiltersToggle(false);
  filtersToggle2.addEventListener("click", () => {
    const isOpen = !filtersBody2.classList.contains("hidden");
    updateFiltersToggle(!isOpen);
  });
};

// apps/web/src/scripts/promos/modal.ts
var setModalFieldVisibility = (wrapper, value) => {
  if (!wrapper) return;
  if (!value) {
    wrapper.classList.add("hidden");
    return;
  }
  wrapper.classList.remove("hidden");
};
var getTagsHtml = (categories) => {
  if (categories.length === 0) {
    return `<span class="promo-pill">#local</span>`;
  }
  return categories.slice(0, 4).map((item) => `<span class="promo-pill">#${item}</span>`).join("");
};
var updateInstagram = (elements, handle) => {
  if (!elements.instagram) return;
  if (handle) {
    elements.instagram.textContent = `@${handle}`;
    elements.instagram.href = `https://instagram.com/${handle}`;
  } else {
    elements.instagram.textContent = "";
    elements.instagram.removeAttribute("href");
  }
  setModalFieldVisibility(elements.fieldInstagram, handle || null);
};
var updateMedia = (elements, promo, emoji) => {
  if (elements.image) {
    elements.image.classList.remove("is-contain");
  }
  if (promo.imageUrl) {
    if (elements.image) {
      elements.image.src = promo.imageUrl;
      elements.image.classList.remove("hidden");
    }
    if (elements.emoji) {
      elements.emoji.textContent = "";
      elements.emoji.classList.add("hidden");
    }
    return;
  }
  if (elements.image) {
    elements.image.removeAttribute("src");
    elements.image.classList.add("hidden");
  }
  if (elements.emoji) {
    elements.emoji.textContent = emoji;
    elements.emoji.classList.remove("hidden");
  }
};
var updateTextFields = (elements, promo, businessName, promoTypeLabel, days, tagsHtml) => {
  if (elements.title) elements.title.textContent = promo.title;
  if (elements.featured) {
    elements.featured.classList.toggle("hidden", !promo.featured);
  }
  if (elements.business) elements.business.textContent = businessName;
  if (elements.description) {
    elements.description.textContent = promo.description ?? "Promoci\xF3n vigente.";
  }
  if (elements.promoType) elements.promoType.textContent = promoTypeLabel;
  if (elements.value) elements.value.textContent = String(promo.value ?? "");
  if (elements.days) elements.days.textContent = days;
  if (elements.tags) {
    elements.tags.innerHTML = tagsHtml;
  }
  setModalFieldVisibility(
    elements.fieldValue,
    promo.value ? String(promo.value) : null
  );
};
var createPromoModal = (elements) => {
  const open = (promo) => {
    if (!elements.overlay || !elements.modal) return;
    const businessName = promo.business?.name ?? "Negocio local";
    const categories = promo.business?.categories ?? [];
    const category = categories[0];
    const visual = getPromoVisual(category);
    const promoTypeLabel = formatPromoType(promo.promoType);
    const days = formatDaysFull(promo.daysOfWeek);
    const tagsHtml = getTagsHtml(categories);
    const instagramHandle = (promo.business?.instagram ?? "").replaceAll("@", "").trim();
    updateTextFields(
      elements,
      promo,
      businessName,
      promoTypeLabel,
      days,
      tagsHtml
    );
    updateInstagram(elements, instagramHandle);
    updateMedia(elements, promo, visual.emoji);
    elements.overlay.hidden = false;
    elements.overlay.classList.remove("hidden");
  };
  const close = () => {
    if (!elements.overlay) return;
    elements.overlay.classList.add("hidden");
    elements.overlay.hidden = true;
  };
  const bind = () => {
    elements.close?.addEventListener("click", close);
    elements.overlay?.addEventListener("click", (event) => {
      if (event.target === elements.overlay) {
        close();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
      }
    });
    elements.image?.addEventListener("click", (event) => {
      event.stopPropagation();
      elements.image?.classList.toggle("is-contain");
    });
  };
  return { open, close, bind };
};

// apps/web/src/scripts/promos.ts
var form = document.querySelector("[data-promos-form]");
var container = document.querySelector(
  "[data-promos-container]"
);
var loadingBlock = document.querySelector(
  "[data-promos-loading]"
);
var contentBlock = document.querySelector(
  "[data-promos-content]"
);
var featuredSection = document.querySelector(
  "[data-promos-featured-section]"
);
var featuredContainer = document.querySelector(
  "[data-promos-featured]"
);
var categorySelect = document.querySelector(
  "[data-category-select]"
);
var citySelect = document.querySelector("[data-city-select]");
var loadMore = document.querySelector(
  "[data-promos-load-more]"
);
var counter = document.querySelector(
  "[data-promos-counter]"
);
var filtersToggle = document.querySelector(
  "[data-promos-filters-toggle]"
);
var filtersBody = document.querySelector(
  "[data-promos-filters-body]"
);
var promoModalOverlay = document.querySelector(
  "[data-promos-modal-overlay]"
);
var promoModalElement = document.querySelector(
  "[data-promos-modal]"
);
var promoModalClose = document.querySelector(
  "[data-promos-modal-close]"
);
var promoModalTitle = document.querySelector(
  "[data-promos-modal-title]"
);
var promoModalFeatured = document.querySelector(
  "[data-promos-modal-featured]"
);
var promoModalBusiness = document.querySelector(
  "[data-promos-modal-business]"
);
var promoModalDescription = document.querySelector(
  "[data-promos-modal-description]"
);
var promoModalTags = document.querySelector(
  "[data-promos-modal-tags]"
);
var promoModalType = document.querySelector(
  "[data-promos-modal-type]"
);
var promoModalValue = document.querySelector(
  "[data-promos-modal-value]"
);
var promoModalDays = document.querySelector(
  "[data-promos-modal-days]"
);
var promoModalInstagram = document.querySelector(
  "[data-promos-modal-instagram]"
);
var promoModalImage = document.querySelector(
  "[data-promos-modal-image]"
);
var promoModalEmoji = document.querySelector(
  "[data-promos-modal-emoji]"
);
var promoModalFieldValue = document.querySelector(
  '[data-promos-modal-field="value"]'
);
var promoModalFieldInstagram = document.querySelector(
  '[data-promos-modal-field="instagram"]'
);
var PAGE_SIZE = 10;
var FEATURED_COUNT = 6;
if (form && container) {
  let loading = false;
  let hasMore = true;
  let offset = 0;
  let totalLoaded = 0;
  let totalRegular = 0;
  let totalFeatured = 0;
  let baseQuery = new URLSearchParams();
  let loadToken = 0;
  const promoModal = createPromoModal({
    overlay: promoModalOverlay,
    modal: promoModalElement,
    close: promoModalClose,
    title: promoModalTitle,
    featured: promoModalFeatured,
    business: promoModalBusiness,
    description: promoModalDescription,
    tags: promoModalTags,
    promoType: promoModalType,
    value: promoModalValue,
    days: promoModalDays,
    instagram: promoModalInstagram,
    image: promoModalImage,
    emoji: promoModalEmoji,
    fieldValue: promoModalFieldValue,
    fieldInstagram: promoModalFieldInstagram
  });
  const promosById = /* @__PURE__ */ new Map();
  const featuredIds = /* @__PURE__ */ new Set();
  const setContentLoading = (isLoading) => {
    if (loadingBlock) {
      loadingBlock.classList.toggle("hidden", !isLoading);
      loadingBlock.toggleAttribute("hidden", !isLoading);
    }
    if (contentBlock) {
      contentBlock.classList.toggle("hidden", isLoading);
      contentBlock.toggleAttribute("hidden", isLoading);
    }
  };
  const resetResults = () => {
    container.innerHTML = "";
    promosById.clear();
    if (featuredContainer) {
      featuredIds.clear();
      featuredContainer.innerHTML = "";
    }
    if (featuredSection) {
      featuredSection.classList.add("hidden");
    }
    if (counter) {
      counter.textContent = "";
    }
    totalRegular = 0;
    totalFeatured = 0;
  };
  const renderMessage = (message) => {
    resetResults();
    container.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-white px-4 py-3 text-sm text-ink-900/70">${message}</div>
    `;
    setContentLoading(false);
  };
  const startPrimaryLoad = () => {
    resetResults();
    setContentLoading(true);
    updateLoadMore("");
  };
  const runPrimaryLoad = async () => {
    loadToken += 1;
    const token = loadToken;
    startPrimaryLoad();
    await Promise.allSettled([fetchFeaturedPromos(), fetchPromos(false)]);
    if (token === loadToken) {
      setContentLoading(false);
    }
  };
  initFiltersToggle(filtersToggle, filtersBody);
  promoModal.bind();
  const buildPromoCard = (promo, index, isFeatured) => {
    const businessName = promo.business?.name ?? "Negocio local";
    const instagramHandle = (promo.business?.instagram ?? "").replaceAll("@", "").trim();
    const categories = promo.business?.categories ?? [];
    const category = categories[0];
    const visual = getPromoVisual(category);
    const days = formatDaysShort(promo.daysOfWeek);
    const value = promo.value ? `<span>${promo.value}</span>` : "";
    const categoryTags = categories.slice(0, 3).map((item) => `<span class="promo-pill">#${item}</span>`).join("");
    const delay = Math.min(index * 60, 360);
    const media = promo.imageUrl ? `<img class="promo-image" src="${promo.imageUrl}" alt="${promo.title}" loading="lazy" />` : `<span class="promo-emoji" aria-hidden="true">${visual.emoji}</span>`;
    const cardClass = isFeatured ? "promo-card promo-card--featured" : "promo-card";
    if (isFeatured) {
      return `
      <article class="${cardClass}" data-promo-id="${promo._id}" data-promo-title="${promo.title}" data-promo-business="${businessName}" style="animation-delay:${delay}ms">
        <div class="promo-media ${visual.tone}">
          ${media}
        </div>
        <div class="mt-3">
          <h3 class="text-sm font-semibold">${promo.title}</h3>
        </div>
      </article>
    `;
    }
    const instagramLink = instagramHandle ? `<a class="promo-link" href="https://instagram.com/${instagramHandle}" target="_blank" rel="noreferrer">@${instagramHandle}</a>` : "";
    const featuredBadge = isFeatured ? `<span class="promo-badge promo-badge-featured">Destacada</span>` : "";
    return `
      <article class="${cardClass}" data-promo-id="${promo._id}" data-promo-title="${promo.title}" data-promo-business="${businessName}" style="animation-delay:${delay}ms">
        <div class="promo-media ${visual.tone}">
          ${media}
        </div>
        <div class="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-wide text-ink-900/50">${businessName}</p>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-lg font-semibold">${promo.title}</h3>
              ${featuredBadge}
            </div>
            <p class="text-sm text-ink-900/60">${promo.description ?? "Promoci\xF3n vigente"}</p>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-xs text-ink-900/60">
          <span class="promo-chip">${days}</span>
          ${value ? `<span class="promo-chip">${value}</span>` : ""}
        </div>
        <div class="mt-3 flex flex-col gap-3 text-xs text-ink-900/60 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-wrap gap-2">${categoryTags}</div>
          <div class="w-full sm:w-auto">${instagramLink}</div>
        </div>
      </article>
    `;
  };
  const renderFeaturedPromos = (promos) => {
    if (!featuredContainer || !featuredSection) return;
    featuredIds.clear();
    promos.forEach((promo) => {
      promosById.set(promo._id, promo);
    });
    const featuredHtml = promos.slice(0, FEATURED_COUNT).map((promo, index) => {
      featuredIds.add(promo._id);
      return buildPromoCard(promo, index, true);
    });
    featuredContainer.innerHTML = featuredHtml.join("");
    featuredSection.classList.toggle("hidden", featuredHtml.length === 0);
  };
  const renderPromos = (promos, append = false) => {
    if (promos.length === 0 && !append) {
      renderMessage("No encontramos promos activas con esos filtros.");
      return;
    }
    promos.forEach((promo) => {
      promosById.set(promo._id, promo);
    });
    const regularPromos = promos.filter(
      (promo) => !promo.featured && !featuredIds.has(promo._id)
    );
    const regularHtml = regularPromos.map((promo, index) => buildPromoCard(promo, index, false)).join("");
    if (append) {
      container.insertAdjacentHTML("beforeend", regularHtml);
    } else {
      container.innerHTML = regularHtml;
    }
  };
  const buildBaseQuery = (formData) => {
    const city = String(formData.get("city") ?? "").trim();
    const atValue = String(formData.get("at") ?? "").trim();
    const promoType = String(formData.get("promoType") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const queryText = String(formData.get("q") ?? "").trim();
    const atDate = atValue ? new Date(atValue) : void 0;
    if (atDate && Number.isNaN(atDate.valueOf())) {
      renderMessage("Formato de fecha inv\xE1lido.");
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
    const totalActive = totalRegular + totalFeatured;
    if (totalActive === 0) {
      counter.textContent = "0 promociones activas para hoy";
      return;
    }
    counter.textContent = `${totalActive} promociones activas para hoy`;
  };
  const updateLoadMore = (message, loadingState = false) => {
    if (!loadMore) return;
    if (!message) {
      loadMore.textContent = "";
      return;
    }
    loadMore.innerHTML = loadingState ? `<span class="promo-loader"><span class="spinner" aria-hidden="true"></span>${message}</span>` : message;
  };
  const fetchPromos = async (append) => {
    if (loading || !hasMore && append) {
      return;
    }
    loading = true;
    if (append) {
      updateLoadMore("Cargando m\xE1s promociones...", true);
    } else {
      updateLoadMore("");
    }
    try {
      const query = new URLSearchParams(baseQuery);
      query.set("offset", String(offset));
      query.set("limit", String(PAGE_SIZE));
      query.set("featured", "false");
      const queryString = query.toString();
      const querySuffix = queryString ? `?${queryString}` : "";
      const response = await apiFetch(
        `/promotions/active${querySuffix}`
      );
      const promos = response.items ?? [];
      totalRegular = response.total ?? 0;
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
      updateLoadMore(
        hasMore ? "Desliza para cargar m\xE1s." : "No hay m\xE1s promociones."
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error consultando promociones";
      renderMessage(message);
      updateLoadMore("");
    } finally {
      loading = false;
    }
  };
  const fetchFeaturedPromos = async () => {
    if (!featuredContainer || !featuredSection) return;
    try {
      const query = new URLSearchParams(baseQuery);
      query.set("featured", "true");
      query.set("offset", "0");
      query.set("limit", String(FEATURED_COUNT));
      const response = await apiFetch(
        `/promotions/active?${query.toString()}`
      );
      totalFeatured = response.total ?? response.items?.length ?? 0;
      renderFeaturedPromos(response.items ?? []);
      updateCounter();
    } catch {
      featuredIds.clear();
      featuredContainer.innerHTML = "";
      featuredSection.classList.add("hidden");
      totalFeatured = 0;
      updateCounter();
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
    void runPrimaryLoad();
  });
  const initialQuery = buildBaseQuery(new FormData(form));
  if (initialQuery) {
    baseQuery = initialQuery;
  }
  void runPrimaryLoad();
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
  const handleCardClick = (event) => {
    const target = event.target;
    if (target.closest("a")) {
      return;
    }
    const card = target.closest("[data-promo-id]");
    if (!card) return;
    const promoId = card.dataset.promoId ?? "";
    const promo = promosById.get(promoId);
    if (promo) {
      promoModal.open(promo);
    }
  };
  container.addEventListener("click", handleCardClick);
  featuredContainer?.addEventListener("click", handleCardClick);
}
if (categorySelect) {
  try {
    const categories = await apiFetch("/categories");
    categorySelect.innerHTML = [
      `<option value="">Todas</option>`,
      ...categories.map(
        (category) => `<option value="${category.slug}">${category.name}</option>`
      )
    ].join("");
  } catch {
    categorySelect.innerHTML = `<option value="">Todas</option>`;
  }
}
if (citySelect) {
  const initialCity = citySelect.dataset.initialCity ?? "";
  try {
    const cities = await apiFetch("/cities");
    const options = cities.map(
      (city) => `<option value="${city.name}">${city.name}</option>`
    );
    citySelect.innerHTML = [`<option value="">Todas</option>`, ...options].join(
      ""
    );
    if (initialCity) {
      citySelect.value = initialCity;
    }
  } catch {
    citySelect.innerHTML = `<option value="">Todas</option>`;
  }
}
