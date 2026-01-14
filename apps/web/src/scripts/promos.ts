import { apiFetch } from "./api";
import { formatDaysShort, getPromoVisual } from "./promos/formatters";
import { initFiltersToggle } from "./promos/filters";
import { createPromoModal } from "./promos/modal";
import type {
  Category,
  City,
  Promotion,
  PromotionsResponse,
} from "./promos/types";

const form = document.querySelector<HTMLFormElement>("[data-promos-form]");
const container = document.querySelector<HTMLDivElement>(
  "[data-promos-container]",
);
const loadingBlock = document.querySelector<HTMLElement>(
  "[data-promos-loading]",
);
const contentBlock = document.querySelector<HTMLElement>(
  "[data-promos-content]",
);
const featuredSection = document.querySelector<HTMLElement>(
  "[data-promos-featured-section]",
);
const featuredContainer = document.querySelector<HTMLDivElement>(
  "[data-promos-featured]",
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
const filtersToggle = document.querySelector<HTMLButtonElement>(
  "[data-promos-filters-toggle]",
);
const filtersBody = document.querySelector<HTMLElement>(
  "[data-promos-filters-body]",
);
const promoModalOverlay = document.querySelector<HTMLElement>(
  "[data-promos-modal-overlay]",
);
const promoModalElement =
  document.querySelector<HTMLElement>("[data-promos-modal]");
const promoModalClose = document.querySelector<HTMLButtonElement>(
  "[data-promos-modal-close]",
);
const promoModalTitle = document.querySelector<HTMLElement>(
  "[data-promos-modal-title]",
);
const promoModalFeatured = document.querySelector<HTMLElement>(
  "[data-promos-modal-featured]",
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
const promoModalDays = document.querySelector<HTMLElement>(
  "[data-promos-modal-days]",
);
const promoModalInstagram = document.querySelector<HTMLAnchorElement>(
  "[data-promos-modal-instagram]",
);
const promoModalImage = document.querySelector<HTMLImageElement>(
  "[data-promos-modal-image]",
);
const promoModalEmoji = document.querySelector<HTMLElement>(
  "[data-promos-modal-emoji]",
);
const promoModalFieldValue = document.querySelector<HTMLElement>(
  '[data-promos-modal-field="value"]',
);
const promoModalFieldInstagram = document.querySelector<HTMLElement>(
  '[data-promos-modal-field="instagram"]',
);

const PAGE_SIZE = 10;
const FEATURED_COUNT = 6;

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
    fieldInstagram: promoModalFieldInstagram,
  });

  const promosById = new Map<string, Promotion>();
  const featuredIds = new Set<string>();

  const setContentLoading = (isLoading: boolean) => {
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

  const renderMessage = (message: string) => {
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

  const runPrimaryLoad = () => {
    loadToken += 1;
    const token = loadToken;
    startPrimaryLoad();
    void Promise.allSettled([fetchFeaturedPromos(), fetchPromos(false)]).then(
      () => {
        if (token === loadToken) {
          setContentLoading(false);
        }
      },
    );
  };

  initFiltersToggle(filtersToggle, filtersBody);
  promoModal.bind();

  const buildPromoCard = (
    promo: Promotion,
    index: number,
    isFeatured: boolean,
  ) => {
    const businessName = promo.business?.name ?? "Negocio local";
    const instagramHandle = (promo.business?.instagram ?? "")
      .replace("@", "")
      .trim();
    const categories = promo.business?.categories ?? [];
    const category = categories[0];
    const visual = getPromoVisual(category);
    const days = formatDaysShort(promo.daysOfWeek);
    const value = promo.value ? `<span>${promo.value}</span>` : "";
    const categoryTags = categories
      .slice(0, 3)
      .map((item) => `<span class="promo-pill">#${item}</span>`)
      .join("");
    const delay = Math.min(index * 60, 360);
    const media = promo.imageUrl
      ? `<img class="promo-image" src="${promo.imageUrl}" alt="${promo.title}" loading="lazy" />`
      : `<span class="promo-emoji" aria-hidden="true">${visual.emoji}</span>`;
    const cardClass = isFeatured
      ? "promo-card promo-card--featured"
      : "promo-card";
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
    const instagramLink = instagramHandle
      ? `<a class="promo-link" href="https://instagram.com/${instagramHandle}" target="_blank" rel="noreferrer">@${instagramHandle}</a>`
      : "";
    const featuredBadge = isFeatured
      ? `<span class="promo-badge promo-badge-featured">Destacada</span>`
      : "";
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
            <p class="text-sm text-ink-900/60">${promo.description ?? "Promoción vigente"}</p>
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

  const renderFeaturedPromos = (promos: Promotion[]) => {
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

  const renderPromos = (promos: Promotion[], append = false) => {
    if (promos.length === 0 && !append) {
      renderMessage("No encontramos promos activas con esos filtros.");
      return;
    }

    promos.forEach((promo) => {
      promosById.set(promo._id, promo);
    });

    const regularPromos = promos.filter(
      (promo) => !promo.featured && !featuredIds.has(promo._id),
    );
    const regularHtml = regularPromos
      .map((promo, index) => buildPromoCard(promo, index, false))
      .join("");
    if (append) {
      container.insertAdjacentHTML("beforeend", regularHtml);
    } else {
      container.innerHTML = regularHtml;
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
    const totalActive = totalRegular + totalFeatured;
    if (totalActive === 0) {
      counter.textContent = "0 promociones activas para hoy";
      return;
    }
    counter.textContent = `${totalActive} promociones activas para hoy`;
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
      query.set("featured", "false");
      const queryString = query.toString();
      const response = await apiFetch<PromotionsResponse>(
        `/promotions/active${queryString ? `?${queryString}` : ""}`,
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

  const fetchFeaturedPromos = async () => {
    if (!featuredContainer || !featuredSection) return;
    try {
      const query = new URLSearchParams(baseQuery);
      query.set("featured", "true");
      query.set("offset", "0");
      query.set("limit", String(FEATURED_COUNT));
      const response = await apiFetch<PromotionsResponse>(
        `/promotions/active?${query.toString()}`,
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
    runPrimaryLoad();
  });

  const initialQuery = buildBaseQuery(new FormData(form));
  if (initialQuery) {
    baseQuery = initialQuery;
  }
  runPrimaryLoad();

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

  const handleCardClick = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.closest("a")) {
      return;
    }
    const card = target.closest<HTMLElement>("[data-promo-id]");
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
