"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };

  // apps/web/src/scripts/api.ts
  var readApiBase = () => {
    const base = document.body.dataset.apiBase;
    return base && base.length > 0 ? base : "http://localhost:3000/api/v1";
  };
  var API_BASE = readApiBase();
  var parseErrorMessage = (payload) => {
    if (!(payload == null ? void 0 : payload.message)) {
      return "Ocurri\xF3 un error inesperado";
    }
    if (Array.isArray(payload.message)) {
      return payload.message.join(", ");
    }
    return payload.message;
  };
  var apiFetch = async (path, options) => {
    var _a2, _b;
    const response = await fetch(`${API_BASE}${path}`, __spreadValues({
      credentials: "include",
      headers: __spreadValues({
        "Content-Type": "application/json"
      }, (_a2 = options == null ? void 0 : options.headers) != null ? _a2 : {})
    }, options));
    const contentType = (_b = response.headers.get("content-type")) != null ? _b : "";
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
    var _a2;
    if (!category) return defaultTone;
    return (_a2 = toneMap[category]) != null ? _a2 : defaultTone;
  };
  var formatPromoType = (type) => {
    var _a2;
    return (_a2 = promoTypeLabels[type]) != null ? _a2 : type;
  };
  var formatDaysShort = (days) => orderedDays.filter((day) => days.includes(day)).map((day) => {
    var _a2;
    return (_a2 = dayLabels[day]) != null ? _a2 : day;
  }).join(" \xB7 ");
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
    return orderedDays.filter((day) => daySet.has(day)).map((day) => {
      var _a2;
      return (_a2 = dayLabels[day]) != null ? _a2 : day;
    }).join(", ");
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
  var createPromoModal = (elements) => {
    const open = (promo) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      if (!elements.overlay || !elements.modal) return;
      const businessName = (_b = (_a2 = promo.business) == null ? void 0 : _a2.name) != null ? _b : "Negocio local";
      const categories = (_d = (_c = promo.business) == null ? void 0 : _c.categories) != null ? _d : [];
      const category = categories[0];
      const visual = getPromoVisual(category);
      const promoTypeLabel = formatPromoType(promo.promoType);
      const days = formatDaysFull(promo.daysOfWeek);
      if (elements.title) elements.title.textContent = promo.title;
      if (elements.featured) {
        elements.featured.classList.toggle("hidden", !promo.featured);
      }
      if (elements.business) elements.business.textContent = businessName;
      if (elements.description) {
        elements.description.textContent = (_e = promo.description) != null ? _e : "Promoci\xF3n vigente.";
      }
      if (elements.promoType) elements.promoType.textContent = promoTypeLabel;
      if (elements.value) elements.value.textContent = String((_f = promo.value) != null ? _f : "");
      if (elements.days) elements.days.textContent = days;
      if (elements.tags) {
        elements.tags.innerHTML = categories.length ? categories.slice(0, 4).map((item) => `<span class="promo-pill">#${item}</span>`).join("") : `<span class="promo-pill">#local</span>`;
      }
      if (elements.instagram) {
        const instagramHandle = ((_h = (_g = promo.business) == null ? void 0 : _g.instagram) != null ? _h : "").replace("@", "").trim();
        if (instagramHandle) {
          elements.instagram.textContent = `@${instagramHandle}`;
          elements.instagram.href = `https://instagram.com/${instagramHandle}`;
        } else {
          elements.instagram.textContent = "";
          elements.instagram.removeAttribute("href");
        }
        setModalFieldVisibility(
          elements.fieldInstagram,
          instagramHandle.length > 0 ? instagramHandle : null
        );
      }
      setModalFieldVisibility(
        elements.fieldValue,
        promo.value ? String(promo.value) : null
      );
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
      } else {
        if (elements.image) {
          elements.image.removeAttribute("src");
          elements.image.classList.add("hidden");
        }
        if (elements.emoji) {
          elements.emoji.textContent = visual.emoji;
          elements.emoji.classList.remove("hidden");
        }
      }
      elements.overlay.hidden = false;
      elements.overlay.classList.remove("hidden");
    };
    const close = () => {
      if (!elements.overlay) return;
      elements.overlay.classList.add("hidden");
      elements.overlay.hidden = true;
    };
    const bind = () => {
      var _a2, _b, _c;
      (_a2 = elements.close) == null ? void 0 : _a2.addEventListener("click", close);
      (_b = elements.overlay) == null ? void 0 : _b.addEventListener("click", (event) => {
        if (event.target === elements.overlay) {
          close();
        }
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          close();
        }
      });
      (_c = elements.image) == null ? void 0 : _c.addEventListener("click", (event) => {
        var _a3;
        event.stopPropagation();
        (_a3 = elements.image) == null ? void 0 : _a3.classList.toggle("is-contain");
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
  var promoModalElement = document.querySelector("[data-promos-modal]");
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
    const runPrimaryLoad = () => {
      loadToken += 1;
      const token = loadToken;
      startPrimaryLoad();
      void Promise.allSettled([fetchFeaturedPromos(), fetchPromos(false)]).then(
        () => {
          if (token === loadToken) {
            setContentLoading(false);
          }
        }
      );
    };
    initFiltersToggle(filtersToggle, filtersBody);
    promoModal.bind();
    const buildPromoCard = (promo, index, isFeatured) => {
      var _a2, _b, _c, _d, _e, _f, _g;
      const businessName = (_b = (_a2 = promo.business) == null ? void 0 : _a2.name) != null ? _b : "Negocio local";
      const instagramHandle = ((_d = (_c = promo.business) == null ? void 0 : _c.instagram) != null ? _d : "").replace("@", "").trim();
      const categories = (_f = (_e = promo.business) == null ? void 0 : _e.categories) != null ? _f : [];
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
            <p class="text-sm text-ink-900/60">${(_g = promo.description) != null ? _g : "Promoci\xF3n vigente"}</p>
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
      var _a2, _b, _c, _d, _e;
      const city = String((_a2 = formData.get("city")) != null ? _a2 : "").trim();
      const atValue = String((_b = formData.get("at")) != null ? _b : "").trim();
      const promoType = String((_c = formData.get("promoType")) != null ? _c : "").trim();
      const category = String((_d = formData.get("category")) != null ? _d : "").trim();
      const queryText = String((_e = formData.get("q")) != null ? _e : "").trim();
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
      var _a2, _b;
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
        const response = await apiFetch(
          `/promotions/active${queryString ? `?${queryString}` : ""}`
        );
        const promos = (_a2 = response.items) != null ? _a2 : [];
        totalRegular = (_b = response.total) != null ? _b : 0;
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
      var _a2, _b, _c, _d;
      if (!featuredContainer || !featuredSection) return;
      try {
        const query = new URLSearchParams(baseQuery);
        query.set("featured", "true");
        query.set("offset", "0");
        query.set("limit", String(FEATURED_COUNT));
        const response = await apiFetch(
          `/promotions/active?${query.toString()}`
        );
        totalFeatured = (_c = (_b = response.total) != null ? _b : (_a2 = response.items) == null ? void 0 : _a2.length) != null ? _c : 0;
        renderFeaturedPromos((_d = response.items) != null ? _d : []);
        updateCounter();
      } catch (e) {
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
          var _a2;
          if ((_a2 = entries[0]) == null ? void 0 : _a2.isIntersecting) {
            fetchPromos(true);
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(loadMore);
    }
    const handleCardClick = (event) => {
      var _a2;
      const target = event.target;
      if (target.closest("a")) {
        return;
      }
      const card = target.closest("[data-promo-id]");
      if (!card) return;
      const promoId = (_a2 = card.dataset.promoId) != null ? _a2 : "";
      const promo = promosById.get(promoId);
      if (promo) {
        promoModal.open(promo);
      }
    };
    container.addEventListener("click", handleCardClick);
    featuredContainer == null ? void 0 : featuredContainer.addEventListener("click", handleCardClick);
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
  var _a;
  if (citySelect) {
    const initialCity = (_a = citySelect.dataset.initialCity) != null ? _a : "";
    apiFetch("/cities").then((cities) => {
      const options = cities.map(
        (city) => `<option value="${city.name}">${city.name}</option>`
      );
      citySelect.innerHTML = [
        `<option value="">Todas</option>`,
        ...options
      ].join("");
      if (initialCity) {
        citySelect.value = initialCity;
      }
    }).catch(() => {
      citySelect.innerHTML = `<option value="">Todas</option>`;
    });
  }
})();
