"use strict";
(() => {
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

  // apps/web/src/scripts/promos.ts
  var form = document.querySelector("[data-promos-form]");
  var container = document.querySelector("[data-promos-container]");
  var categorySelect = document.querySelector("[data-category-select]");
  var citySelect = document.querySelector("[data-city-select]");
  var loadMore = document.querySelector("[data-promos-load-more]");
  var counter = document.querySelector("[data-promos-counter]");
  var promoModalOverlay = document.querySelector("[data-promos-modal-overlay]");
  var promoModal = document.querySelector("[data-promos-modal]");
  var promoModalClose = document.querySelector("[data-promos-modal-close]");
  var promoModalTitle = document.querySelector("[data-promos-modal-title]");
  var promoModalBusiness = document.querySelector("[data-promos-modal-business]");
  var promoModalDescription = document.querySelector(
    "[data-promos-modal-description]"
  );
  var promoModalTags = document.querySelector("[data-promos-modal-tags]");
  var promoModalType = document.querySelector("[data-promos-modal-type]");
  var promoModalValue = document.querySelector("[data-promos-modal-value]");
  var promoModalDates = document.querySelector("[data-promos-modal-dates]");
  var promoModalHours = document.querySelector("[data-promos-modal-hours]");
  var promoModalDays = document.querySelector("[data-promos-modal-days]");
  var promoModalInstagram = document.querySelector(
    "[data-promos-modal-instagram]"
  );
  var promoModalMedia = document.querySelector("[data-promos-modal-media]");
  var promoModalImage = document.querySelector("[data-promos-modal-image]");
  var promoModalEmoji = document.querySelector("[data-promos-modal-emoji]");
  var promoModalFieldValue = document.querySelector(
    '[data-promos-modal-field="value"]'
  );
  var promoModalFieldInstagram = document.querySelector(
    '[data-promos-modal-field="instagram"]'
  );
  var PAGE_SIZE = 10;
  if (form && container) {
    let loading = false;
    let hasMore = true;
    let offset = 0;
    let totalLoaded = 0;
    let baseQuery = new URLSearchParams();
    const promoTypeLabels = {
      discount: "Descuento",
      "2x1": "2x1",
      combo: "Combo",
      other: "Otra"
    };
    const toneMap = {
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
    const defaultTone = { emoji: "\u2728", tone: "promo-tone-sunrise" };
    const getPromoVisual = (category) => {
      if (!category) return defaultTone;
      return toneMap[category] ?? defaultTone;
    };
    const formatPromoType = (type) => promoTypeLabels[type] ?? type;
    const promosById = new Map();
    const setModalFieldVisibility = (wrapper, value) => {
      if (!wrapper) return;
      if (!value) {
        wrapper.classList.add("hidden");
        return;
      }
      wrapper.classList.remove("hidden");
    };
    const openPromoModal = (promo) => {
      if (!promoModalOverlay || !promoModal) return;
      const businessName = promo.business?.name ?? "Negocio local";
      const categories = promo.business?.categories ?? [];
      const category = categories[0];
      const visual = getPromoVisual(category);
      const promoTypeLabel = formatPromoType(promo.promoType);
      const dateRange = promo.startDate && promo.endDate ? `${new Date(promo.startDate).toLocaleDateString()} - ${new Date(
        promo.endDate
      ).toLocaleDateString()}` : "Indefinida";
      const hours = promo.startHour && promo.endHour ? `${promo.startHour} - ${promo.endHour}` : "Todo el d\xEDa";
      const days = promo.daysOfWeek.map((day) => day.slice(0, 3)).join(" \xB7 ");
      if (promoModalTitle) promoModalTitle.textContent = promo.title;
      if (promoModalBusiness) promoModalBusiness.textContent = businessName;
      if (promoModalDescription) {
        promoModalDescription.textContent = promo.description ?? "Promoci\xF3n vigente.";
      }
      if (promoModalType) promoModalType.textContent = promoTypeLabel;
      if (promoModalValue) promoModalValue.textContent = String(promo.value ?? "");
      if (promoModalDates) promoModalDates.textContent = dateRange;
      if (promoModalHours) promoModalHours.textContent = hours;
      if (promoModalDays) promoModalDays.textContent = days;
      if (promoModalTags) {
        promoModalTags.innerHTML = categories.length ? categories.slice(0, 4).map((item) => `<span class="promo-pill">#${item}</span>`).join("") : `<span class="promo-pill">#local</span>`;
      }
      if (promoModalInstagram) {
        const instagramHandle = (promo.business?.instagram ?? "").replace("@", "").trim();
        if (instagramHandle) {
          promoModalInstagram.textContent = `@${instagramHandle}`;
          promoModalInstagram.href = `https://instagram.com/${instagramHandle}`;
        } else {
          promoModalInstagram.textContent = "";
          promoModalInstagram.removeAttribute("href");
        }
        setModalFieldVisibility(
          promoModalFieldInstagram,
          instagramHandle.length > 0 ? instagramHandle : null
        );
      }
      setModalFieldVisibility(
        promoModalFieldValue,
        promo.value ? String(promo.value) : null
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
    const renderMessage = (message) => {
      container.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">${message}</div>
    `;
      if (counter) {
        counter.textContent = "";
      }
    };
    const renderPromos = (promos, append = false) => {
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
      const html = promos.map((promo, index) => {
        const businessName = promo.business?.name ?? "Negocio local";
        const instagramHandle = (promo.business?.instagram ?? "").replace("@", "").trim();
        const categories = promo.business?.categories ?? [];
        const category = categories[0];
        const visual = getPromoVisual(category);
        const promoTypeLabel = formatPromoType(promo.promoType);
        const dateRange = promo.startDate && promo.endDate ? `${new Date(promo.startDate).toLocaleDateString()} - ${new Date(
          promo.endDate
        ).toLocaleDateString()}` : "Indefinida";
        const hours = promo.startHour && promo.endHour ? `${promo.startHour} - ${promo.endHour}` : "Todo el d\xEDa";
        const days = promo.daysOfWeek.map((day) => day.slice(0, 3)).join(" \xB7 ");
        const value = promo.value ? `<span>${promo.value}</span>` : "";
        const categoryTags = categories.slice(0, 3).map((item) => `<span class="promo-pill">#${item}</span>`).join("");
        const instagramLink = instagramHandle ? `<a class="promo-link" href="https://instagram.com/${instagramHandle}" target="_blank" rel="noreferrer">@${instagramHandle}</a>` : "";
        const delay = Math.min(index * 60, 360);
        const media = promo.imageUrl ? `<img class="promo-image" src="${promo.imageUrl}" alt="${promo.title}" loading="lazy" />` : `<span class="promo-emoji" aria-hidden="true">${visual.emoji}</span>`;
        return `
          <article class="promo-card" data-promo-id="${promo._id}" data-promo-title="${promo.title}" data-promo-business="${businessName}" style="animation-delay:${delay}ms">
            <div class="promo-media ${visual.tone}">
              ${media}
            </div>
            <div class="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-wide text-ink-900/50">${businessName}</p>
                <h3 class="text-lg font-semibold">${promo.title}</h3>
                <p class="text-sm text-ink-900/60">${promo.description ?? "Promoci\xF3n vigente"}</p>
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
      }).join("");
      if (append) {
        container.insertAdjacentHTML("beforeend", html);
      } else {
        container.innerHTML = html;
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
      counter.textContent = totalLoaded > 0 ? `${totalLoaded} promociones cargadas` : "";
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
        updateLoadMore(hasMore ? "Desliza para cargar m\xE1s." : "No hay m\xE1s promociones.");
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
        { rootMargin: "200px" }
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
      const target = event.target;
      if (target.closest("a")) {
        return;
      }
      const card = target.closest("[data-promo-id]");
      if (!card) return;
      const promoId = card.dataset.promoId ?? "";
      const promo = promosById.get(promoId);
      if (promo) {
        openPromoModal(promo);
      }
    });
  }
  if (categorySelect) {
    apiFetch("/categories").then((categories) => {
      categorySelect.innerHTML = [
        `<option value="">Todas</option>`,
        ...categories.map(
          (category) => `<option value="${category.slug}">${category.name}</option>`
        )
      ].join("");
    }).catch(() => {
      categorySelect.innerHTML = `<option value="">Todas</option>`;
    });
  }
  if (citySelect) {
    const initialCity = citySelect.dataset.initialCity ?? "";
    apiFetch("/cities").then((cities) => {
      const options = cities.map(
        (city) => `<option value="${city.name}">${city.name}</option>`
      );
      citySelect.innerHTML = [`<option value="">Todas</option>`, ...options].join("");
      if (initialCity) {
        citySelect.value = initialCity;
      }
    }).catch(() => {
      citySelect.innerHTML = `<option value="">Todas</option>`;
    });
  }
})();
