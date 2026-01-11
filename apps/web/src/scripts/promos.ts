import { apiFetch } from "./api";

type BusinessSummary = {
  _id: string;
  name: string;
  slug: string;
  categories?: string[];
  instagram?: string;
};

type Promotion = {
  _id: string;
  businessId: string;
  branchId?: string | null;
  title: string;
  description?: string;
  promoType: string;
  value?: string | number;
  imageUrl?: string | null;
  startDate: string | null;
  endDate: string | null;
  daysOfWeek: string[];
  startHour: string | null;
  endHour: string | null;
  active?: boolean;
  business?: BusinessSummary | null;
};

const form = document.querySelector<HTMLFormElement>("[data-promos-form]");
const container = document.querySelector<HTMLDivElement>(
  "[data-promos-container]",
);
const categorySelect = document.querySelector<HTMLSelectElement>(
  "[data-category-select]",
);
const citySelect =
  document.querySelector<HTMLSelectElement>("[data-city-select]");
const loadMore = document.querySelector<HTMLDivElement>(
  "[data-promos-load-more]",
);
const counter = document.querySelector<HTMLParagraphElement>(
  "[data-promos-counter]",
);
const promoModalOverlay = document.querySelector<HTMLElement>(
  "[data-promos-modal-overlay]",
);
const promoModal = document.querySelector<HTMLElement>("[data-promos-modal]");
const promoModalClose = document.querySelector<HTMLButtonElement>(
  "[data-promos-modal-close]",
);
const promoModalTitle = document.querySelector<HTMLElement>(
  "[data-promos-modal-title]",
);
const promoModalBusiness = document.querySelector<HTMLElement>(
  "[data-promos-modal-business]",
);
const promoModalDescription = document.querySelector<HTMLElement>(
  "[data-promos-modal-description]",
);
const promoModalTags = document.querySelector<HTMLElement>(
  "[data-promos-modal-tags]",
);
const promoModalType = document.querySelector<HTMLElement>(
  "[data-promos-modal-type]",
);
const promoModalValue = document.querySelector<HTMLElement>(
  "[data-promos-modal-value]",
);
const promoModalDates = document.querySelector<HTMLElement>(
  "[data-promos-modal-dates]",
);
const promoModalHours = document.querySelector<HTMLElement>(
  "[data-promos-modal-hours]",
);
const promoModalDays = document.querySelector<HTMLElement>(
  "[data-promos-modal-days]",
);
const promoModalInstagram = document.querySelector<HTMLAnchorElement>(
  "[data-promos-modal-instagram]",
);
const promoModalMedia = document.querySelector<HTMLElement>(
  "[data-promos-modal-media]",
);
const promoModalImage = document.querySelector<HTMLImageElement>(
  "[data-promos-modal-image]",
);
const promoModalEmoji = document.querySelector<HTMLElement>(
  "[data-promos-modal-emoji]",
);
const promoModalFieldValue = document.querySelector<HTMLElement>(
  "[data-promos-modal-field=\"value\"]",
);
const promoModalFieldInstagram = document.querySelector<HTMLElement>(
  "[data-promos-modal-field=\"instagram\"]",
);

const PAGE_SIZE = 10;

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type City = {
  _id: string;
  name: string;
  countryCode: string;
};

if (form && container) {
  let loading = false;
  let hasMore = true;
  let offset = 0;
  let totalLoaded = 0;
  let baseQuery = new URLSearchParams();
  const promoTypeLabels: Record<string, string> = {
    discount: "Descuento",
    "2x1": "2x1",
    combo: "Combo",
    other: "Otra",
  };

  const toneMap: Record<string, { emoji: string; tone: string }> = {
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

  const getPromoVisual = (category?: string) => {
    if (!category) return defaultTone;
    return toneMap[category] ?? defaultTone;
  };

  const formatPromoType = (type: string) => promoTypeLabels[type] ?? type;

  const promosById = new Map<string, Promotion>();

  const setModalFieldVisibility = (
    wrapper: HTMLElement | null,
    value: string | null,
  ) => {
    if (!wrapper) return;
    if (!value) {
      wrapper.classList.add("hidden");
      return;
    }
    wrapper.classList.remove("hidden");
  };

  const openPromoModal = (promo: Promotion) => {
    if (!promoModalOverlay || !promoModal) return;
    const businessName = promo.business?.name ?? "Negocio local";
    const categories = promo.business?.categories ?? [];
    const category = categories[0];
    const visual = getPromoVisual(category);
    const promoTypeLabel = formatPromoType(promo.promoType);
    const dateRange =
      promo.startDate && promo.endDate
        ? `${new Date(promo.startDate).toLocaleDateString()} - ${new Date(
            promo.endDate,
          ).toLocaleDateString()}`
        : "Indefinida";
    const hours =
      promo.startHour && promo.endHour
        ? `${promo.startHour} - ${promo.endHour}`
        : "Todo el día";
    const days = promo.daysOfWeek.map((day) => day.slice(0, 3)).join(" · ");

    if (promoModalTitle) promoModalTitle.textContent = promo.title;
    if (promoModalBusiness) promoModalBusiness.textContent = businessName;
    if (promoModalDescription) {
      promoModalDescription.textContent =
        promo.description ?? "Promoción vigente.";
    }
    if (promoModalType) promoModalType.textContent = promoTypeLabel;
    if (promoModalValue) promoModalValue.textContent = String(promo.value ?? "");
    if (promoModalDates) promoModalDates.textContent = dateRange;
    if (promoModalHours) promoModalHours.textContent = hours;
    if (promoModalDays) promoModalDays.textContent = days;
    if (promoModalTags) {
      promoModalTags.innerHTML = categories.length
        ? categories
            .slice(0, 4)
            .map((item) => `<span class="promo-pill">#${item}</span>`)
            .join("")
        : `<span class="promo-pill">#local</span>`;
    }
    if (promoModalInstagram) {
      const instagramHandle = (promo.business?.instagram ?? "")
        .replace("@", "")
        .trim();
      if (instagramHandle) {
        promoModalInstagram.textContent = `@${instagramHandle}`;
        promoModalInstagram.href = `https://instagram.com/${instagramHandle}`;
      } else {
        promoModalInstagram.textContent = "";
        promoModalInstagram.removeAttribute("href");
      }
      setModalFieldVisibility(
        promoModalFieldInstagram,
        instagramHandle.length > 0 ? instagramHandle : null,
      );
    }
    setModalFieldVisibility(
      promoModalFieldValue,
      promo.value ? String(promo.value) : null,
    );

    if (promoModalMedia) {
      promoModalMedia.className = `h-56 overflow-hidden rounded-3xl border border-ink-900/10 ${visual.tone}`;
    }
    if (promo.imageUrl) {
      if (promoModalImage) {
        promoModalImage.src = promo.imageUrl;
        promoModalImage.classList.remove("hidden");
      }
      if (promoModalEmoji) {
        promoModalEmoji.textContent = "";
        promoModalEmoji.classList.add("hidden");
      }
    } else {
      if (promoModalImage) {
        promoModalImage.removeAttribute("src");
        promoModalImage.classList.add("hidden");
      }
      if (promoModalEmoji) {
        promoModalEmoji.textContent = visual.emoji;
        promoModalEmoji.classList.remove("hidden");
      }
    }

    promoModalOverlay.hidden = false;
    promoModalOverlay.classList.remove("hidden");
  };

  const closePromoModal = () => {
    if (!promoModalOverlay) return;
    promoModalOverlay.classList.add("hidden");
    promoModalOverlay.hidden = true;
  };

  const renderMessage = (message: string) => {
    container.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">${message}</div>
    `;
    if (counter) {
      counter.textContent = "";
    }
  };

  const renderPromos = (promos: Promotion[], append = false) => {
    if (promos.length === 0 && !append) {
      renderMessage("No encontramos promos activas con esos filtros.");
      return;
    }

    if (!append) {
      promosById.clear();
    }
    promos.forEach((promo) => {
      promosById.set(promo._id, promo);
    });

    const html = promos
      .map((promo, index) => {
        const businessName = promo.business?.name ?? "Negocio local";
        const instagramHandle = (promo.business?.instagram ?? "")
          .replace("@", "")
          .trim();
        const categories = promo.business?.categories ?? [];
        const category = categories[0];
        const visual = getPromoVisual(category);
        const promoTypeLabel = formatPromoType(promo.promoType);
        const dateRange =
          promo.startDate && promo.endDate
            ? `${new Date(promo.startDate).toLocaleDateString()} - ${new Date(
                promo.endDate,
              ).toLocaleDateString()}`
            : "Indefinida";
        const hours =
          promo.startHour && promo.endHour
            ? `${promo.startHour} - ${promo.endHour}`
            : "Todo el día";
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
        const media = promo.imageUrl
          ? `<img class="promo-image" src="${promo.imageUrl}" alt="${promo.title}" loading="lazy" />`
          : `<span class="promo-emoji" aria-hidden="true">${visual.emoji}</span>`;
        return `
          <article class="promo-card" data-promo-id="${promo._id}" data-promo-title="${promo.title}" data-promo-business="${businessName}" style="animation-delay:${delay}ms">
            <div class="promo-media ${visual.tone}">
              ${media}
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

  const buildBaseQuery = (formData: FormData) => {
    const city = String(formData.get("city") ?? "").trim();
    const atValue = String(formData.get("at") ?? "").trim();
    const promoType = String(formData.get("promoType") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const queryText = String(formData.get("q") ?? "").trim();

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
    counter.textContent =
      totalLoaded > 0 ? `${totalLoaded} promociones cargadas` : "";
  };

  const updateLoadMore = (message: string, loadingState = false) => {
    if (!loadMore) return;
    if (!message) {
      loadMore.textContent = "";
      return;
    }
    loadMore.innerHTML = loadingState
      ? `<span class="promo-loader"><span class="spinner" aria-hidden="true"></span>${message}</span>`
      : message;
  };

  const fetchPromos = async (append: boolean) => {
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
      const promos = await apiFetch<Promotion[]>(
        `/promotions/active${queryString ? `?${queryString}` : ""}`,
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
      updateLoadMore(
        hasMore ? "Desliza para cargar más." : "No hay más promociones.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error consultando promociones";
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
    renderMessage("Cargando promociones...");
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
      { rootMargin: "200px" },
    );
    observer.observe(loadMore);
  }

  promoModalClose?.addEventListener("click", closePromoModal);
  promoModalOverlay?.addEventListener("click", (event) => {
    if (event.target === promoModalOverlay) {
      closePromoModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePromoModal();
    }
  });

  container.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.closest("a")) {
      return;
    }
    const card = target.closest<HTMLElement>("[data-promo-id]");
    if (!card) return;
    const promoId = card.dataset.promoId ?? "";
    const promo = promosById.get(promoId);
    if (promo) {
      openPromoModal(promo);
    }
  });
}

if (categorySelect) {
  apiFetch<Category[]>("/categories")
    .then((categories) => {
      categorySelect.innerHTML = [
        `<option value=\"\">Todas</option>`,
        ...categories.map(
          (category) =>
            `<option value=\"${category.slug}\">${category.name}</option>`,
        ),
      ].join("");
    })
    .catch(() => {
      categorySelect.innerHTML = `<option value=\"\">Todas</option>`;
    });
}

if (citySelect) {
  const initialCity = citySelect.dataset.initialCity ?? "";
  apiFetch<City[]>("/cities")
    .then((cities) => {
      const options = cities.map(
        (city) => `<option value=\"${city.name}\">${city.name}</option>`,
      );
      citySelect.innerHTML = [
        `<option value=\"\">Todas</option>`,
        ...options,
      ].join("");
      if (initialCity) {
        citySelect.value = initialCity;
      }
    })
    .catch(() => {
      citySelect.innerHTML = `<option value=\"\">Todas</option>`;
    });
}
