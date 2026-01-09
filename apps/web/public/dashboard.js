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

// apps/web/src/scripts/dashboard.ts
var isMobileDevice = () => /android|iphone|ipad|ipod/i.test(navigator.userAgent);
var userCard = document.querySelector("[data-user-card]");
var businessList = document.querySelector("[data-business-list]");
var branchList = document.querySelector("[data-branch-list]");
var promoList = document.querySelector("[data-promo-list]");
var businessSelects = Array.from(
  document.querySelectorAll("[data-business-select]")
);
var branchSelect = document.querySelector("[data-branch-select]");
var businessForm = document.querySelector("[data-business-form]");
var businessMessage = document.querySelector("[data-business-message]");
var businessMode = document.querySelector("[data-business-mode]");
var businessCancel = document.querySelector("[data-business-cancel]");
var branchForm = document.querySelector("[data-branch-form]");
var branchMessage = document.querySelector("[data-branch-message]");
var branchMode = document.querySelector("[data-branch-mode]");
var branchCancel = document.querySelector("[data-branch-cancel]");
var promoForm = document.querySelector("[data-promo-form]");
var promoMessage = document.querySelector("[data-promo-message]");
var promoMode = document.querySelector("[data-promo-mode]");
var promoCancel = document.querySelector("[data-promo-cancel]");
var promoSearchInput = document.querySelector("[data-promo-search]");
var promoStatusSelect = document.querySelector("[data-promo-status]");
var promoTypeSelect = document.querySelector("[data-promo-type]");
var promoKpiTotal = document.querySelector("[data-promo-kpi-total]");
var promoKpiActive = document.querySelector("[data-promo-kpi-active]");
var promoKpiInactive = document.querySelector("[data-promo-kpi-inactive]");
var branchSearchInput = document.querySelector("[data-branch-search]");
var branchCityFilter = document.querySelector("[data-branch-city-filter]");
var branchKpiTotal = document.querySelector("[data-branch-kpi-total]");
var branchKpiCities = document.querySelector("[data-branch-kpi-cities]");
var branchKpiPhones = document.querySelector("[data-branch-kpi-phones]");
var businessSearchInput = document.querySelector("[data-business-search]");
var businessTypeFilter = document.querySelector("[data-business-type-filter]");
var businessKpiTotal = document.querySelector("[data-business-kpi-total]");
var businessKpiBranches = document.querySelector("[data-business-kpi-branches]");
var businessKpiPromos = document.querySelector("[data-business-kpi-promos]");
var adminPanel = document.querySelector("[data-admin-panel]");
var cityForm = document.querySelector("[data-city-form]");
var cityMessage = document.querySelector("[data-city-message]");
var cityList = document.querySelector("[data-city-list]");
var cityMode = document.querySelector("[data-city-mode]");
var cityCancel = document.querySelector("[data-city-cancel]");
var categoryForm = document.querySelector("[data-category-form]");
var categoryMessage = document.querySelector("[data-category-message]");
var categoryList = document.querySelector("[data-category-list]");
var categoryMode = document.querySelector("[data-category-mode]");
var categoryCancel = document.querySelector("[data-category-cancel]");
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
var dashboardTabs = Array.from(
  document.querySelectorAll("[data-dashboard-tab]")
);
var dashboardPanels = Array.from(
  document.querySelectorAll("[data-dashboard-panel]")
);
var dashboardCreateButtons = Array.from(
  document.querySelectorAll("[data-dashboard-create]")
);
var promoModalOverlay = document.querySelector("[data-promo-modal-overlay]");
var promoModal = document.querySelector("[data-promo-modal]");
var promoModalClose = document.querySelector("[data-promo-modal-close]");
var branchModalOverlay = document.querySelector("[data-branch-modal-overlay]");
var branchModal = document.querySelector("[data-branch-modal]");
var branchModalClose = document.querySelector("[data-branch-modal-close]");
var businessModalOverlay = document.querySelector("[data-business-modal-overlay]");
var businessModal = document.querySelector("[data-business-modal]");
var businessModalClose = document.querySelector("[data-business-modal-close]");
var demoFillButtons = Array.from(
  document.querySelectorAll("[data-demo-fill]")
);
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
  type: "all"
};
var branchFilters = {
  search: "",
  city: "all"
};
var businessFilters = {
  search: "",
  type: "all"
};
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
    label.textContent = mode === "edit" ? "Modo edici\xF3n" : "Modo crear";
  }
  if (cancel) {
    cancel.hidden = mode !== "edit";
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
var setMultiSelectValues = (select, values) => {
  if (!select) return;
  Array.from(select.options).forEach((option) => {
    option.selected = values.includes(option.value);
  });
};
var formatDateInput = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};
var setBusinessForm = (business) => {
  if (!businessForm) return;
  if (!business) {
    businessForm.reset();
    businessForm.dataset.editId = "";
    setMode(businessForm, businessMode, businessCancel, "create");
    if (categorySuggestions) {
      Array.from(categorySuggestions.options).forEach((option) => {
        option.selected = false;
      });
    }
    return;
  }
  businessForm.dataset.editId = business._id;
  setMode(businessForm, businessMode, businessCancel, "edit");
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
var setBranchForm = (branch) => {
  if (!branchForm) return;
  if (!branch) {
    branchForm.reset();
    branchForm.dataset.editId = "";
    setMode(branchForm, branchMode, branchCancel, "create");
    return;
  }
  branchForm.dataset.editId = branch._id;
  setMode(branchForm, branchMode, branchCancel, "edit");
  setInputValue(branchForm, "businessId", branch.businessId);
  setInputValue(branchForm, "city", branch.city);
  setInputValue(branchForm, "address", branch.address);
  setInputValue(branchForm, "zone", branch.zone ?? "");
  setInputValue(branchForm, "phone", branch.phone ?? "");
};
var setPromoForm = async (promo) => {
  if (!promoForm) return;
  if (!promo) {
    promoForm.reset();
    promoForm.dataset.editId = "";
    setMode(promoForm, promoMode, promoCancel, "create");
    return;
  }
  promoForm.dataset.editId = promo._id;
  setMode(promoForm, promoMode, promoCancel, "edit");
  setInputValue(promoForm, "businessId", promo.businessId);
  if (promo.businessId) {
    currentBusinessId = promo.businessId;
    await loadBranches(promo.businessId);
  }
  setInputValue(promoForm, "branchId", promo.branchId ?? "");
  setInputValue(promoForm, "title", promo.title);
  setInputValue(promoForm, "description", promo.description ?? "");
  setInputValue(promoForm, "promoType", promo.promoType);
  setInputValue(promoForm, "value", promo.value ? String(promo.value) : "");
  setInputValue(promoForm, "startDate", formatDateInput(promo.startDate));
  setInputValue(promoForm, "endDate", formatDateInput(promo.endDate));
  setInputValue(promoForm, "startHour", promo.startHour);
  setInputValue(promoForm, "endHour", promo.endHour);
  const dayInputs = promoForm.querySelectorAll('input[name="daysOfWeek"]');
  dayInputs.forEach((input) => {
    input.checked = promo.daysOfWeek.includes(input.value);
  });
  const activeInput = promoForm.querySelector('input[name="active"]');
  if (activeInput) {
    activeInput.checked = promo.active ?? true;
  }
};
var setCityForm = (city) => {
  if (!cityForm) return;
  if (!city) {
    cityForm.reset();
    cityForm.dataset.editId = "";
    setMode(cityForm, cityMode, cityCancel, "create");
    return;
  }
  cityForm.dataset.editId = city._id;
  setMode(cityForm, cityMode, cityCancel, "edit");
  setInputValue(cityForm, "name", city.name);
  setInputValue(cityForm, "countryCode", city.countryCode);
};
var setCategoryForm = (category) => {
  if (!categoryForm) return;
  if (!category) {
    categoryForm.reset();
    categoryForm.dataset.editId = "";
    setMode(categoryForm, categoryMode, categoryCancel, "create");
    return;
  }
  categoryForm.dataset.editId = category._id;
  setMode(categoryForm, categoryMode, categoryCancel, "edit");
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
var closeAllModals = () => {
  const setHidden = (overlay, hidden) => {
    if (!overlay) return;
    overlay.hidden = hidden;
    overlay.classList.toggle("hidden", hidden);
  };
  setHidden(promoModalOverlay, true);
  setHidden(branchModalOverlay, true);
  setHidden(businessModalOverlay, true);
};
var openModal = (type) => {
  closeAllModals();
  const modalMap = {
    promo: { overlay: promoModalOverlay, modal: promoModal },
    branch: { overlay: branchModalOverlay, modal: branchModal },
    business: { overlay: businessModalOverlay, modal: businessModal }
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
    setActiveDashboardTab("business");
    setBusinessForm();
    openModal("business");
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
      <button class="rounded-full border border-ink-900/20 px-3 py-1 text-xs" data-logout>Salir</button>
    </div>
  `;
  const logoutButton = userCard.querySelector("[data-logout]");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      await apiFetch("/auth/logout", { method: "POST" });
      window.location.href = "/login";
    });
  }
  const ownerAccess = currentUser.role === "BUSINESS_OWNER" || currentUser.role === "ADMIN";
  setFormsEnabled(ownerAccess);
  setOwnerSectionsVisible(ownerAccess);
  setAuthGateVisible(!ownerAccess);
  setDashboardMenuVisible(ownerAccess);
  if (ownerAccess) {
    setActiveDashboardTab(activeDashboardTab);
  }
  if (dashboardHero) {
    dashboardHero.hidden = !ownerAccess;
  }
  if (!ownerAccess && authGateText) {
    authGateText.textContent = "Tu usuario es de tipo visitante. Necesitas una cuenta de negocio para administrar promociones.";
  }
  if (adminPanel) {
    adminPanel.hidden = currentUser.role !== "ADMIN";
  }
  if (!ownerAccess) {
    setMessage(businessMessage, "Necesitas rol BUSINESS_OWNER para crear negocios.");
  }
};
var getFilteredBusinesses = () => {
  const searchValue = businessFilters.search.trim().toLowerCase();
  return businesses.filter((business) => {
    const typeMatch = businessFilters.type === "all" || business.type === businessFilters.type;
    const textMatch = searchValue.length === 0 || business.name.toLowerCase().includes(searchValue) || business.slug.toLowerCase().includes(searchValue) || (business.description ?? "").toLowerCase().includes(searchValue);
    return typeMatch && textMatch;
  });
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
    <div class="hidden md:grid md:grid-cols-[1.6fr,1fr,1fr,auto] md:gap-4 md:px-4 md:text-xs md:uppercase md:tracking-[0.2em] text-ink-900/50">
      <span>Negocio</span>
      <span>Slug</span>
      <span>Tipo</span>
      <span>Acciones</span>
    </div>
    ${list.map(
    (business) => `
          <div class="rounded-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
            <div class="grid gap-3 md:grid-cols-[1.6fr,1fr,1fr,auto] md:items-center">
              <div>
                <p class="text-sm font-semibold">${business.name}</p>
                <p class="text-xs text-ink-900/60 md:hidden">${business.slug} \xB7 ${business.type}</p>
              </div>
              <p class="hidden text-xs text-ink-900/70 md:block">${business.slug}</p>
              <p class="hidden text-xs text-ink-900/70 md:block">${business.type}</p>
              <div class="flex flex-wrap gap-2 text-xs">
                <button class="rounded-full border border-ink-900/20 px-3 py-1" data-business-select="${business._id}">Ver</button>
                <button class="rounded-full border border-ink-900/20 px-3 py-1" data-business-edit="${business._id}">Editar</button>
                <button class="rounded-full border border-ink-900/20 px-3 py-1" data-business-delete="${business._id}">Eliminar</button>
              </div>
            </div>
          </div>
        `
  ).join("")}
  `;
};
var populateBusinessSelects = () => {
  businessSelects.forEach((select) => {
    const selected = select.value;
    if (businesses.length === 0) {
      select.innerHTML = '<option value="">Sin negocios</option>';
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
var populateBranchSelect = (businessId) => {
  if (!branchSelect) return;
  const filtered = branches.filter((branch) => branch.businessId === businessId);
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
    const cityMatch = branchFilters.city === "all" || branch.city === branchFilters.city;
    const textMatch = searchValue.length === 0 || branch.city.toLowerCase().includes(searchValue) || branch.address.toLowerCase().includes(searchValue) || (branch.zone ?? "").toLowerCase().includes(searchValue) || (branch.phone ?? "").toLowerCase().includes(searchValue);
    return cityMatch && textMatch;
  });
};
var renderBranches = (list, total) => {
  if (!branchList) return;
  if (!currentBusinessId) {
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
        No hay sedes para este negocio.
        <button class="mt-3 inline-flex text-xs underline" data-empty-action="branch">
          Crear sede
        </button>
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
  branchList.innerHTML = `
    <div class="hidden md:grid md:grid-cols-[1fr,1.6fr,1fr,auto] md:gap-4 md:px-4 md:text-xs md:uppercase md:tracking-[0.2em] text-ink-900/50">
      <span>Ciudad</span>
      <span>Direcci\xF3n</span>
      <span>Contacto</span>
      <span>Acciones</span>
    </div>
    ${list.map(
    (branch) => `
          <div class="rounded-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
            <div class="grid gap-3 md:grid-cols-[1fr,1.6fr,1fr,auto] md:items-center">
              <div>
                <p class="text-sm font-semibold">${branch.city}</p>
                <p class="text-xs text-ink-900/60 md:hidden">${branch.address}</p>
              </div>
              <p class="hidden text-xs text-ink-900/70 md:block">${branch.address}</p>
              <p class="hidden text-xs text-ink-900/70 md:block">${branch.phone ?? "Sin tel\xE9fono"}</p>
              <div class="flex flex-wrap gap-2 text-xs">
                <button class="rounded-full border border-ink-900/20 px-3 py-1" data-branch-edit="${branch._id}">Editar</button>
                <button class="rounded-full border border-ink-900/20 px-3 py-1" data-branch-delete="${branch._id}">Eliminar</button>
              </div>
            </div>
          </div>
        `
  ).join("")}
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
var getFilteredPromotions = () => {
  const searchValue = promoFilters.search.trim().toLowerCase();
  return promotions.filter((promo) => {
    const statusMatch = promoFilters.status === "all" || promoFilters.status === "active" && (promo.active ?? true) || promoFilters.status === "inactive" && !(promo.active ?? true);
    const typeMatch = promoFilters.type === "all" || promo.promoType === promoFilters.type;
    const textMatch = searchValue.length === 0 || promo.title.toLowerCase().includes(searchValue) || (promo.description ?? "").toLowerCase().includes(searchValue);
    return statusMatch && typeMatch && textMatch;
  });
};
var renderPromotions = (promos, total) => {
  if (!promoList) return;
  if (!currentBusinessId) {
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
  const business = businesses.find((item) => item._id === currentBusinessId);
  const instagramHandle = (business?.instagram ?? "").replace("@", "").trim();
  const instagramLink = instagramHandle ? `<a class="underline" data-instagram-link data-instagram-handle="${instagramHandle}" href="https://instagram.com/${instagramHandle}" target="_blank" rel="noreferrer">@${instagramHandle}</a>` : "";
  promoList.innerHTML = `
    <div class="hidden md:grid md:grid-cols-[1.6fr,0.8fr,0.8fr,auto] md:gap-4 md:px-4 md:text-xs md:uppercase md:tracking-[0.2em] text-ink-900/50">
      <span>Promoci\xF3n</span>
      <span>Tipo</span>
      <span>Estado</span>
      <span>Acciones</span>
    </div>
    ${promos.map((promo) => {
    const isActive = promo.active ?? true;
    const statusLabel = isActive ? "Activa" : "Inactiva";
    const dateLabel = promo.startDate && promo.endDate ? `${promo.startDate.slice(0, 10)} \u2192 ${promo.endDate.slice(0, 10)}` : "Sin fechas";
    return `
          <div class="rounded-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
            <div class="grid gap-3 md:grid-cols-[1.6fr,0.8fr,0.8fr,auto] md:items-center">
              <div>
                <p class="text-sm font-semibold">${promo.title}</p>
                <p class="text-xs text-ink-900/60">${dateLabel}</p>
                ${instagramLink ? `<div class="mt-1 text-xs text-ink-900/60">${instagramLink}</div>` : ""}
              </div>
              <p class="hidden text-xs text-ink-900/70 md:block">${promo.promoType}</p>
              <span class="hidden w-fit rounded-full border border-ink-900/20 px-3 py-1 text-xs md:inline-flex">
                ${statusLabel}
              </span>
              <div class="flex flex-wrap gap-2 text-xs">
                <button class="rounded-full border border-ink-900/20 px-3 py-1" data-promo-edit="${promo._id}">Editar</button>
                <button class="rounded-full border border-ink-900/20 px-3 py-1" data-promo-delete="${promo._id}">Eliminar</button>
              </div>
            </div>
          </div>
        `;
  }).join("")}
  `;
};
var updatePromotionsView = () => {
  updatePromoKpis();
  renderPromotions(getFilteredPromotions(), promotions.length);
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
var updateBranchesView = () => {
  updateBranchCityFilterOptions();
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
  renderBranches(getFilteredBranches(), total);
  updateBusinessesView();
};
var updateBusinessesView = () => {
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
  renderBusinesses(getFilteredBusinesses(), total);
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
  renderUser();
};
var loadBusinesses = async () => {
  if (!currentUser) return;
  renderLoadingMessage(businessList, "Cargando negocios...");
  businessSelects.forEach((select) => setSelectLoading(select, "Cargando negocios..."));
  const response = await apiFetch("/businesses/mine");
  businesses = response;
  businessFilters = { search: "", type: "all" };
  if (businessSearchInput) {
    businessSearchInput.value = "";
  }
  if (businessTypeFilter) {
    businessTypeFilter.value = "all";
  }
  updateBusinessesView();
  populateBusinessSelects();
  const hasBusinesses = businesses.length > 0;
  setBranchFormEnabled(hasBusinesses);
  setPromoFormEnabled(hasBusinesses);
  if (!hasBusinesses) {
    setSelectLoading(branchSelect, "Sin sedes");
  }
  if (businesses.length > 0) {
    currentBusinessId = businesses[0]._id;
    await loadBranches(currentBusinessId);
    await loadPromotions(currentBusinessId);
    updatePromotionsView();
    updateBusinessesView();
  }
};
var loadBranches = async (businessId) => {
  renderLoadingMessage(branchList, "Cargando sedes...");
  setSelectLoading(branchSelect, "Cargando sedes...");
  const response = await apiFetch(`/branches?businessId=${businessId}`);
  branches = response;
  branchFilters = { search: "", city: "all" };
  if (branchSearchInput) {
    branchSearchInput.value = "";
  }
  populateBranchSelect(businessId);
  if (branchCityFilter) {
    branchCityFilter.value = "all";
  }
  updateBranchesView();
};
var loadPromotions = async (businessId) => {
  if (!businessId) return [];
  renderLoadingMessage(promoList, "Cargando promociones...");
  const response = await apiFetch(`/promotions?businessId=${businessId}`);
  promotions = response;
  return response;
};
var renderCities = () => {
  if (!cityList) return;
  if (cities.length === 0) {
    cityList.innerHTML = '<p class="text-ink-900/60">Sin ciudades registradas.</p>';
    return;
  }
  cityList.innerHTML = cities.map(
    (city) => `
        <div class="flex items-center justify-between rounded-2xl border border-ink-900/10 bg-white/70 px-4 py-2">
          <div>
            <p class="font-semibold">${city.name}</p>
            <p class="text-xs text-ink-900/60">${city.countryCode}</p>
          </div>
          <div class="flex gap-2 text-xs">
            <button class="underline" data-city-edit="${city._id}">Editar</button>
            <button class="underline" data-city-delete="${city._id}">Eliminar</button>
          </div>
        </div>
      `
  ).join("");
};
var renderCategories = () => {
  if (!categoryList) return;
  if (categories.length === 0) {
    categoryList.innerHTML = '<p class="text-ink-900/60">Sin categor\xEDas registradas.</p>';
    return;
  }
  categoryList.innerHTML = categories.map(
    (category) => `
        <div class="flex items-center justify-between rounded-2xl border border-ink-900/10 bg-white/70 px-4 py-2">
          <div>
            <p class="font-semibold">${category.name}</p>
            <p class="text-xs text-ink-900/60">${category.slug}</p>
          </div>
          <div class="flex gap-2 text-xs">
            <button class="underline" data-category-edit="${category._id}">Editar</button>
            <button class="underline" data-category-delete="${category._id}">Eliminar</button>
          </div>
        </div>
      `
  ).join("");
};
var loadCities = async () => {
  renderLoadingMessage(cityList, "Cargando ciudades...");
  setSelectLoading(branchCitySelect, "Cargando ciudades...");
  cities = await apiFetch("/cities");
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
      const editId = target.dataset.cityEdit;
      const id = target.dataset.cityDelete;
      if (editId) {
        const city = cities.find((item) => item._id === editId);
        if (city) {
          setCityForm(city);
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
      const editId = target.dataset.categoryEdit;
      const id = target.dataset.categoryDelete;
      if (editId) {
        const category = categories.find((item) => item._id === editId);
        if (category) {
          setCategoryForm(category);
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
  promoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const promoEditing = promoForm.dataset.mode === "edit";
    setMessage(promoMessage, promoEditing ? "Actualizando promoci\xF3n..." : "Guardando promoci\xF3n...");
    const data = new FormData(promoForm);
    const days = data.getAll("daysOfWeek").map((day) => String(day));
    const startDate = String(data.get("startDate"));
    const endDate = String(data.get("endDate"));
    const startDateIso = startDate ? (/* @__PURE__ */ new Date(`${startDate}T00:00:00`)).toISOString() : "";
    const endDateIso = endDate ? (/* @__PURE__ */ new Date(`${endDate}T23:59:59`)).toISOString() : "";
    if (days.length === 0) {
      const message = "Selecciona al menos un d\xEDa de la semana.";
      setMessage(promoMessage, message);
      showToast("Error", message, "error");
      return;
    }
    if (startDate && endDate && !isValidDateRange(startDateIso, endDateIso)) {
      const message = "La fecha de fin debe ser posterior a la fecha de inicio.";
      setMessage(promoMessage, message);
      showToast("Error", message, "error");
      return;
    }
    if (!isValidTimeRange(String(data.get("startHour") ?? ""), String(data.get("endHour") ?? ""))) {
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
          promoType: data.get("promoType"),
          value: data.get("value") || void 0,
          startDate: startDateIso,
          endDate: endDateIso,
          daysOfWeek: days,
          startHour: data.get("startHour"),
          endHour: data.get("endHour"),
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
        setBusinessForm(business);
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
var wireBranchActions = () => {
  if (!branchList) return;
  branchList.addEventListener("click", async (event) => {
    const target = event.target;
    const editId = target.dataset.branchEdit;
    const deleteId = target.dataset.branchDelete;
    if (editId) {
      const branch = branches.find((item) => item._id === editId);
      if (branch) {
        setBranchForm(branch);
        setActiveDashboardTab("branches");
        openModal("branch");
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
    const editId = target.dataset.promoEdit;
    const deleteId = target.dataset.promoDelete;
    if (editId) {
      let promo = promotions.find((item) => item._id === editId);
      if (!promo && currentBusinessId) {
        const promos = await loadPromotions(currentBusinessId);
        promo = promos.find((item) => item._id === editId);
      }
      if (promo) {
        await setPromoForm(promo);
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
  businessCancel?.addEventListener("click", () => {
    setBusinessForm();
    closeAllModals();
  });
  branchCancel?.addEventListener("click", () => {
    setBranchForm();
    closeAllModals();
  });
  promoCancel?.addEventListener("click", () => {
    setPromoForm();
    closeAllModals();
  });
  cityCancel?.addEventListener("click", () => setCityForm());
  categoryCancel?.addEventListener("click", () => setCategoryForm());
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
      type: promoTypeSelect.value
    };
    updatePromotionsView();
  };
  promoSearchInput.addEventListener("input", updateFilters);
  promoStatusSelect.addEventListener("change", updateFilters);
  promoTypeSelect.addEventListener("change", updateFilters);
};
var wireBranchFilters = () => {
  if (!branchSearchInput || !branchCityFilter) return;
  const updateFilters = () => {
    branchFilters = {
      search: branchSearchInput.value,
      city: branchCityFilter.value
    };
    updateBranchesView();
  };
  branchSearchInput.addEventListener("input", updateFilters);
  branchCityFilter.addEventListener("change", updateFilters);
};
var wireBusinessFilters = () => {
  if (!businessSearchInput || !businessTypeFilter) return;
  const updateFilters = () => {
    businessFilters = {
      search: businessSearchInput.value,
      type: businessTypeFilter.value
    };
    updateBusinessesView();
  };
  businessSearchInput.addEventListener("input", updateFilters);
  businessTypeFilter.addEventListener("change", updateFilters);
};
var formatDateFromDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
var fillDemoPromo = () => {
  if (!promoForm) return;
  if (businesses.length === 0) {
    showToast("Primero crea un negocio", "Necesitas un negocio para asociar la promo.", "info");
    return;
  }
  const businessId = currentBusinessId || businesses[0]._id;
  const today = /* @__PURE__ */ new Date();
  const nextWeek = /* @__PURE__ */ new Date();
  nextWeek.setDate(today.getDate() + 7);
  setInputValue(promoForm, "businessId", businessId);
  setInputValue(promoForm, "branchId", branches[0]?._id ?? "");
  setInputValue(promoForm, "title", "Promo demo negocio@demo.com");
  setInputValue(
    promoForm,
    "description",
    "Promo de prueba para el usuario negocio@demo.com (almuerzo y tarde)."
  );
  setInputValue(promoForm, "promoType", "2x1");
  setInputValue(promoForm, "value", "2x1");
  setInputValue(promoForm, "startDate", formatDateFromDate(today));
  setInputValue(promoForm, "endDate", formatDateFromDate(nextWeek));
  setInputValue(promoForm, "startHour", "12:00");
  setInputValue(promoForm, "endHour", "18:00");
  promoForm.querySelectorAll('input[name="daysOfWeek"]').forEach((input) => {
    input.checked = ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(input.value);
  });
};
var fillDemoPromoAlt = () => {
  if (!promoForm) return;
  if (businesses.length === 0) {
    showToast("Primero crea un negocio", "Necesitas un negocio para asociar la promo.", "info");
    return;
  }
  const businessId = currentBusinessId || businesses[0]._id;
  const today = /* @__PURE__ */ new Date();
  const nextMonth = /* @__PURE__ */ new Date();
  nextMonth.setDate(today.getDate() + 30);
  setInputValue(promoForm, "businessId", businessId);
  setInputValue(promoForm, "branchId", branches[0]?._id ?? "");
  setInputValue(promoForm, "title", "Promo demo happy hour");
  setInputValue(
    promoForm,
    "description",
    "Promo demo para negocio@demo.com con horario nocturno."
  );
  setInputValue(promoForm, "promoType", "discount");
  setInputValue(promoForm, "value", "30%");
  setInputValue(promoForm, "startDate", formatDateFromDate(today));
  setInputValue(promoForm, "endDate", formatDateFromDate(nextMonth));
  setInputValue(promoForm, "startHour", "18:00");
  setInputValue(promoForm, "endHour", "22:00");
  promoForm.querySelectorAll('input[name="daysOfWeek"]').forEach((input) => {
    input.checked = ["friday", "saturday", "sunday"].includes(input.value);
  });
};
var fillDemoBranch = () => {
  if (!branchForm) return;
  if (businesses.length === 0) {
    showToast("Primero crea un negocio", "Necesitas un negocio para crear la sede.", "info");
    return;
  }
  if (cities.length === 0) {
    showToast("Agrega una ciudad", "Necesitas una ciudad disponible para la sede.", "info");
    return;
  }
  const businessId = currentBusinessId || businesses[0]._id;
  setInputValue(branchForm, "businessId", businessId);
  setInputValue(branchForm, "city", cities[0].name);
  setInputValue(branchForm, "address", "Carrera 7 # 12-45");
  setInputValue(branchForm, "zone", "Zona demo");
  setInputValue(branchForm, "phone", "3005551212");
};
var fillDemoBranchAlt = () => {
  if (!branchForm) return;
  if (businesses.length === 0) {
    showToast("Primero crea un negocio", "Necesitas un negocio para crear la sede.", "info");
    return;
  }
  if (cities.length === 0) {
    showToast("Agrega una ciudad", "Necesitas una ciudad disponible para la sede.", "info");
    return;
  }
  const businessId = currentBusinessId || businesses[0]._id;
  const city = cities.length > 1 ? cities[1].name : cities[0].name;
  setInputValue(branchForm, "businessId", businessId);
  setInputValue(branchForm, "city", city);
  setInputValue(branchForm, "address", "Avenida 5 # 18-90");
  setInputValue(branchForm, "zone", "Zona norte");
  setInputValue(branchForm, "phone", "3019876543");
};
var fillDemoBusiness = () => {
  if (!businessForm) return;
  setInputValue(businessForm, "name", "Negocio demo negocio@demo.com");
  setInputValue(businessForm, "slug", "negocio-demo-negocio");
  setInputValue(businessForm, "type", "restaurant");
  setInputValue(
    businessForm,
    "description",
    "Negocio de prueba para el usuario negocio@demo.com."
  );
  setInputValue(businessForm, "instagram", "negocio.demo");
  const categorySelect = businessForm.querySelector("[name='categories']");
  if (categories.length > 0) {
    setMultiSelectValues(
      categorySelect,
      categories.slice(0, 2).map((category) => category.slug)
    );
  }
};
var fillDemoBusinessAlt = () => {
  if (!businessForm) return;
  setInputValue(businessForm, "name", "Negocio demo 2 negocio@demo.com");
  setInputValue(businessForm, "slug", "negocio-demo-2");
  setInputValue(businessForm, "type", "bar");
  setInputValue(
    businessForm,
    "description",
    "Segundo negocio demo para validar vistas administrativas."
  );
  setInputValue(businessForm, "instagram", "negocio.demo2");
  const categorySelect = businessForm.querySelector("[name='categories']");
  if (categories.length > 0) {
    setMultiSelectValues(
      categorySelect,
      categories.slice(0, 1).map((category) => category.slug)
    );
  }
};
var wireDemoFill = () => {
  if (demoFillButtons.length === 0) return;
  demoFillButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.demoFill;
      if (!target) return;
      const panel = target.includes("promo") ? "promo" : target.includes("branch") ? "branch" : "business";
      openModal(panel);
      if (target === "promo") {
        fillDemoPromo();
      } else if (target === "promo-2") {
        fillDemoPromoAlt();
      } else if (target === "branch") {
        fillDemoBranch();
      } else if (target === "branch-2") {
        fillDemoBranchAlt();
      } else if (target === "business") {
        fillDemoBusiness();
      } else if (target === "business-2") {
        fillDemoBusinessAlt();
      }
    });
  });
};
(async () => {
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
  wireBranchFilters();
  wireBusinessFilters();
  wireDemoFill();
  handleBusinessForm();
  handleBranchForm();
  handlePromoForm();
  if (currentUser?.role === "ADMIN") {
    handleCityForm();
    handleCategoryForm();
    wireAdminActions();
  }
})();
