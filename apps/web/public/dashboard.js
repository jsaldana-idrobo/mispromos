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

// apps/web/src/scripts/validators.ts
var isValidDateRange = (startIso, endIso) => startIso <= endIso;
var isValidTimeRange = (start, end) => start <= end;

// apps/web/src/data/catalog.ts
var businessTypeLabels = {
  restaurant: "Restaurante",
  shop: "Tienda",
  service: "Servicio",
  bar: "Bar"
};
var promoTypeLabels = {
  discount: "Descuento",
  "2x1": "2x1",
  combo: "Combo",
  other: "Otra"
};

// apps/web/src/scripts/dashboard.ts
var isMobileDevice = () => /android|iphone|ipad|ipod/i.test(navigator.userAgent);
var userCard = document.querySelector("[data-user-card]");
var businessList = document.querySelector("[data-business-list]");
var branchList = document.querySelector("[data-branch-list]");
var promoList = document.querySelector("[data-promo-list]");
var businessSelects = Array.from(
  document.querySelectorAll("[data-business-select]")
);
var businessSelectRows = Array.from(
  document.querySelectorAll("[data-business-select-row]")
);
var branchSelect = document.querySelector("[data-branch-select]");
var businessForm = document.querySelector("[data-business-form]");
var businessMessage = document.querySelector("[data-business-message]");
var businessMode = document.querySelector("[data-business-mode]");
var branchForm = document.querySelector("[data-branch-form]");
var branchMessage = document.querySelector("[data-branch-message]");
var branchMode = document.querySelector("[data-branch-mode]");
var promoForm = document.querySelector("[data-promo-form]");
var promoImageFileInput = document.querySelector("[data-promo-image-file]");
var promoImagePreview = document.querySelector("[data-promo-image-preview]");
var promoImagePreviewWrapper = document.querySelector(
  "[data-promo-image-preview-wrapper]"
);
var promoMessage = document.querySelector("[data-promo-message]");
var promoMode = document.querySelector("[data-promo-mode]");
var promoSearchInput = document.querySelector("[data-promo-search]");
var promoStatusSelect = document.querySelector("[data-promo-status]");
var promoTypeSelect = document.querySelector("[data-promo-type]");
var promoBusinessFilter = document.querySelector("[data-promo-business-filter]");
var promoPagination = document.querySelector("[data-promo-pagination]");
var promoPagePrev = document.querySelector("[data-promo-page-prev]");
var promoPageNext = document.querySelector("[data-promo-page-next]");
var promoPageInfo = document.querySelector("[data-promo-page-info]");
var promoKpiTotal = document.querySelector("[data-promo-kpi-total]");
var promoKpiActive = document.querySelector("[data-promo-kpi-active]");
var promoKpiInactive = document.querySelector("[data-promo-kpi-inactive]");
var branchSearchInput = document.querySelector("[data-branch-search]");
var branchCityFilter = document.querySelector("[data-branch-city-filter]");
var branchBusinessFilter = document.querySelector(
  "[data-branch-business-filter]"
);
var branchPagination = document.querySelector("[data-branch-pagination]");
var branchPagePrev = document.querySelector("[data-branch-page-prev]");
var branchPageNext = document.querySelector("[data-branch-page-next]");
var branchPageInfo = document.querySelector("[data-branch-page-info]");
var branchKpiTotal = document.querySelector("[data-branch-kpi-total]");
var branchKpiCities = document.querySelector("[data-branch-kpi-cities]");
var branchKpiPhones = document.querySelector("[data-branch-kpi-phones]");
var businessSearchInput = document.querySelector("[data-business-search]");
var businessTypeFilter = document.querySelector("[data-business-type-filter]");
var businessCityFilter = document.querySelector("[data-business-city-filter]");
var businessCategoryFilter = document.querySelector(
  "[data-business-category-filter]"
);
var businessVerifiedFilter = document.querySelector(
  "[data-business-verified-filter]"
);
var businessInstagramFilter = document.querySelector(
  "[data-business-instagram-filter]"
);
var businessPagination = document.querySelector("[data-business-pagination]");
var businessPagePrev = document.querySelector("[data-business-page-prev]");
var businessPageNext = document.querySelector("[data-business-page-next]");
var businessPageInfo = document.querySelector("[data-business-page-info]");
var businessKpiTotal = document.querySelector("[data-business-kpi-total]");
var businessKpiBranches = document.querySelector("[data-business-kpi-branches]");
var businessKpiPromos = document.querySelector("[data-business-kpi-promos]");
var adminPanel = document.querySelector("[data-admin-panel]");
var adminOnlySections = Array.from(document.querySelectorAll("[data-admin-only]"));
var ownerBusinessPanel = document.querySelector("[data-owner-business]");
var ownerBusinessName = document.querySelector("[data-owner-business-name]");
var ownerBusinessType = document.querySelector("[data-owner-business-type]");
var ownerBusinessSlug = document.querySelector("[data-owner-business-slug]");
var ownerBusinessCategories = document.querySelector("[data-owner-business-categories]");
var ownerBusinessInstagram = document.querySelector("[data-owner-business-instagram]");
var ownerBusinessDescription = document.querySelector(
  "[data-owner-business-description]"
);
var ownerBusinessEdit = document.querySelector("[data-owner-business-edit]");
var cityForm = document.querySelector("[data-city-form]");
var cityMessage = document.querySelector("[data-city-message]");
var cityList = document.querySelector("[data-city-list]");
var cityMode = document.querySelector("[data-city-mode]");
var cityPagination = document.querySelector("[data-city-pagination]");
var cityPagePrev = document.querySelector("[data-city-page-prev]");
var cityPageNext = document.querySelector("[data-city-page-next]");
var cityPageInfo = document.querySelector("[data-city-page-info]");
var cityKpiTotal = document.querySelector("[data-city-kpi-total]");
var cityKpiCountries = document.querySelector("[data-city-kpi-countries]");
var cityKpiLast = document.querySelector("[data-city-kpi-last]");
var categoryForm = document.querySelector("[data-category-form]");
var categoryMessage = document.querySelector("[data-category-message]");
var categoryList = document.querySelector("[data-category-list]");
var categoryMode = document.querySelector("[data-category-mode]");
var categoryPagination = document.querySelector("[data-category-pagination]");
var categoryPagePrev = document.querySelector("[data-category-page-prev]");
var categoryPageNext = document.querySelector("[data-category-page-next]");
var categoryPageInfo = document.querySelector("[data-category-page-info]");
var categoryKpiTotal = document.querySelector("[data-category-kpi-total]");
var categoryKpiSlugs = document.querySelector("[data-category-kpi-slugs]");
var categoryKpiLast = document.querySelector("[data-category-kpi-last]");
var categorySuggestions = document.querySelector(
  "[data-business-category-select]"
);
var ownerSections = Array.from(document.querySelectorAll("[data-owner-only]"));
var authGate = document.querySelector("[data-auth-gate]");
var authGateText = document.querySelector("[data-auth-gate-text]");
var branchCitySelect = document.querySelector("[data-branch-city-select]");
var dashboardHero = document.querySelector("[data-dashboard-hero]");
var dashboardMenu = document.querySelector("[data-dashboard-menu]");
var dashboardOverlay = document.querySelector("[data-dashboard-overlay]");
var dashboardToggle = document.querySelector("[data-dashboard-toggle]");
var dashboardClose = document.querySelector("[data-dashboard-close]");
var dashboardLoader = document.querySelector("[data-dashboard-loader]");
var dashboardContent = document.querySelector("[data-dashboard-content]");
var dashboardTabs = Array.from(
  document.querySelectorAll("[data-dashboard-tab]")
);
var dashboardPanels = Array.from(
  document.querySelectorAll("[data-dashboard-panel]")
);
var dashboardCreateButtons = Array.from(
  document.querySelectorAll("[data-dashboard-create]")
);
var businessTabLabels = Array.from(
  document.querySelectorAll("[data-dashboard-business-label]")
);
var businessTabTitle = document.querySelector("[data-dashboard-business-title]");
var promoTabLabels = Array.from(
  document.querySelectorAll("[data-dashboard-promo-label]")
);
var promoTabTitle = document.querySelector("[data-dashboard-promo-title]");
var promoTabSubtitle = document.querySelector("[data-dashboard-promo-subtitle]");
var branchTabLabels = Array.from(
  document.querySelectorAll("[data-dashboard-branch-label]")
);
var branchTabTitle = document.querySelector("[data-dashboard-branch-title]");
var branchTabSubtitle = document.querySelector("[data-dashboard-branch-subtitle]");
var promoModalOverlay = document.querySelector("[data-promo-modal-overlay]");
var promoModal = document.querySelector("[data-promo-modal]");
var promoModalClose = document.querySelector("[data-promo-modal-close]");
var promoModalTitle = document.querySelector("[data-promo-modal-title]");
var branchModalOverlay = document.querySelector("[data-branch-modal-overlay]");
var branchModal = document.querySelector("[data-branch-modal]");
var branchModalClose = document.querySelector("[data-branch-modal-close]");
var branchModalTitle = document.querySelector("[data-branch-modal-title]");
var businessModalOverlay = document.querySelector("[data-business-modal-overlay]");
var businessModal = document.querySelector("[data-business-modal]");
var businessModalClose = document.querySelector("[data-business-modal-close]");
var businessModalTitle = document.querySelector("[data-business-modal-title]");
var cityModalOverlay = document.querySelector("[data-city-modal-overlay]");
var cityModal = document.querySelector("[data-city-modal]");
var cityModalClose = document.querySelector("[data-city-modal-close]");
var cityModalTitle = document.querySelector("[data-city-modal-title]");
var categoryModalOverlay = document.querySelector("[data-category-modal-overlay]");
var categoryModal = document.querySelector("[data-category-modal]");
var categoryModalClose = document.querySelector("[data-category-modal-close]");
var categoryModalTitle = document.querySelector("[data-category-modal-title]");
var businesses = [];
var branches = [];
var currentUser = null;
var cities = [];
var categories = [];
var currentBusinessId = "";
var promotions = [];
var activeDashboardTab = "promos";
var promoFilters = {
  search: "",
  status: "all",
  type: "all",
  businessId: "all"
};
var branchFilters = {
  search: "",
  city: "all",
  businessId: "all"
};
var adminBusinessPage = 1;
var ADMIN_BUSINESS_PAGE_SIZE = 10;
var adminBranchPage = 1;
var ADMIN_BRANCH_PAGE_SIZE = 10;
var businessFilters = {
  search: "",
  type: "all",
  city: "all",
  category: "all",
  verified: "all",
  instagram: "all"
};
var adminPromoPage = 1;
var ADMIN_PROMO_PAGE_SIZE = 10;
var adminCityPage = 1;
var ADMIN_CITY_PAGE_SIZE = 10;
var adminCategoryPage = 1;
var ADMIN_CATEGORY_PAGE_SIZE = 10;
var setMessage = (el, text) => {
  if (el) {
    el.textContent = text;
  }
};
var normalizeSlug = (value) => value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-{2,}/g, "-").replace(/^-|-\$/g, "");
var renderLoadingMessage = (container, message) => {
  if (!container) return;
  container.innerHTML = `
    <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70 flex items-center gap-3">
      <span class="spinner" aria-hidden="true"></span>
      <span>${message}</span>
    </div>
  `;
};
var setSelectLoading = (select, message) => {
  if (!select) return;
  select.disabled = true;
  select.innerHTML = `<option value="">${message}</option>`;
};
var setSelectReady = (select, optionsHtml, keepDisabled = false) => {
  if (!select) return;
  select.innerHTML = optionsHtml;
  select.disabled = keepDisabled;
};
var withLoading = async (form, action) => {
  if (!form) {
    await action();
    return;
  }
  const button = form.querySelector("button[type='submit']");
  if (button) {
    setButtonLoading(button, true);
  }
  try {
    await action();
  } finally {
    if (button) {
      setButtonLoading(button, false);
    }
  }
};
var setMode = (form, label, cancel, mode) => {
  if (!form) return;
  form.dataset.mode = mode;
  if (label) {
    if (mode === "edit") {
      label.textContent = "Modo edici\xF3n";
    } else if (mode === "view") {
      label.textContent = "Solo lectura";
    } else {
      label.textContent = "Modo crear";
    }
  }
  if (cancel) {
    cancel.hidden = mode !== "edit";
  }
};
var setFormReadOnly = (form, readOnly) => {
  if (!form) return;
  form.dataset.readonly = readOnly ? "true" : "false";
  const fields = form.querySelectorAll(
    "input, select, textarea"
  );
  fields.forEach((field) => {
    field.disabled = readOnly;
  });
  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) {
    submitButton.hidden = readOnly;
  }
};
var setInputValue = (form, name, value) => {
  if (!form) return;
  const input = form.querySelector(
    `[name="${name}"]`
  );
  if (input) {
    input.value = value;
  }
};
var formatDateInput = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};
var setPromoImagePreview = (url) => {
  if (!promoImagePreview || !promoImagePreviewWrapper) return;
  if (!url) {
    promoImagePreview.removeAttribute("src");
    promoImagePreviewWrapper.classList.add("hidden");
    return;
  }
  promoImagePreview.src = url;
  promoImagePreviewWrapper.classList.remove("hidden");
};
var uploadPromoImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE}/uploads/promo-image`, {
    method: "POST",
    body: formData,
    credentials: "include"
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => void 0);
    const message = payload?.message ?? "No pudimos subir la foto de la promoción.";
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }
  const payload = await response.json();
  if (!payload.url) {
    throw new Error("La respuesta de la subida no incluye la URL.");
  }
  return payload.url;
};
var setBusinessForm = (business, options = {}) => {
  if (!businessForm) return;
  if (!business) {
    businessForm.reset();
    businessForm.dataset.editId = "";
    setFormReadOnly(businessForm, false);
    setMode(businessForm, businessMode, null, "create");
    if (businessModalTitle) {
      businessModalTitle.textContent = "Crear negocio";
    }
    if (categorySuggestions) {
      Array.from(categorySuggestions.options).forEach((option) => {
        option.selected = false;
      });
    }
    return;
  }
  const mode = options.mode ?? "edit";
  businessForm.dataset.editId = business._id;
  setFormReadOnly(businessForm, options.readOnly ?? false);
  setMode(businessForm, businessMode, null, mode);
  if (businessModalTitle) {
    if (options.title) {
      businessModalTitle.textContent = options.title;
    } else {
      businessModalTitle.textContent = mode === "view" ? "Detalle del negocio" : "Editar negocio";
    }
  }
  setInputValue(businessForm, "name", business.name);
  setInputValue(businessForm, "slug", business.slug);
  setInputValue(businessForm, "type", business.type);
  if (categorySuggestions) {
    const selected = new Set(business.categories ?? []);
    Array.from(categorySuggestions.options).forEach((option) => {
      option.selected = selected.has(option.value);
    });
  }
  setInputValue(businessForm, "description", business.description ?? "");
  setInputValue(businessForm, "instagram", business.instagram ?? "");
};
var setBranchForm = (branch, options = {}) => {
  if (!branchForm) return;
  if (!branch) {
    branchForm.reset();
    branchForm.dataset.editId = "";
    setFormReadOnly(branchForm, false);
    setMode(branchForm, branchMode, null, "create");
    if (branchModalTitle) {
      branchModalTitle.textContent = "Crear sede";
    }
    if (currentUser?.role !== "ADMIN" && currentBusinessId) {
      setInputValue(branchForm, "businessId", currentBusinessId);
    }
    return;
  }
  const mode = options.mode ?? "edit";
  branchForm.dataset.editId = branch._id;
  setFormReadOnly(branchForm, options.readOnly ?? false);
  setMode(branchForm, branchMode, null, mode);
  if (branchModalTitle) {
    if (options.title) {
      branchModalTitle.textContent = options.title;
    } else {
      branchModalTitle.textContent = mode === "view" ? "Detalle de la sede" : "Editar sede";
    }
  }
  setInputValue(branchForm, "businessId", branch.businessId);
  setInputValue(branchForm, "city", branch.city);
  setInputValue(branchForm, "address", branch.address);
  setInputValue(branchForm, "zone", branch.zone ?? "");
  setInputValue(branchForm, "phone", branch.phone ?? "");
};
var setPromoForm = async (promo, options = {}) => {
  if (!promoForm) return;
  if (!promo) {
    promoForm.reset();
    promoForm.dataset.editId = "";
    setFormReadOnly(promoForm, false);
    setMode(promoForm, promoMode, null, "create");
    setPromoImagePreview(null);
    if (promoImageFileInput) {
      promoImageFileInput.value = "";
    }
    if (promoModalTitle) {
      promoModalTitle.textContent = "Crear promoci\xF3n";
    }
    if (currentUser?.role !== "ADMIN" && currentBusinessId) {
      setInputValue(promoForm, "businessId", currentBusinessId);
    }
    return;
  }
  const mode = options.mode ?? "edit";
  promoForm.dataset.editId = promo._id;
  setFormReadOnly(promoForm, options.readOnly ?? false);
  setMode(promoForm, promoMode, null, mode);
  if (promoModalTitle) {
    if (options.title) {
      promoModalTitle.textContent = options.title;
    } else {
      promoModalTitle.textContent = mode === "view" ? "Detalle de la promoci\xF3n" : "Editar promoci\xF3n";
    }
  }
  setInputValue(promoForm, "businessId", promo.businessId);
  if (promo.businessId) {
    if (currentUser?.role === "ADMIN") {
      await loadBranchOptionsForBusiness(promo.businessId);
    } else {
      currentBusinessId = promo.businessId;
      await loadBranches(promo.businessId);
    }
  }
  setInputValue(promoForm, "branchId", promo.branchId ?? "");
  setInputValue(promoForm, "title", promo.title);
  setInputValue(promoForm, "description", promo.description ?? "");
  setInputValue(promoForm, "imageUrl", promo.imageUrl ?? "");
  setInputValue(promoForm, "promoType", promo.promoType);
  setInputValue(promoForm, "value", promo.value ? String(promo.value) : "");
  setInputValue(promoForm, "startDate", formatDateInput(promo.startDate));
  setInputValue(promoForm, "endDate", formatDateInput(promo.endDate));
  setInputValue(promoForm, "startHour", promo.startHour ?? "");
  setInputValue(promoForm, "endHour", promo.endHour ?? "");
  const dayInputs = promoForm.querySelectorAll('input[name="daysOfWeek"]');
  dayInputs.forEach((input) => {
    input.checked = promo.daysOfWeek.includes(input.value);
  });
  const activeInput = promoForm.querySelector('input[name="active"]');
  if (activeInput) {
    activeInput.checked = promo.active ?? true;
  }
  setPromoImagePreview(promo.imageUrl ?? null);
};
var setCityForm = (city, options = {}) => {
  if (!cityForm) return;
  if (!city) {
    cityForm.reset();
    cityForm.dataset.editId = "";
    setFormReadOnly(cityForm, false);
    setMode(cityForm, cityMode, null, "create");
    if (cityModalTitle) {
      cityModalTitle.textContent = "Crear ciudad";
    }
    return;
  }
  const mode = options.mode ?? "edit";
  cityForm.dataset.editId = city._id;
  setFormReadOnly(cityForm, options.readOnly ?? false);
  setMode(cityForm, cityMode, null, mode);
  if (cityModalTitle) {
    if (options.title) {
      cityModalTitle.textContent = options.title;
    } else {
      cityModalTitle.textContent = mode === "view" ? "Detalle de la ciudad" : "Editar ciudad";
    }
  }
  setInputValue(cityForm, "name", city.name);
  setInputValue(cityForm, "countryCode", city.countryCode);
};
var setCategoryForm = (category, options = {}) => {
  if (!categoryForm) return;
  if (!category) {
    categoryForm.reset();
    categoryForm.dataset.editId = "";
    setFormReadOnly(categoryForm, false);
    setMode(categoryForm, categoryMode, null, "create");
    if (categoryModalTitle) {
      categoryModalTitle.textContent = "Crear categor\xEDa";
    }
    return;
  }
  const mode = options.mode ?? "edit";
  categoryForm.dataset.editId = category._id;
  setFormReadOnly(categoryForm, options.readOnly ?? false);
  setMode(categoryForm, categoryMode, null, mode);
  if (categoryModalTitle) {
    if (options.title) {
      categoryModalTitle.textContent = options.title;
    } else {
      categoryModalTitle.textContent = mode === "view" ? "Detalle de la categor\xEDa" : "Editar categor\xEDa";
    }
  }
  setInputValue(categoryForm, "name", category.name);
  setInputValue(categoryForm, "slug", category.slug);
};
var setFormsEnabled = (enabled) => {
  [businessForm, branchForm, promoForm].forEach((form) => {
    if (!form) return;
    Array.from(form.elements).forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
        element.disabled = !enabled;
      }
    });
  });
};
var setOwnerSectionsVisible = (visible) => {
  ownerSections.forEach((section) => {
    section.hidden = !visible;
  });
};
var setDashboardLoading = (isLoading) => {
  document.documentElement.dataset.dashboardLoading = isLoading ? "true" : "false";
  if (dashboardLoader) {
    dashboardLoader.classList.toggle("hidden", !isLoading);
  }
  if (dashboardContent) {
    dashboardContent.classList.toggle("hidden", isLoading);
  }
  if (isLoading) {
    if (dashboardMenu) {
      dashboardMenu.hidden = true;
    }
    if (dashboardToggle) {
      dashboardToggle.hidden = true;
    }
    if (dashboardOverlay) {
      dashboardOverlay.hidden = true;
    }
  }
};
var setHeaderAuthState = (isAuthenticated) => {
  const loginLink = document.querySelector("[data-nav-login]");
  const registerLink = document.querySelector("[data-nav-register]");
  const dashboardLink = document.querySelector("[data-nav-dashboard]");
  if (loginLink) {
    loginLink.hidden = isAuthenticated;
  }
  if (registerLink) {
    registerLink.hidden = isAuthenticated;
  }
  if (dashboardLink) {
    dashboardLink.hidden = !isAuthenticated;
  }
};
var setBusinessSelectVisibility = (isAdmin) => {
  businessSelectRows.forEach((row) => {
    row.hidden = !isAdmin;
  });
  businessSelects.forEach((select) => {
    select.disabled = !isAdmin;
    if (!isAdmin && currentBusinessId) {
      select.value = currentBusinessId;
    }
  });
};
var setBusinessLabels = (isAdmin) => {
  const label = isAdmin ? "Mis negocios" : "Mi negocio";
  businessTabLabels.forEach((item) => {
    item.textContent = label;
  });
  if (businessTabTitle) {
    businessTabTitle.textContent = label;
  }
};
var setPromoLabels = (isAdmin) => {
  const label = isAdmin ? "Promociones" : "Mis promociones";
  promoTabLabels.forEach((item) => {
    item.textContent = label;
  });
  if (promoTabTitle) {
    promoTabTitle.textContent = label;
  }
  if (promoTabSubtitle) {
    promoTabSubtitle.textContent = isAdmin ? "Gestiona promociones de todos los negocios." : "Gestiona las promos activas de tu negocio.";
  }
};
var setBranchLabels = (isAdmin) => {
  const label = isAdmin ? "Sedes" : "Mis sucursales";
  branchTabLabels.forEach((item) => {
    item.textContent = label;
  });
  if (branchTabTitle) {
    branchTabTitle.textContent = label;
  }
  if (branchTabSubtitle) {
    branchTabSubtitle.textContent = isAdmin ? "Gestiona sedes de todos los negocios." : "Administra las sedes activas de tu negocio.";
  }
};
var setAdminOnlyVisibility = (isAdmin) => {
  adminOnlySections.forEach((section) => {
    section.hidden = !isAdmin;
  });
  if (ownerBusinessPanel) {
    ownerBusinessPanel.hidden = isAdmin;
  }
};
var removeAdminOnlySections = () => {
  adminOnlySections.forEach((section) => {
    section.remove();
  });
};
var renderOwnerBusinessDetails = () => {
  if (!ownerBusinessPanel) return;
  const business = businesses.find((item) => item._id === currentBusinessId) ?? businesses[0];
  if (!business) {
    ownerBusinessPanel.hidden = true;
    return;
  }
  ownerBusinessPanel.hidden = false;
  if (ownerBusinessName) {
    ownerBusinessName.textContent = business.name;
  }
  if (ownerBusinessType) {
    ownerBusinessType.textContent = businessTypeLabels[business.type] ?? business.type;
  }
  if (ownerBusinessSlug) {
    ownerBusinessSlug.textContent = business.slug;
  }
  if (ownerBusinessCategories) {
    ownerBusinessCategories.textContent = (business.categories ?? []).join(", ") || "-";
  }
  if (ownerBusinessInstagram) {
    ownerBusinessInstagram.textContent = business.instagram ? `@${business.instagram}` : "-";
  }
  if (ownerBusinessDescription) {
    ownerBusinessDescription.textContent = business.description ?? "-";
  }
};
var updatePromoPagination = (total, isAdmin) => {
  if (!promoPagination || !promoPageInfo || !promoPagePrev || !promoPageNext) return;
  if (!isAdmin) {
    promoPagination.hidden = true;
    return;
  }
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PROMO_PAGE_SIZE));
  if (adminPromoPage > totalPages) {
    adminPromoPage = totalPages;
  }
  promoPageInfo.textContent = `P\xE1gina ${adminPromoPage} de ${totalPages}`;
  promoPagePrev.disabled = adminPromoPage <= 1;
  promoPageNext.disabled = adminPromoPage >= totalPages;
  promoPagination.hidden = totalPages <= 1;
};
var closeAllModals = () => {
  const setHidden = (overlay, hidden) => {
    if (!overlay) return;
    overlay.hidden = hidden;
    overlay.classList.toggle("hidden", hidden);
  };
  setHidden(promoModalOverlay, true);
  setHidden(branchModalOverlay, true);
  setHidden(businessModalOverlay, true);
  setHidden(cityModalOverlay, true);
  setHidden(categoryModalOverlay, true);
};
var openModal = (type) => {
  closeAllModals();
  const modalMap = {
    promo: { overlay: promoModalOverlay, modal: promoModal },
    branch: { overlay: branchModalOverlay, modal: branchModal },
    business: { overlay: businessModalOverlay, modal: businessModal },
    city: { overlay: cityModalOverlay, modal: cityModal },
    category: { overlay: categoryModalOverlay, modal: categoryModal }
  };
  const target = modalMap[type];
  if (!target.overlay || !target.modal) return;
  target.overlay.hidden = false;
  target.overlay.classList.remove("hidden");
  const focusTarget = target.modal.querySelector("input, select, textarea");
  focusTarget?.focus();
};
var setActiveDashboardTab = (tab) => {
  activeDashboardTab = tab;
  dashboardPanels.forEach((panel) => {
    panel.hidden = panel.dataset.dashboardPanel !== tab;
  });
  dashboardTabs.forEach((button) => {
    const isActive = button.dataset.dashboardTab === tab;
    button.classList.toggle("bg-ink-900", isActive);
    button.classList.toggle("text-white", isActive);
    button.classList.toggle("text-ink-900/70", !isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
};
var setDashboardMenuVisible = (visible) => {
  if (dashboardMenu) {
    dashboardMenu.hidden = !visible;
  }
  if (dashboardToggle) {
    dashboardToggle.hidden = !visible;
  }
  if (!visible) {
    if (dashboardOverlay) {
      dashboardOverlay.hidden = true;
    }
    if (dashboardMenu) {
      dashboardMenu.classList.remove("translate-x-0");
      dashboardMenu.classList.add("translate-x-full");
    }
  }
};
var setDashboardMenuOpen = (open) => {
  if (!dashboardMenu || !dashboardOverlay) return;
  dashboardOverlay.hidden = !open;
  dashboardMenu.classList.toggle("translate-x-0", open);
  dashboardMenu.classList.toggle("translate-x-full", !open);
};
var focusCreateForm = (target) => {
  if (target === "promo") {
    setActiveDashboardTab("promos");
    setPromoForm();
    openModal("promo");
  }
  if (target === "branch") {
    setActiveDashboardTab("branches");
    setBranchForm();
    openModal("branch");
  }
  if (target === "business") {
    if (currentUser?.role !== "ADMIN") {
      showToast("Acceso restringido", "Solo el admin puede crear nuevos negocios.", "info");
      return;
    }
    setActiveDashboardTab("business");
    setBusinessForm();
    openModal("business");
  }
  if (target === "city") {
    if (currentUser?.role !== "ADMIN") {
      showToast("Acceso restringido", "Solo el admin puede crear ciudades.", "info");
      return;
    }
    setActiveDashboardTab("cities");
    setCityForm();
    openModal("city");
  }
  if (target === "category") {
    if (currentUser?.role !== "ADMIN") {
      showToast("Acceso restringido", "Solo el admin puede crear categor\xEDas.", "info");
      return;
    }
    setActiveDashboardTab("categories");
    setCategoryForm();
    openModal("category");
  }
};
var setAuthGateVisible = (visible) => {
  if (authGate) {
    authGate.hidden = !visible;
  }
};
var setBranchFormEnabled = (enabled) => {
  if (!branchForm) return;
  Array.from(branchForm.elements).forEach((element) => {
    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
      element.disabled = !enabled;
    }
  });
};
var setPromoFormEnabled = (enabled) => {
  if (!promoForm) return;
  Array.from(promoForm.elements).forEach((element) => {
    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
      element.disabled = !enabled;
    }
  });
};
var renderUser = () => {
  if (!userCard) return;
  if (!currentUser) {
    userCard.innerHTML = "Inicia sesi\xF3n para administrar tus negocios.";
    setFormsEnabled(false);
    setOwnerSectionsVisible(false);
    setAuthGateVisible(true);
    setBusinessSelectVisibility(false);
    setAdminOnlyVisibility(false);
    if (dashboardHero) {
      dashboardHero.hidden = true;
    }
    if (authGateText) {
      authGateText.textContent = "Inicia sesi\xF3n con una cuenta de negocio para administrar promociones.";
    }
    return;
  }
  userCard.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold">${currentUser.email}</p>
        <p class="text-xs text-ink-900/60">Rol: ${currentUser.role}</p>
      </div>
    </div>
  `;
  const ownerAccess = currentUser.role === "BUSINESS_OWNER" || currentUser.role === "ADMIN";
  const isAdmin = currentUser.role === "ADMIN";
  setFormsEnabled(ownerAccess);
  setOwnerSectionsVisible(ownerAccess);
  setAuthGateVisible(!ownerAccess);
  setDashboardMenuVisible(ownerAccess);
  setBusinessSelectVisibility(isAdmin);
  setAdminOnlyVisibility(isAdmin);
  setBusinessLabels(isAdmin);
  setPromoLabels(isAdmin);
  setBranchLabels(isAdmin);
  if (!isAdmin) {
    removeAdminOnlySections();
  }
  if (isAdmin) {
    activeDashboardTab = "business";
  }
  if (ownerAccess) {
    setActiveDashboardTab(activeDashboardTab);
  }
  setHeaderAuthState(true);
  if (dashboardHero) {
    dashboardHero.hidden = !isAdmin;
  }
  if (!ownerAccess && authGateText) {
    authGateText.textContent = "Tu usuario es de tipo visitante. Necesitas una cuenta de negocio para administrar promociones.";
  }
  if (adminPanel) {
    adminPanel.hidden = !isAdmin;
  }
  if (!ownerAccess) {
    setMessage(businessMessage, "Necesitas rol BUSINESS_OWNER para crear negocios.");
  }
  if (!isAdmin) {
    renderOwnerBusinessDetails();
  }
};
var getBusinessCities = (businessId) => {
  return Array.from(
    new Set(
      branches.filter((branch) => branch.businessId === businessId).map((branch) => branch.city)
    )
  ).sort();
};
var formatBusinessCities = (businessId) => {
  const list = getBusinessCities(businessId);
  if (list.length === 0) return "Sin sedes";
  if (list.length <= 2) return list.join(", ");
  return `${list.slice(0, 2).join(", ")} +${list.length - 2}`;
};
var formatBusinessCategories = (business) => {
  const categoryMap = new Map(categories.map((category) => [category.slug, category.name]));
  const list = (business.categories ?? []).map((slug) => categoryMap.get(slug) ?? slug);
  if (list.length === 0) return "Sin categor\xEDa";
  if (list.length <= 2) return list.join(", ");
  return `${list.slice(0, 2).join(", ")} +${list.length - 2}`;
};
var getFilteredBusinesses = () => {
  const searchValue = businessFilters.search.trim().toLowerCase();
  return businesses.filter((business) => {
    const typeMatch = businessFilters.type === "all" || business.type === businessFilters.type;
    const categoryMatch = businessFilters.category === "all" || (business.categories ?? []).includes(businessFilters.category);
    const businessCities = getBusinessCities(business._id);
    const cityMatch = businessFilters.city === "all" || businessCities.includes(businessFilters.city);
    const verifiedMatch = businessFilters.verified === "all" || businessFilters.verified === "verified" && business.verified || businessFilters.verified === "unverified" && !business.verified;
    const hasInstagram = Boolean((business.instagram ?? "").trim());
    const instagramMatch = businessFilters.instagram === "all" || businessFilters.instagram === "with" && hasInstagram || businessFilters.instagram === "without" && !hasInstagram;
    const textMatch = searchValue.length === 0 || business.name.toLowerCase().includes(searchValue) || business.slug.toLowerCase().includes(searchValue) || (business.description ?? "").toLowerCase().includes(searchValue) || (business.instagram ?? "").toLowerCase().includes(searchValue);
    return typeMatch && categoryMatch && cityMatch && verifiedMatch && instagramMatch && textMatch;
  });
};
var updateBusinessCityFilterOptions = () => {
  if (!businessCityFilter) return;
  const selected = businessCityFilter.value || "all";
  const cities2 = Array.from(new Set(branches.map((branch) => branch.city))).sort();
  businessCityFilter.innerHTML = `
    <option value="all">Todas</option>
    ${cities2.map((city) => `<option value="${city}">${city}</option>`).join("")}
  `;
  businessCityFilter.value = cities2.includes(selected) ? selected : "all";
};
var updateBusinessCategoryFilterOptions = () => {
  if (!businessCategoryFilter) return;
  const selected = businessCategoryFilter.value || "all";
  const options = categories.length > 0 ? categories.map((category) => ({ value: category.slug, label: category.name })) : Array.from(
    new Set(businesses.flatMap((business) => business.categories ?? []))
  ).map((slug) => ({ value: slug, label: slug }));
  businessCategoryFilter.innerHTML = `
    <option value="all">Todas</option>
    ${options.map((item) => `<option value="${item.value}">${item.label}</option>`).join("")}
  `;
  businessCategoryFilter.value = options.some((item) => item.value === selected) ? selected : "all";
};
var renderBusinesses = (list, total) => {
  if (!businessList) return;
  if (total === 0) {
    businessList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        Aun no hay negocios.
        <button class="mt-3 inline-flex text-xs underline" data-empty-action="business">
          Crear mi primer negocio
        </button>
      </div>
    `;
    return;
  }
  if (list.length === 0) {
    businessList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        No hay negocios que coincidan con los filtros.
      </div>
    `;
    return;
  }
  businessList.innerHTML = `
    <div class="hidden md:block">
      <table class="w-full table-fixed border-separate border-spacing-y-3">
        <colgroup>
          <col class="w-[26%]" />
          <col class="w-[12%]" />
          <col class="w-[12%]" />
          <col class="w-[16%]" />
          <col class="w-[12%]" />
          <col class="w-[10%]" />
          <col class="w-[12%]" />
        </colgroup>
        <thead class="text-xs uppercase tracking-[0.2em] text-ink-900/50">
          <tr>
            <th class="px-4 text-left font-semibold">Negocio</th>
            <th class="px-4 text-left font-semibold">Tipo</th>
            <th class="px-4 text-left font-semibold">Ciudad</th>
            <th class="px-4 text-left font-semibold">Categor\xEDas</th>
            <th class="px-4 text-left font-semibold">Instagram</th>
            <th class="px-4 text-left font-semibold">Estado</th>
            <th class="px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(
    (business) => `
                <tr class="rounded-2xl bg-white/90">
                  <td class="rounded-l-2xl border border-ink-900/10 bg-white/90 px-4 py-3 align-top">
                    <p class="truncate text-sm font-semibold">${business.name}</p>
                    <p class="mt-1 text-xs text-ink-900/60">${business.slug}</p>
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${businessTypeLabels[business.type] ?? business.type}
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${formatBusinessCities(business._id)}
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${formatBusinessCategories(business)}
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${business.instagram ? `@${business.instagram}` : "\u2014"}
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${business.verified ? "Verificado" : "Pendiente"}
                  </td>
                  <td class="rounded-r-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
                    <div class="flex flex-wrap gap-2 text-xs">
                      <button class="action-btn action-view" data-business-select="${business._id}">Ver</button>
                      <button class="action-btn action-edit" data-business-edit="${business._id}">Editar</button>
                      <button class="action-btn action-delete" data-business-delete="${business._id}">Eliminar</button>
                    </div>
                  </td>
                </tr>
              `
  ).join("")}
        </tbody>
      </table>
    </div>
    <div class="grid gap-3 md:hidden">
      ${list.map(
    (business) => `
            <div class="rounded-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-sm font-semibold truncate">${business.name}</p>
                  <p class="text-xs text-ink-900/60">${business.slug}</p>
                  <p class="text-xs text-ink-900/60">
                    ${businessTypeLabels[business.type] ?? business.type} \xB7
                    ${formatBusinessCities(business._id)}
                  </p>
                  <p class="text-xs text-ink-900/60 truncate">${formatBusinessCategories(business)}</p>
                </div>
                <span class="text-xs text-ink-900/60">${business.verified ? "Verificado" : "Pendiente"}</span>
              </div>
              <div class="mt-3 flex flex-wrap gap-2 text-xs">
                <button class="action-btn action-view" data-business-select="${business._id}">Ver</button>
                <button class="action-btn action-edit" data-business-edit="${business._id}">Editar</button>
                <button class="action-btn action-delete" data-business-delete="${business._id}">Eliminar</button>
              </div>
            </div>
          `
  ).join("")}
    </div>
  `;
};
var populateBusinessSelects = () => {
  const isAdmin = currentUser?.role === "ADMIN";
  businessSelects.forEach((select) => {
    const selected = select.value;
    if (businesses.length === 0) {
      select.innerHTML = '<option value="">Sin negocios</option>';
      select.disabled = true;
      return;
    }
    if (!isAdmin && currentBusinessId) {
      const business = businesses.find((item) => item._id === currentBusinessId) ?? businesses[0];
      select.innerHTML = `<option value="${business._id}">${business.name}</option>`;
      select.value = business._id;
      select.disabled = true;
      return;
    }
    select.disabled = false;
    select.innerHTML = businesses.map((business) => `<option value="${business._id}">${business.name}</option>`).join("");
    if (selected) {
      select.value = selected;
    }
  });
};
var populateBranchSelect = (businessId, branchItems = branches) => {
  if (!branchSelect) return;
  const filtered = branchItems.filter((branch) => branch.businessId === businessId);
  branchSelect.innerHTML = `<option value="">Global</option>`;
  filtered.forEach((branch) => {
    const option = document.createElement("option");
    option.value = branch._id;
    option.textContent = `${branch.city} \xB7 ${branch.address}`;
    branchSelect.append(option);
  });
  branchSelect.disabled = filtered.length === 0;
};
var getFilteredBranches = () => {
  const searchValue = branchFilters.search.trim().toLowerCase();
  return branches.filter((branch) => {
    const businessMatch = branchFilters.businessId === "all" || branch.businessId === branchFilters.businessId;
    const cityMatch = branchFilters.city === "all" || branch.city === branchFilters.city;
    const textMatch = searchValue.length === 0 || branch.address.toLowerCase().includes(searchValue);
    return businessMatch && cityMatch && textMatch;
  });
};
var renderBranches = (list, total) => {
  if (!branchList) return;
  const isAdmin = currentUser?.role === "ADMIN";
  if (!currentBusinessId && !isAdmin) {
    branchList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        Selecciona un negocio para ver sedes.
      </div>
    `;
    return;
  }
  if (total === 0) {
    branchList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        ${isAdmin ? "No hay sedes registradas." : "No hay sedes para este negocio."}
        ${isAdmin ? "" : `<button class="mt-3 inline-flex text-xs underline" data-empty-action="branch">
          Crear sede
        </button>`}
      </div>
    `;
    return;
  }
  if (list.length === 0) {
    branchList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        No hay sedes que coincidan con los filtros.
      </div>
    `;
    return;
  }
  const businessMap = new Map(businesses.map((item) => [item._id, item]));
  branchList.innerHTML = `
    <div class="hidden md:block">
      <table class="w-full table-fixed border-separate border-spacing-y-3">
        <colgroup>
          <col class="w-[22%]" />
          <col class="w-[12%]" />
          <col class="w-[12%]" />
          <col class="w-[26%]" />
          <col class="w-[16%]" />
          <col class="w-[12%]" />
        </colgroup>
        <thead class="text-xs uppercase tracking-[0.2em] text-ink-900/50">
          <tr>
            <th class="px-4 text-left font-semibold">Negocio</th>
            <th class="px-4 text-left font-semibold">Ciudad</th>
            <th class="px-4 text-left font-semibold">Zona</th>
            <th class="px-4 text-left font-semibold">Direcci\xF3n</th>
            <th class="px-4 text-left font-semibold">Contacto</th>
            <th class="px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(
    (branch) => `
                <tr class="rounded-2xl bg-white/90">
                  <td class="rounded-l-2xl border border-ink-900/10 bg-white/90 px-4 py-3 align-top">
                    <p class="truncate text-sm font-semibold">${businessMap.get(branch.businessId)?.name ?? "Negocio"}</p>
                    <p class="mt-1 text-xs text-ink-900/60">${branch.city}</p>
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">${branch.city}</td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">${branch.zone ?? "Sin zona"}</td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">${branch.address}</td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">${branch.phone ?? "Sin tel\xE9fono"}</td>
                  <td class="rounded-r-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
                    <div class="flex flex-wrap gap-2 text-xs">
                      <button class="action-btn action-view" data-branch-view="${branch._id}">Ver</button>
                      <button class="action-btn action-edit" data-branch-edit="${branch._id}">Editar</button>
                      <button class="action-btn action-delete" data-branch-delete="${branch._id}">Eliminar</button>
                    </div>
                  </td>
                </tr>
              `
  ).join("")}
        </tbody>
      </table>
    </div>
    <div class="grid gap-3 md:hidden">
      ${list.map(
    (branch) => `
            <div class="rounded-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
              <p class="text-sm font-semibold">${businessMap.get(branch.businessId)?.name ?? "Negocio"}</p>
              <p class="text-xs text-ink-900/60">${branch.city} \xB7 ${branch.zone ?? "Sin zona"}</p>
              <p class="text-xs text-ink-900/60">${branch.address}</p>
              <p class="text-xs text-ink-900/60">${branch.phone ?? "Sin tel\xE9fono"}</p>
              <div class="mt-3 flex flex-wrap gap-2 text-xs">
                <button class="action-btn action-view" data-branch-view="${branch._id}">Ver</button>
                <button class="action-btn action-edit" data-branch-edit="${branch._id}">Editar</button>
                <button class="action-btn action-delete" data-branch-delete="${branch._id}">Eliminar</button>
              </div>
            </div>
          `
  ).join("")}
    </div>
  `;
};
var updatePromoKpis = () => {
  const total = promotions.length;
  const activeCount = promotions.filter((promo) => promo.active ?? true).length;
  const inactiveCount = total - activeCount;
  if (promoKpiTotal) {
    promoKpiTotal.textContent = String(total);
  }
  if (promoKpiActive) {
    promoKpiActive.textContent = String(activeCount);
  }
  if (promoKpiInactive) {
    promoKpiInactive.textContent = String(inactiveCount);
  }
};
var updatePromoBusinessFilterOptions = () => {
  if (!promoBusinessFilter) return;
  const isAdmin = currentUser?.role === "ADMIN";
  promoBusinessFilter.hidden = !isAdmin;
  if (!isAdmin) {
    return;
  }
  const currentValue = promoBusinessFilter.value || "all";
  promoBusinessFilter.innerHTML = `
    <option value="all">Todos</option>
    ${businesses.map((business) => `<option value="${business._id}">${business.name}</option>`).join("")}
  `;
  promoBusinessFilter.value = currentValue;
};
var getFilteredPromotions = () => {
  const searchValue = promoFilters.search.trim().toLowerCase();
  return promotions.filter((promo) => {
    const businessMatch = promoFilters.businessId === "all" || promo.businessId === promoFilters.businessId;
    const statusMatch = promoFilters.status === "all" || promoFilters.status === "active" && (promo.active ?? true) || promoFilters.status === "inactive" && !(promo.active ?? true);
    const typeMatch = promoFilters.type === "all" || promo.promoType === promoFilters.type;
    const textMatch = searchValue.length === 0 || promo.title.toLowerCase().includes(searchValue) || (promo.description ?? "").toLowerCase().includes(searchValue);
    return businessMatch && statusMatch && typeMatch && textMatch;
  });
};
var renderPromotions = (promos, total) => {
  if (!promoList) return;
  const isAdmin = currentUser?.role === "ADMIN";
  if (!currentBusinessId && !isAdmin) {
    promoList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        Selecciona un negocio para ver promociones.
      </div>
    `;
    return;
  }
  if (total === 0) {
    promoList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        No hay promociones creadas.
        <button class="mt-3 inline-flex text-xs underline" data-empty-action="promo">
          Crear promoci\xF3n
        </button>
      </div>
    `;
    return;
  }
  if (promos.length === 0) {
    promoList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        No hay promociones que coincidan con los filtros.
      </div>
    `;
    return;
  }
  const businessMap = new Map(businesses.map((item) => [item._id, item]));
  promoList.innerHTML = `
    <div class="hidden md:block">
      <table class="w-full table-fixed border-separate border-spacing-y-3">
        <colgroup>
          <col class="w-[46%]" />
          <col class="w-[16%]" />
          <col class="w-[16%]" />
          <col class="w-[22%]" />
        </colgroup>
        <thead class="text-xs uppercase tracking-[0.2em] text-ink-900/50">
          <tr>
            <th class="px-4 text-left font-semibold">Promoci\xF3n</th>
            <th class="px-4 text-left font-semibold">Tipo</th>
            <th class="px-4 text-left font-semibold">Estado</th>
            <th class="px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${promos.map((promo) => {
    const isActive = promo.active ?? true;
    const statusLabel = isActive ? "Activa" : "Inactiva";
    const dateLabel = promo.startDate && promo.endDate ? `${promo.startDate.slice(0, 10)} \u2192 ${promo.endDate.slice(0, 10)}` : "Sin fechas";
    const promoBusiness = isAdmin ? businessMap.get(promo.businessId) : businessMap.get(currentBusinessId);
    const businessName = promoBusiness?.name ?? "Negocio";
    const instagramHandle = (promoBusiness?.instagram ?? "").replace("@", "").trim();
    const instagramLink = instagramHandle ? `<a class="underline" data-instagram-link data-instagram-handle="${instagramHandle}" href="https://instagram.com/${instagramHandle}" target="_blank" rel="noreferrer">@${instagramHandle}</a>` : "";
    return `
                <tr class="rounded-2xl bg-white/90">
                  <td class="rounded-l-2xl border border-ink-900/10 bg-white/90 px-4 py-3 align-top">
                    <p class="truncate text-sm font-semibold">${promo.title}</p>
                    <p class="text-xs text-ink-900/60">${dateLabel}</p>
                    <p class="text-xs text-ink-900/60">${businessName}</p>
                    ${instagramLink ? `<div class="mt-1 text-xs text-ink-900/60">${instagramLink}</div>` : ""}
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${promoTypeLabels[promo.promoType] ?? promo.promoType}
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3">
                    <span class="w-fit rounded-full border border-ink-900/20 px-3 py-1 text-xs">
                      ${statusLabel}
                    </span>
                  </td>
                  <td class="rounded-r-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
                    <div class="flex flex-wrap gap-2 text-xs">
                      <button class="action-btn action-view" data-promo-view="${promo._id}">Ver</button>
                      <button class="action-btn action-edit" data-promo-edit="${promo._id}">Editar</button>
                      <button class="action-btn action-delete" data-promo-delete="${promo._id}">Eliminar</button>
                    </div>
                  </td>
                </tr>
              `;
  }).join("")}
        </tbody>
      </table>
    </div>
    <div class="grid gap-3 md:hidden">
      ${promos.map((promo) => {
    const isActive = promo.active ?? true;
    const statusLabel = isActive ? "Activa" : "Inactiva";
    const dateLabel = promo.startDate && promo.endDate ? `${promo.startDate.slice(0, 10)} \u2192 ${promo.endDate.slice(0, 10)}` : "Sin fechas";
    const promoBusiness = isAdmin ? businessMap.get(promo.businessId) : businessMap.get(currentBusinessId);
    const businessName = promoBusiness?.name ?? "Negocio";
    return `
            <div class="rounded-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
              <p class="text-sm font-semibold">${promo.title}</p>
              <p class="text-xs text-ink-900/60">${dateLabel}</p>
              <p class="text-xs text-ink-900/60">${businessName}</p>
              <span class="mt-2 inline-flex w-fit rounded-full border border-ink-900/20 px-3 py-1 text-xs">
                ${statusLabel}
              </span>
              <div class="mt-3 flex flex-wrap gap-2 text-xs">
                <button class="action-btn action-view" data-promo-view="${promo._id}">Ver</button>
                <button class="action-btn action-edit" data-promo-edit="${promo._id}">Editar</button>
                <button class="action-btn action-delete" data-promo-delete="${promo._id}">Eliminar</button>
              </div>
            </div>
          `;
  }).join("")}
    </div>
  `;
};
var updatePromotionsView = () => {
  updatePromoKpis();
  updatePromoBusinessFilterOptions();
  const isAdmin = currentUser?.role === "ADMIN";
  const filtered = getFilteredPromotions();
  if (isAdmin) {
    const start = (adminPromoPage - 1) * ADMIN_PROMO_PAGE_SIZE;
    const paged = filtered.slice(start, start + ADMIN_PROMO_PAGE_SIZE);
    renderPromotions(paged, promotions.length);
    updatePromoPagination(filtered.length, true);
  } else {
    renderPromotions(filtered, promotions.length);
    updatePromoPagination(0, false);
  }
  updateBusinessesView();
};
var updateBranchCityFilterOptions = () => {
  if (!branchCityFilter) return;
  const cities2 = Array.from(new Set(branches.map((branch) => branch.city))).sort();
  const currentValue = branchCityFilter.value;
  branchCityFilter.innerHTML = `
    <option value="all">Todas</option>
    ${cities2.map((city) => `<option value="${city}">${city}</option>`).join("")}
  `;
  if (cities2.includes(currentValue)) {
    branchCityFilter.value = currentValue;
  } else {
    branchCityFilter.value = "all";
    branchFilters.city = "all";
  }
};
var updateBranchBusinessFilterOptions = () => {
  if (!branchBusinessFilter) return;
  const isAdmin = currentUser?.role === "ADMIN";
  branchBusinessFilter.hidden = !isAdmin;
  if (!isAdmin) {
    return;
  }
  const currentValue = branchBusinessFilter.value || "all";
  branchBusinessFilter.innerHTML = `
    <option value="all">Todos</option>
    ${businesses.map((business) => `<option value="${business._id}">${business.name}</option>`).join("")}
  `;
  branchBusinessFilter.value = currentValue;
};
var updateBranchPagination = (total, isAdmin) => {
  if (!branchPagination || !branchPageInfo || !branchPagePrev || !branchPageNext) return;
  if (!isAdmin) {
    branchPagination.hidden = true;
    return;
  }
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_BRANCH_PAGE_SIZE));
  if (adminBranchPage > totalPages) {
    adminBranchPage = totalPages;
  }
  branchPageInfo.textContent = `P\xE1gina ${adminBranchPage} de ${totalPages}`;
  branchPagePrev.disabled = adminBranchPage <= 1;
  branchPageNext.disabled = adminBranchPage >= totalPages;
  branchPagination.hidden = totalPages <= 1;
};
var updateBranchesView = () => {
  updateBranchCityFilterOptions();
  updateBranchBusinessFilterOptions();
  const total = branches.length;
  if (branchKpiTotal) {
    branchKpiTotal.textContent = String(total);
  }
  if (branchKpiCities) {
    branchKpiCities.textContent = String(new Set(branches.map((branch) => branch.city)).size);
  }
  if (branchKpiPhones) {
    branchKpiPhones.textContent = String(
      branches.filter((branch) => (branch.phone ?? "").trim().length > 0).length
    );
  }
  const isAdmin = currentUser?.role === "ADMIN";
  const filtered = getFilteredBranches();
  if (isAdmin) {
    const start = (adminBranchPage - 1) * ADMIN_BRANCH_PAGE_SIZE;
    const paged = filtered.slice(start, start + ADMIN_BRANCH_PAGE_SIZE);
    renderBranches(paged, total);
    updateBranchPagination(filtered.length, true);
  } else {
    renderBranches(filtered, total);
    updateBranchPagination(0, false);
  }
  updateBusinessesView();
};
var updateBusinessesView = () => {
  updateBusinessCityFilterOptions();
  updateBusinessCategoryFilterOptions();
  const total = businesses.length;
  if (businessKpiTotal) {
    businessKpiTotal.textContent = String(total);
  }
  if (businessKpiBranches) {
    businessKpiBranches.textContent = String(branches.length);
  }
  if (businessKpiPromos) {
    businessKpiPromos.textContent = String(promotions.length);
  }
  const filtered = getFilteredBusinesses();
  const isAdmin = currentUser?.role === "ADMIN";
  if (isAdmin) {
    const start = (adminBusinessPage - 1) * ADMIN_BUSINESS_PAGE_SIZE;
    const paged = filtered.slice(start, start + ADMIN_BUSINESS_PAGE_SIZE);
    renderBusinesses(paged, total);
    updateBusinessPagination(filtered.length, true);
  } else {
    renderBusinesses(filtered, total);
    updateBusinessPagination(0, false);
  }
  if (!isAdmin) {
    renderOwnerBusinessDetails();
  }
};
var updateBusinessPagination = (total, isAdmin) => {
  if (!businessPagination || !businessPageInfo || !businessPagePrev || !businessPageNext) return;
  if (!isAdmin) {
    businessPagination.hidden = true;
    return;
  }
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_BUSINESS_PAGE_SIZE));
  if (adminBusinessPage > totalPages) {
    adminBusinessPage = totalPages;
  }
  businessPageInfo.textContent = `P\xE1gina ${adminBusinessPage} de ${totalPages}`;
  businessPagePrev.disabled = adminBusinessPage <= 1;
  businessPageNext.disabled = adminBusinessPage >= totalPages;
  businessPagination.hidden = totalPages <= 1;
};
var loadUser = async () => {
  if (userCard) {
    userCard.innerHTML = "Cargando usuario...";
  }
  try {
    currentUser = await apiFetch("/auth/me");
  } catch {
    currentUser = null;
  }
  if (!currentUser) {
    setHeaderAuthState(false);
  }
  renderUser();
};
var loadBusinesses = async () => {
  if (!currentUser) return;
  renderLoadingMessage(businessList, "Cargando negocios...");
  businessSelects.forEach((select) => setSelectLoading(select, "Cargando negocios..."));
  const isAdmin = currentUser.role === "ADMIN";
  adminBusinessPage = 1;
  const response = await apiFetch(isAdmin ? "/businesses" : "/businesses/mine");
  businesses = response;
  businessFilters = {
    search: "",
    type: "all",
    city: "all",
    category: "all",
    verified: "all",
    instagram: "all"
  };
  if (businessSearchInput) {
    businessSearchInput.value = "";
  }
  if (businessTypeFilter) {
    businessTypeFilter.value = "all";
  }
  if (businessCityFilter) {
    businessCityFilter.value = "all";
  }
  if (businessCategoryFilter) {
    businessCategoryFilter.value = "all";
  }
  if (businessVerifiedFilter) {
    businessVerifiedFilter.value = "all";
  }
  if (businessInstagramFilter) {
    businessInstagramFilter.value = "all";
  }
  if (!currentBusinessId && businesses.length > 0) {
    currentBusinessId = businesses[0]._id;
  }
  updateBusinessesView();
  populateBusinessSelects();
  setBusinessSelectVisibility(isAdmin);
  setAdminOnlyVisibility(isAdmin);
  const hasBusinesses = businesses.length > 0;
  setBranchFormEnabled(hasBusinesses);
  setPromoFormEnabled(hasBusinesses);
  if (!hasBusinesses) {
    setSelectLoading(branchSelect, "Sin sedes");
  }
  if (businesses.length > 0) {
    if (!currentBusinessId) {
      currentBusinessId = businesses[0]._id;
    }
    if (isAdmin) {
      await loadBranches("");
      await loadPromotions();
    } else {
      await loadBranches(currentBusinessId);
      await loadPromotions(currentBusinessId);
    }
    updatePromotionsView();
    updateBusinessesView();
  }
};
var loadBranches = async (businessId) => {
  renderLoadingMessage(branchList, "Cargando sedes...");
  setSelectLoading(branchSelect, "Cargando sedes...");
  const response = await apiFetch(
    businessId ? `/branches?businessId=${businessId}` : "/branches"
  );
  branches = response;
  branchFilters = { search: "", city: "all", businessId: "all" };
  if (branchSearchInput) {
    branchSearchInput.value = "";
  }
  if (businessId) {
    populateBranchSelect(businessId);
  }
  if (branchCityFilter) {
    branchCityFilter.value = "all";
  }
  updateBranchesView();
};
var loadPromotions = async (businessId) => {
  renderLoadingMessage(promoList, "Cargando promociones...");
  const response = await apiFetch(
    businessId ? `/promotions?businessId=${businessId}` : "/promotions"
  );
  promotions = response;
  return response;
};
var loadBranchOptionsForBusiness = async (businessId) => {
  if (!branchSelect) return;
  setSelectLoading(branchSelect, "Cargando sedes...");
  const response = await apiFetch(`/branches?businessId=${businessId}`);
  populateBranchSelect(businessId, response);
};
var updateCityPagination = (total) => {
  if (!cityPagination || !cityPageInfo || !cityPagePrev || !cityPageNext) return;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_CITY_PAGE_SIZE));
  if (adminCityPage > totalPages) {
    adminCityPage = totalPages;
  }
  cityPageInfo.textContent = `P\xE1gina ${adminCityPage} de ${totalPages}`;
  cityPagePrev.disabled = adminCityPage <= 1;
  cityPageNext.disabled = adminCityPage >= totalPages;
  cityPagination.hidden = totalPages <= 1;
};
var renderCities = () => {
  if (!cityList) return;
  if (cities.length === 0) {
    cityList.innerHTML = '<p class="text-ink-900/60">Sin ciudades registradas.</p>';
    if (cityKpiTotal) {
      cityKpiTotal.textContent = "0";
    }
    if (cityKpiCountries) {
      cityKpiCountries.textContent = "0";
    }
    if (cityKpiLast) {
      cityKpiLast.textContent = "--";
    }
    return;
  }
  if (cityKpiTotal) {
    cityKpiTotal.textContent = String(cities.length);
  }
  if (cityKpiCountries) {
    cityKpiCountries.textContent = String(
      new Set(cities.map((city) => city.countryCode.toUpperCase())).size
    );
  }
  if (cityKpiLast) {
    cityKpiLast.textContent = cities[0]?.name ?? "--";
  }
  const start = (adminCityPage - 1) * ADMIN_CITY_PAGE_SIZE;
  const paged = cities.slice(start, start + ADMIN_CITY_PAGE_SIZE);
  cityList.innerHTML = `
    <div class="hidden md:block">
      <table class="w-full table-fixed border-separate border-spacing-y-3">
        <colgroup>
          <col class="w-[55%]" />
          <col class="w-[15%]" />
          <col class="w-[30%]" />
        </colgroup>
        <thead class="text-xs uppercase tracking-[0.2em] text-ink-900/50">
          <tr>
            <th class="px-4 text-left font-semibold">Ciudad</th>
            <th class="px-4 text-left font-semibold">Pa\xEDs</th>
            <th class="px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${paged.map(
    (city) => `
                <tr class="rounded-2xl bg-white/70">
                  <td class="rounded-l-2xl border border-ink-900/10 bg-white/70 px-4 py-2">
                    <p class="truncate font-semibold">${city.name}</p>
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/70 px-4 py-2 text-xs text-ink-900/70">
                    ${city.countryCode}
                  </td>
                  <td class="rounded-r-2xl border border-ink-900/10 bg-white/70 px-4 py-2">
                    <div class="flex flex-wrap gap-2 text-xs">
                      <button class="action-btn action-view" data-city-view="${city._id}">Ver</button>
                      <button class="action-btn action-edit" data-city-edit="${city._id}">Editar</button>
                      <button class="action-btn action-delete" data-city-delete="${city._id}">Eliminar</button>
                    </div>
                  </td>
                </tr>
              `
  ).join("")}
        </tbody>
      </table>
    </div>
    <div class="grid gap-2 md:hidden">
      ${paged.map(
    (city) => `
            <div class="rounded-2xl border border-ink-900/10 bg-white/70 px-4 py-2">
              <p class="font-semibold">${city.name}</p>
              <p class="text-xs text-ink-900/60">${city.countryCode}</p>
              <div class="mt-2 flex flex-wrap gap-2 text-xs">
                <button class="action-btn action-view" data-city-view="${city._id}">Ver</button>
                <button class="action-btn action-edit" data-city-edit="${city._id}">Editar</button>
                <button class="action-btn action-delete" data-city-delete="${city._id}">Eliminar</button>
              </div>
            </div>
          `
  ).join("")}
    </div>
  `;
  updateCityPagination(cities.length);
};
var renderCategories = () => {
  if (!categoryList) return;
  if (categories.length === 0) {
    categoryList.innerHTML = '<p class="text-ink-900/60">Sin categor\xEDas registradas.</p>';
    if (categoryKpiTotal) {
      categoryKpiTotal.textContent = "0";
    }
    if (categoryKpiSlugs) {
      categoryKpiSlugs.textContent = "0";
    }
    if (categoryKpiLast) {
      categoryKpiLast.textContent = "--";
    }
    return;
  }
  if (categoryKpiTotal) {
    categoryKpiTotal.textContent = String(categories.length);
  }
  if (categoryKpiSlugs) {
    categoryKpiSlugs.textContent = String(
      categories.filter((category) => category.slug.trim().length > 0).length
    );
  }
  if (categoryKpiLast) {
    categoryKpiLast.textContent = categories[0]?.name ?? "--";
  }
  const start = (adminCategoryPage - 1) * ADMIN_CATEGORY_PAGE_SIZE;
  const paged = categories.slice(start, start + ADMIN_CATEGORY_PAGE_SIZE);
  categoryList.innerHTML = `
    <div class="hidden md:block">
      <table class="w-full table-fixed border-separate border-spacing-y-3">
        <colgroup>
          <col class="w-[45%]" />
          <col class="w-[30%]" />
          <col class="w-[25%]" />
        </colgroup>
        <thead class="text-xs uppercase tracking-[0.2em] text-ink-900/50">
          <tr>
            <th class="px-4 text-left font-semibold">Categor\xEDa</th>
            <th class="px-4 text-left font-semibold">Slug</th>
            <th class="px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${paged.map(
    (category) => `
                <tr class="rounded-2xl bg-white/70">
                  <td class="rounded-l-2xl border border-ink-900/10 bg-white/70 px-4 py-2">
                    <p class="truncate font-semibold">${category.name}</p>
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/70 px-4 py-2 text-xs text-ink-900/70">
                    ${category.slug}
                  </td>
                  <td class="rounded-r-2xl border border-ink-900/10 bg-white/70 px-4 py-2">
                    <div class="flex flex-wrap gap-2 text-xs">
                      <button class="action-btn action-view" data-category-view="${category._id}">Ver</button>
                      <button class="action-btn action-edit" data-category-edit="${category._id}">Editar</button>
                      <button class="action-btn action-delete" data-category-delete="${category._id}">Eliminar</button>
                    </div>
                  </td>
                </tr>
              `
  ).join("")}
        </tbody>
      </table>
    </div>
    <div class="grid gap-2 md:hidden">
      ${paged.map(
    (category) => `
            <div class="rounded-2xl border border-ink-900/10 bg-white/70 px-4 py-2">
              <p class="font-semibold">${category.name}</p>
              <p class="text-xs text-ink-900/60">${category.slug}</p>
              <div class="mt-2 flex flex-wrap gap-2 text-xs">
                <button class="action-btn action-view" data-category-view="${category._id}">Ver</button>
                <button class="action-btn action-edit" data-category-edit="${category._id}">Editar</button>
                <button class="action-btn action-delete" data-category-delete="${category._id}">Eliminar</button>
              </div>
            </div>
          `
  ).join("")}
    </div>
  `;
  updateCategoryPagination(categories.length);
};
var updateCategoryPagination = (total) => {
  if (!categoryPagination || !categoryPageInfo || !categoryPagePrev || !categoryPageNext) return;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_CATEGORY_PAGE_SIZE));
  if (adminCategoryPage > totalPages) {
    adminCategoryPage = totalPages;
  }
  categoryPageInfo.textContent = `P\xE1gina ${adminCategoryPage} de ${totalPages}`;
  categoryPagePrev.disabled = adminCategoryPage <= 1;
  categoryPageNext.disabled = adminCategoryPage >= totalPages;
  categoryPagination.hidden = totalPages <= 1;
};
var loadCities = async () => {
  renderLoadingMessage(cityList, "Cargando ciudades...");
  setSelectLoading(branchCitySelect, "Cargando ciudades...");
  cities = await apiFetch("/cities");
  adminCityPage = 1;
  renderCities();
  if (branchCitySelect) {
    setSelectReady(
      branchCitySelect,
      [
        `<option value="">Selecciona una ciudad</option>`,
        ...cities.map((city) => `<option value="${city.name}">${city.name}</option>`)
      ].join("")
    );
  }
};
var loadCategories = async () => {
  renderLoadingMessage(categoryList, "Cargando categor\xEDas...");
  setSelectLoading(categorySuggestions, "Cargando categor\xEDas...");
  categories = await apiFetch("/categories");
  adminCategoryPage = 1;
  renderCategories();
  if (categorySuggestions) {
    setSelectReady(
      categorySuggestions,
      categories.map((category) => `<option value="${category.slug}">${category.name}</option>`).join(
        ""
      ),
      false
    );
  }
};
var wireAdminActions = () => {
  if (cityList) {
    cityList.addEventListener("click", async (event) => {
      const target = event.target;
      const viewId = target.dataset.cityView;
      const editId = target.dataset.cityEdit;
      const id = target.dataset.cityDelete;
      if (viewId) {
        const city = cities.find((item) => item._id === viewId);
        if (city) {
          setCityForm(city, { mode: "view", readOnly: true, title: "Detalle de la ciudad" });
          openModal("city");
        }
        return;
      }
      if (editId) {
        const city = cities.find((item) => item._id === editId);
        if (city) {
          setCityForm(city, { mode: "edit", readOnly: false, title: "Editar ciudad" });
          openModal("city");
        }
      }
      if (!id) return;
      await apiFetch(`/cities/${id}`, { method: "DELETE" });
      showToast("Listo", "Ciudad eliminada.", "success");
      await loadCities();
    });
  }
  if (categoryList) {
    categoryList.addEventListener("click", async (event) => {
      const target = event.target;
      const viewId = target.dataset.categoryView;
      const editId = target.dataset.categoryEdit;
      const id = target.dataset.categoryDelete;
      if (viewId) {
        const category = categories.find((item) => item._id === viewId);
        if (category) {
          setCategoryForm(category, {
            mode: "view",
            readOnly: true,
            title: "Detalle de la categor\xEDa"
          });
          openModal("category");
        }
        return;
      }
      if (editId) {
        const category = categories.find((item) => item._id === editId);
        if (category) {
          setCategoryForm(category, { mode: "edit", readOnly: false, title: "Editar categor\xEDa" });
          openModal("category");
        }
      }
      if (!id) return;
      await apiFetch(`/categories/${id}`, { method: "DELETE" });
      showToast("Listo", "Categor\xEDa eliminada.", "success");
      await loadCategories();
    });
  }
};
var handleBusinessForm = () => {
  if (!businessForm) return;
  businessForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (businessForm.dataset.mode === "view") {
      return;
    }
    const businessEditing = businessForm.dataset.mode === "edit";
    setMessage(businessMessage, businessEditing ? "Actualizando negocio..." : "Guardando negocio...");
    const data = new FormData(businessForm);
    const categoryValues = Array.from(
      businessForm.querySelectorAll("[name='categories'] option:checked")
    ).map((option) => option.value);
    const slug = normalizeSlug(String(data.get("slug") ?? ""));
    const slugConflict = businesses.some(
      (business) => business.slug.toLowerCase() === slug && (!businessForm.dataset.editId || business._id !== businessForm.dataset.editId)
    );
    if (slugConflict) {
      const message = "Ese slug ya existe en tus negocios.";
      setMessage(businessMessage, message);
      showToast("Error", message, "error");
      return;
    }
    await withLoading(businessForm, async () => {
      try {
        const payload = {
          name: data.get("name"),
          slug,
          type: data.get("type"),
          categories: categoryValues,
          description: data.get("description"),
          instagram: data.get("instagram")
        };
        if (businessForm.dataset.mode === "edit" && businessForm.dataset.editId) {
          await apiFetch(`/businesses/${businessForm.dataset.editId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
          });
        } else {
          await apiFetch("/businesses", {
            method: "POST",
            body: JSON.stringify(payload)
          });
        }
        businessForm.reset();
        setMessage(
          businessMessage,
          businessEditing ? "Negocio actualizado." : "Negocio creado."
        );
        setBusinessForm();
        await loadBusinesses();
        if (businesses.length > 0) {
          currentBusinessId = businesses[0]._id;
        }
        showToast(
          "Listo",
          businessEditing ? "Negocio actualizado." : "Negocio creado.",
          "success"
        );
        closeAllModals();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error creando negocio";
        setMessage(businessMessage, message);
        showToast("Error", message, "error");
      }
    });
  });
};
var handleBranchForm = () => {
  if (!branchForm) return;
  branchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (branchForm.dataset.mode === "view") {
      return;
    }
    const branchEditing = branchForm.dataset.mode === "edit";
    setMessage(branchMessage, branchEditing ? "Actualizando sede..." : "Guardando sede...");
    const data = new FormData(branchForm);
    await withLoading(branchForm, async () => {
      try {
        const payload = {
          businessId: data.get("businessId"),
          city: data.get("city"),
          address: data.get("address"),
          zone: data.get("zone") || void 0,
          phone: data.get("phone") || void 0
        };
        if (branchForm.dataset.mode === "edit" && branchForm.dataset.editId) {
          await apiFetch(`/branches/${branchForm.dataset.editId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
          });
        } else {
          await apiFetch("/branches", {
            method: "POST",
            body: JSON.stringify(payload)
          });
        }
        branchForm.reset();
        setMessage(branchMessage, branchEditing ? "Sede actualizada." : "Sede creada.");
        setBranchForm();
        const businessId = String(data.get("businessId") ?? "");
        if (businessId) {
          currentBusinessId = businessId;
          await loadBranches(businessId);
          await loadPromotions(businessId);
          updatePromotionsView();
        }
        showToast("Listo", branchEditing ? "Sede actualizada." : "Sede creada.", "success");
        closeAllModals();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error creando sede";
        setMessage(branchMessage, message);
        showToast("Error", message, "error");
      }
    });
  });
};
var handlePromoForm = () => {
  if (!promoForm) return;
  const promoImageUrlInput = promoForm.querySelector('input[name="imageUrl"]');
  promoImageUrlInput?.addEventListener("input", () => {
    const value = promoImageUrlInput.value.trim();
    setPromoImagePreview(value.length > 0 ? value : null);
  });
  promoImageFileInput?.addEventListener("change", async () => {
    const file = promoImageFileInput.files?.[0];
    if (!file) return;
    setMessage(promoMessage, "Subiendo foto...");
    try {
      const url = await uploadPromoImage(file);
      setInputValue(promoForm, "imageUrl", url);
      setPromoImagePreview(url);
      setMessage(promoMessage, "");
      showToast("Listo", "Foto subida.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error subiendo la foto.";
      setMessage(promoMessage, message);
      showToast("Error", message, "error");
    } finally {
      promoImageFileInput.value = "";
    }
  });
  promoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (promoForm.dataset.mode === "view") {
      return;
    }
    const promoEditing = promoForm.dataset.mode === "edit";
    setMessage(promoMessage, promoEditing ? "Actualizando promoci\xF3n..." : "Guardando promoci\xF3n...");
    const data = new FormData(promoForm);
    const days = data.getAll("daysOfWeek").map((day) => String(day));
    const startDateValue = String(data.get("startDate") ?? "");
    const endDateValue = String(data.get("endDate") ?? "");
    const startDateIso = startDateValue ? (/* @__PURE__ */ new Date(`${startDateValue}T00:00:00`)).toISOString() : null;
    const endDateIso = endDateValue ? (/* @__PURE__ */ new Date(`${endDateValue}T23:59:59`)).toISOString() : null;
    const startHourValue = String(data.get("startHour") ?? "");
    const endHourValue = String(data.get("endHour") ?? "");
    const startHour = startHourValue.length > 0 ? startHourValue : null;
    const endHour = endHourValue.length > 0 ? endHourValue : null;
    const imageUrlValue = String(data.get("imageUrl") ?? "").trim();
    const imageUrl = imageUrlValue.length > 0 ? imageUrlValue : null;
    if (days.length === 0) {
      const message = "Selecciona al menos un d\xEDa de la semana.";
      setMessage(promoMessage, message);
      showToast("Error", message, "error");
      return;
    }
    if (startDateValue && !endDateValue || !startDateValue && endDateValue) {
      const message = "Si defines fechas, debes completar inicio y fin.";
      setMessage(promoMessage, message);
      showToast("Error", message, "error");
      return;
    }
    if (startHourValue && !endHourValue || !startHourValue && endHourValue) {
      const message = "Si defines horas, debes completar inicio y fin.";
      setMessage(promoMessage, message);
      showToast("Error", message, "error");
      return;
    }
    if (startDateIso && endDateIso && !isValidDateRange(startDateIso, endDateIso)) {
      const message = "La fecha de fin debe ser posterior a la fecha de inicio.";
      setMessage(promoMessage, message);
      showToast("Error", message, "error");
      return;
    }
    if (startHour && endHour && !isValidTimeRange(startHour, endHour)) {
      const message = "La hora fin debe ser posterior a la hora inicio.";
      setMessage(promoMessage, message);
      showToast("Error", message, "error");
      return;
    }
    await withLoading(promoForm, async () => {
      try {
        const payload = {
          businessId: data.get("businessId"),
          branchId: data.get("branchId") || null,
          title: data.get("title"),
          description: data.get("description") || void 0,
          imageUrl,
          promoType: data.get("promoType"),
          value: data.get("value") || void 0,
          startDate: startDateIso,
          endDate: endDateIso,
          daysOfWeek: days,
          startHour,
          endHour,
          active: Boolean(data.get("active"))
        };
        if (promoForm.dataset.mode === "edit" && promoForm.dataset.editId) {
          await apiFetch(`/promotions/${promoForm.dataset.editId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
          });
        } else {
          await apiFetch("/promotions", {
            method: "POST",
            body: JSON.stringify(payload)
          });
        }
        promoForm.reset();
        setMessage(promoMessage, promoEditing ? "Promoci\xF3n actualizada." : "Promoci\xF3n creada.");
        setPromoForm();
        if (currentBusinessId) {
          await loadPromotions(currentBusinessId);
          updatePromotionsView();
        }
        showToast(
          "Listo",
          promoEditing ? "Promoci\xF3n actualizada." : "Promoci\xF3n creada.",
          "success"
        );
        closeAllModals();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error creando promoci\xF3n";
        setMessage(promoMessage, message);
        showToast("Error", message, "error");
      }
    });
  });
};
var handleCityForm = () => {
  if (!cityForm) return;
  cityForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (cityForm.dataset.mode === "view") {
      return;
    }
    const cityEditing = cityForm.dataset.mode === "edit";
    setMessage(cityMessage, cityEditing ? "Actualizando ciudad..." : "Guardando ciudad...");
    const data = new FormData(cityForm);
    await withLoading(cityForm, async () => {
      try {
        const payload = {
          name: data.get("name"),
          countryCode: String(data.get("countryCode") ?? "").toUpperCase()
        };
        if (cityForm.dataset.mode === "edit" && cityForm.dataset.editId) {
          await apiFetch(`/cities/${cityForm.dataset.editId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
          });
        } else {
          await apiFetch("/cities", {
            method: "POST",
            body: JSON.stringify(payload)
          });
        }
        cityForm.reset();
        setMessage(cityMessage, cityEditing ? "Ciudad actualizada." : "Ciudad creada.");
        setCityForm();
        await loadCities();
        showToast("Listo", cityEditing ? "Ciudad actualizada." : "Ciudad creada.", "success");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error creando ciudad";
        setMessage(cityMessage, message);
        showToast("Error", message, "error");
      }
    });
  });
};
var handleCategoryForm = () => {
  if (!categoryForm) return;
  categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (categoryForm.dataset.mode === "view") {
      return;
    }
    const categoryEditing = categoryForm.dataset.mode === "edit";
    setMessage(categoryMessage, categoryEditing ? "Actualizando categor\xEDa..." : "Guardando categor\xEDa...");
    const data = new FormData(categoryForm);
    await withLoading(categoryForm, async () => {
      try {
        const payload = {
          name: data.get("name"),
          slug: String(data.get("slug") ?? "").toLowerCase()
        };
        if (categoryForm.dataset.mode === "edit" && categoryForm.dataset.editId) {
          await apiFetch(`/categories/${categoryForm.dataset.editId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
          });
        } else {
          await apiFetch("/categories", {
            method: "POST",
            body: JSON.stringify(payload)
          });
        }
        categoryForm.reset();
        setMessage(
          categoryMessage,
          categoryEditing ? "Categor\xEDa actualizada." : "Categor\xEDa creada."
        );
        setCategoryForm();
        await loadCategories();
        showToast(
          "Listo",
          categoryEditing ? "Categor\xEDa actualizada." : "Categor\xEDa creada.",
          "success"
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error creando categor\xEDa";
        setMessage(categoryMessage, message);
        showToast("Error", message, "error");
      }
    });
  });
};
var wireSelectors = () => {
  businessSelects.forEach((select) => {
    select.addEventListener("change", async () => {
      if (select.value) {
        if (currentUser?.role === "ADMIN") {
          await loadBranchOptionsForBusiness(select.value);
          return;
        }
        currentBusinessId = select.value;
        setBranchFormEnabled(true);
        setPromoFormEnabled(true);
        await loadBranches(select.value);
        await loadPromotions(select.value);
        updatePromotionsView();
        updateBusinessesView();
      }
    });
  });
};
var wireBusinessActions = () => {
  if (!businessList) return;
  businessList.addEventListener("click", async (event) => {
    const target = event.target;
    const selectId = target.dataset.businessSelect;
    const editId = target.dataset.businessEdit;
    const deleteId = target.dataset.businessDelete;
    if (selectId) {
      if (currentUser?.role === "ADMIN") {
        const business = businesses.find((item) => item._id === selectId);
        if (business) {
          setBusinessForm(business, {
            mode: "view",
            readOnly: true,
            title: "Detalle del negocio"
          });
          setActiveDashboardTab("business");
          openModal("business");
        }
        return;
      }
      currentBusinessId = selectId;
      businessSelects.forEach((select) => {
        select.value = selectId;
      });
      await loadBranches(selectId);
      await loadPromotions(selectId);
      updatePromotionsView();
    }
    if (editId) {
      const business = businesses.find((item) => item._id === editId);
      if (business) {
        setBusinessForm(business, { mode: "edit", readOnly: false, title: "Editar negocio" });
        setActiveDashboardTab("business");
        openModal("business");
        currentBusinessId = business._id;
        businessSelects.forEach((select) => {
          select.value = business._id;
        });
        await loadBranches(business._id);
        await loadPromotions(business._id);
        updatePromotionsView();
      }
    }
    if (deleteId) {
      const confirmed = window.confirm("\xBFEliminar este negocio? Tambi\xE9n perder\xE1s sus sedes y promos.");
      if (!confirmed) return;
      businesses = businesses.filter((business) => business._id !== deleteId);
      updateBusinessesView();
      await apiFetch(`/businesses/${deleteId}`, { method: "DELETE" });
      showToast("Listo", "Negocio eliminado.", "success");
      await loadBusinesses();
      if (businesses.length > 0) {
        currentBusinessId = businesses[0]._id;
        await loadBranches(currentBusinessId);
        await loadPromotions(currentBusinessId);
        updatePromotionsView();
        updateBusinessesView();
      } else {
        currentBusinessId = "";
        branches = [];
        updateBranchCityFilterOptions();
        updateBranchesView();
        promotions = [];
        updatePromotionsView();
        updateBusinessesView();
      }
    }
  });
};
var wireOwnerBusinessEdit = () => {
  if (!ownerBusinessEdit) return;
  ownerBusinessEdit.addEventListener("click", async () => {
    const business = businesses.find((item) => item._id === currentBusinessId) ?? businesses[0];
    if (!business) return;
    setBusinessForm(business, { mode: "edit", readOnly: false, title: "Editar negocio" });
    setActiveDashboardTab("business");
    openModal("business");
  });
};
var wireBranchActions = () => {
  if (!branchList) return;
  branchList.addEventListener("click", async (event) => {
    const target = event.target;
    const viewId = target.dataset.branchView;
    const editId = target.dataset.branchEdit;
    const deleteId = target.dataset.branchDelete;
    if (viewId) {
      const branch = branches.find((item) => item._id === viewId);
      if (branch) {
        setBranchForm(branch, { mode: "view", readOnly: true, title: "Detalle de la sede" });
        setActiveDashboardTab("branches");
        openModal("branch");
        if (currentUser?.role === "ADMIN") {
          await loadBranchOptionsForBusiness(branch.businessId);
          return;
        }
        currentBusinessId = branch.businessId;
        businessSelects.forEach((select) => {
          select.value = branch.businessId;
        });
        await loadBranches(branch.businessId);
      }
      return;
    }
    if (editId) {
      const branch = branches.find((item) => item._id === editId);
      if (branch) {
        setBranchForm(branch, { mode: "edit", readOnly: false, title: "Editar sede" });
        setActiveDashboardTab("branches");
        openModal("branch");
        if (currentUser?.role === "ADMIN") {
          await loadBranchOptionsForBusiness(branch.businessId);
          return;
        }
        currentBusinessId = branch.businessId;
        businessSelects.forEach((select) => {
          select.value = branch.businessId;
        });
        await loadBranches(branch.businessId);
      }
    }
    if (!deleteId) return;
    const confirmed = window.confirm("\xBFEliminar esta sede?");
    if (!confirmed) return;
    branches = branches.filter((branch) => branch._id !== deleteId);
    updateBranchesView();
    await apiFetch(`/branches/${deleteId}`, { method: "DELETE" });
    showToast("Listo", "Sede eliminada.", "success");
    if (currentBusinessId) {
      await loadBranches(currentBusinessId);
    }
  });
};
var wirePromoActions = () => {
  if (!promoList) return;
  promoList.addEventListener("click", async (event) => {
    const target = event.target;
    const instagramLink = target.closest("[data-instagram-link]");
    if (instagramLink) {
      const handle = instagramLink.dataset.instagramHandle ?? "";
      if (handle && isMobileDevice()) {
        event.preventDefault();
        const deepLink = `instagram://user?username=${handle}`;
        window.location.href = deepLink;
        window.setTimeout(() => {
          window.open(`https://instagram.com/${handle}`, "_blank", "noopener");
        }, 500);
      }
      return;
    }
    const viewId = target.dataset.promoView;
    const editId = target.dataset.promoEdit;
    const deleteId = target.dataset.promoDelete;
    if (viewId) {
      let promo = promotions.find((item) => item._id === viewId);
      if (!promo && currentBusinessId) {
        const promos = await loadPromotions(currentBusinessId);
        promo = promos.find((item) => item._id === viewId);
      }
      if (promo) {
        await setPromoForm(promo, {
          mode: "view",
          readOnly: true,
          title: "Detalle de la promoci\xF3n"
        });
        setActiveDashboardTab("promos");
        openModal("promo");
      }
      return;
    }
    if (editId) {
      let promo = promotions.find((item) => item._id === editId);
      if (!promo && currentBusinessId) {
        const promos = await loadPromotions(currentBusinessId);
        promo = promos.find((item) => item._id === editId);
      }
      if (promo) {
        await setPromoForm(promo, { mode: "edit", readOnly: false, title: "Editar promoci\xF3n" });
        setActiveDashboardTab("promos");
        openModal("promo");
      }
    }
    if (!deleteId) return;
    const confirmed = window.confirm("\xBFEliminar esta promoci\xF3n?");
    if (!confirmed) return;
    promotions = promotions.filter((promo) => promo._id !== deleteId);
    updatePromotionsView();
    await apiFetch(`/promotions/${deleteId}`, { method: "DELETE" });
    showToast("Listo", "Promoci\xF3n eliminada.", "success");
    if (currentBusinessId) {
      await loadPromotions(currentBusinessId);
      updatePromotionsView();
    }
  });
};
var wireEmptyStateActions = () => {
  document.body.addEventListener("click", (event) => {
    const target = event.target;
    const action = target.dataset.emptyAction;
    if (!action) return;
    focusCreateForm(action);
  });
};
var wireCancelButtons = () => {
};
var wireDashboardTabs = () => {
  if (dashboardTabs.length === 0) return;
  dashboardTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.dashboardTab ?? "promos";
      setActiveDashboardTab(tab);
      setDashboardMenuOpen(false);
    });
  });
  setActiveDashboardTab(activeDashboardTab);
};
var wireDashboardMenu = () => {
  if (!dashboardMenu || !dashboardOverlay || !dashboardToggle) return;
  const closeMenu = () => setDashboardMenuOpen(false);
  dashboardToggle.addEventListener("click", () => setDashboardMenuOpen(true));
  dashboardClose?.addEventListener("click", closeMenu);
  dashboardOverlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
};
var wireDashboardCreateButtons = () => {
  if (dashboardCreateButtons.length === 0) return;
  dashboardCreateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.dashboardCreate;
      if (!target) return;
      focusCreateForm(target);
    });
  });
};
var wireDashboardDelegates = () => {
  document.addEventListener("click", (event) => {
    const target = event.target;
    const tabButton = target.closest("[data-dashboard-tab]");
    if (tabButton?.dataset.dashboardTab) {
      event.preventDefault();
      setActiveDashboardTab(tabButton.dataset.dashboardTab);
      setDashboardMenuOpen(false);
      return;
    }
    const createButton = target.closest("[data-dashboard-create]");
    if (createButton?.dataset.dashboardCreate) {
      event.preventDefault();
      focusCreateForm(createButton.dataset.dashboardCreate);
    }
  });
};
var wireDashboardModal = () => {
  const wireModal = (overlay, closeButton) => {
    if (!overlay) return;
    const closeModal = () => closeAllModals();
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeModal();
      }
    });
    closeButton?.addEventListener("click", closeModal);
  };
  wireModal(promoModalOverlay, promoModalClose);
  wireModal(branchModalOverlay, branchModalClose);
  wireModal(businessModalOverlay, businessModalClose);
  wireModal(cityModalOverlay, cityModalClose);
  wireModal(categoryModalOverlay, categoryModalClose);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });
};
var wirePromoFilters = () => {
  if (!promoSearchInput || !promoStatusSelect || !promoTypeSelect) return;
  const updateFilters = () => {
    promoFilters = {
      search: promoSearchInput.value,
      status: promoStatusSelect.value,
      type: promoTypeSelect.value,
      businessId: promoBusinessFilter?.value ?? "all"
    };
    adminPromoPage = 1;
    updatePromotionsView();
  };
  promoSearchInput.addEventListener("input", updateFilters);
  promoStatusSelect.addEventListener("change", updateFilters);
  promoTypeSelect.addEventListener("change", updateFilters);
  promoBusinessFilter?.addEventListener("change", updateFilters);
};
var wirePromoPagination = () => {
  if (!promoPagePrev || !promoPageNext) return;
  promoPagePrev.addEventListener("click", () => {
    adminPromoPage = Math.max(1, adminPromoPage - 1);
    updatePromotionsView();
  });
  promoPageNext.addEventListener("click", () => {
    adminPromoPage += 1;
    updatePromotionsView();
  });
};
var wireBranchPagination = () => {
  if (!branchPagePrev || !branchPageNext) return;
  branchPagePrev.addEventListener("click", () => {
    adminBranchPage = Math.max(1, adminBranchPage - 1);
    updateBranchesView();
  });
  branchPageNext.addEventListener("click", () => {
    adminBranchPage += 1;
    updateBranchesView();
  });
};
var wireBusinessPagination = () => {
  if (!businessPagePrev || !businessPageNext) return;
  businessPagePrev.addEventListener("click", () => {
    adminBusinessPage = Math.max(1, adminBusinessPage - 1);
    updateBusinessesView();
  });
  businessPageNext.addEventListener("click", () => {
    adminBusinessPage += 1;
    updateBusinessesView();
  });
};
var wireCityPagination = () => {
  if (!cityPagePrev || !cityPageNext) return;
  cityPagePrev.addEventListener("click", () => {
    adminCityPage = Math.max(1, adminCityPage - 1);
    renderCities();
  });
  cityPageNext.addEventListener("click", () => {
    adminCityPage += 1;
    renderCities();
  });
};
var wireCategoryPagination = () => {
  if (!categoryPagePrev || !categoryPageNext) return;
  categoryPagePrev.addEventListener("click", () => {
    adminCategoryPage = Math.max(1, adminCategoryPage - 1);
    renderCategories();
  });
  categoryPageNext.addEventListener("click", () => {
    adminCategoryPage += 1;
    renderCategories();
  });
};
var wireBranchFilters = () => {
  if (!branchSearchInput || !branchCityFilter) return;
  const updateFilters = () => {
    branchFilters = {
      search: branchSearchInput.value,
      city: branchCityFilter.value,
      businessId: branchBusinessFilter?.value ?? "all"
    };
    adminBranchPage = 1;
    updateBranchesView();
  };
  branchSearchInput.addEventListener("input", updateFilters);
  branchCityFilter.addEventListener("change", updateFilters);
  branchBusinessFilter?.addEventListener("change", updateFilters);
};
var wireBusinessFilters = () => {
  if (!businessSearchInput || !businessTypeFilter) return;
  const updateFilters = () => {
    businessFilters = {
      search: businessSearchInput.value,
      type: businessTypeFilter.value,
      city: businessCityFilter?.value ?? "all",
      category: businessCategoryFilter?.value ?? "all",
      verified: businessVerifiedFilter?.value ?? "all",
      instagram: businessInstagramFilter?.value ?? "all"
    };
    adminBusinessPage = 1;
    updateBusinessesView();
  };
  businessSearchInput.addEventListener("input", updateFilters);
  businessTypeFilter.addEventListener("change", updateFilters);
  businessCityFilter?.addEventListener("change", updateFilters);
  businessCategoryFilter?.addEventListener("change", updateFilters);
  businessVerifiedFilter?.addEventListener("change", updateFilters);
  businessInstagramFilter?.addEventListener("change", updateFilters);
};
(async () => {
  setDashboardLoading(true);
  try {
    setBusinessForm();
    setBranchForm();
    setPromoForm();
    setCityForm();
    setCategoryForm();
    closeAllModals();
    await loadUser();
    if (currentUser) {
      await loadBusinesses();
      await loadCities();
      await loadCategories();
    }
    updateBusinessesView();
    populateBusinessSelects();
    updateBranchesView();
    updatePromotionsView();
    wireSelectors();
    wireBusinessActions();
    wireBranchActions();
    wirePromoActions();
    wireEmptyStateActions();
    wireCancelButtons();
    wireDashboardTabs();
    wireDashboardCreateButtons();
    wireDashboardDelegates();
    wireDashboardMenu();
    wireDashboardModal();
    wirePromoFilters();
    wirePromoPagination();
    wireBranchFilters();
    wireBranchPagination();
    wireBusinessFilters();
    wireBusinessPagination();
    wireCityPagination();
    wireCategoryPagination();
    wireOwnerBusinessEdit();
    handleBusinessForm();
    handleBranchForm();
    handlePromoForm();
    if (currentUser?.role === "ADMIN") {
      handleCityForm();
      handleCategoryForm();
      wireAdminActions();
    }
  } finally {
    setDashboardLoading(false);
  }
})();
