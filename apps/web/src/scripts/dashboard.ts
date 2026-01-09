import { apiFetch } from "./api";
import { setButtonLoading, showToast } from "./ui";
import { isValidDateRange, isValidTimeRange } from "./validators";

type User = {
  id: string;
  email: string;
  role: string;
};

type Business = {
  _id: string;
  name: string;
  slug: string;
  type: string;
  categories?: string[];
  description?: string;
  instagram?: string;
};

type Branch = {
  _id: string;
  businessId: string;
  city: string;
  address: string;
  zone?: string;
  phone?: string;
};

type Promotion = {
  _id: string;
  businessId: string;
  branchId?: string | null;
  title: string;
  description?: string;
  promoType: string;
  value?: string | number;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  startHour: string;
  endHour: string;
  active?: boolean;
};

type City = {
  _id: string;
  name: string;
  countryCode: string;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

const isMobileDevice = () => /android|iphone|ipad|ipod/i.test(navigator.userAgent);

const userCard = document.querySelector<HTMLElement>("[data-user-card]");
const businessList = document.querySelector<HTMLElement>("[data-business-list]");
const branchList = document.querySelector<HTMLElement>("[data-branch-list]");
const promoList = document.querySelector<HTMLElement>("[data-promo-list]");
const businessSelects = Array.from(
  document.querySelectorAll<HTMLSelectElement>("[data-business-select]")
);
const branchSelect = document.querySelector<HTMLSelectElement>("[data-branch-select]");

const businessForm = document.querySelector<HTMLFormElement>("[data-business-form]");
const businessMessage = document.querySelector<HTMLElement>("[data-business-message]");
const businessMode = document.querySelector<HTMLElement>("[data-business-mode]");
const businessCancel = document.querySelector<HTMLButtonElement>("[data-business-cancel]");
const branchForm = document.querySelector<HTMLFormElement>("[data-branch-form]");
const branchMessage = document.querySelector<HTMLElement>("[data-branch-message]");
const branchMode = document.querySelector<HTMLElement>("[data-branch-mode]");
const branchCancel = document.querySelector<HTMLButtonElement>("[data-branch-cancel]");
const promoForm = document.querySelector<HTMLFormElement>("[data-promo-form]");
const promoMessage = document.querySelector<HTMLElement>("[data-promo-message]");
const promoMode = document.querySelector<HTMLElement>("[data-promo-mode]");
const promoCancel = document.querySelector<HTMLButtonElement>("[data-promo-cancel]");
const adminPanel = document.querySelector<HTMLElement>("[data-admin-panel]");
const cityForm = document.querySelector<HTMLFormElement>("[data-city-form]");
const cityMessage = document.querySelector<HTMLElement>("[data-city-message]");
const cityList = document.querySelector<HTMLElement>("[data-city-list]");
const cityMode = document.querySelector<HTMLElement>("[data-city-mode]");
const cityCancel = document.querySelector<HTMLButtonElement>("[data-city-cancel]");
const categoryForm = document.querySelector<HTMLFormElement>("[data-category-form]");
const categoryMessage = document.querySelector<HTMLElement>("[data-category-message]");
const categoryList = document.querySelector<HTMLElement>("[data-category-list]");
const categoryMode = document.querySelector<HTMLElement>("[data-category-mode]");
const categoryCancel = document.querySelector<HTMLButtonElement>("[data-category-cancel]");
const categorySuggestions = document.querySelector<HTMLSelectElement>(
  "[data-business-category-select]"
);
const ownerSections = Array.from(document.querySelectorAll<HTMLElement>("[data-owner-only]"));
const authGate = document.querySelector<HTMLElement>("[data-auth-gate]");
const authGateText = document.querySelector<HTMLElement>("[data-auth-gate-text]");
const branchCitySelect = document.querySelector<HTMLSelectElement>("[data-branch-city-select]");
const dashboardHero = document.querySelector<HTMLElement>("[data-dashboard-hero]");
const dashboardMenu = document.querySelector<HTMLElement>("[data-dashboard-menu]");
const dashboardOverlay = document.querySelector<HTMLElement>("[data-dashboard-overlay]");
const dashboardToggle = document.querySelector<HTMLButtonElement>("[data-dashboard-toggle]");
const dashboardClose = document.querySelector<HTMLButtonElement>("[data-dashboard-close]");
const dashboardLinks = Array.from(
  document.querySelectorAll<HTMLAnchorElement>("[data-dashboard-link]")
);

let businesses: Business[] = [];
let branches: Branch[] = [];
let currentUser: User | null = null;
let cities: City[] = [];
let categories: Category[] = [];
let currentBusinessId = "";
let promotions: Promotion[] = [];

type FormMode = "create" | "edit";

const setMessage = (el: HTMLElement | null, text: string) => {
  if (el) {
    el.textContent = text;
  }
};

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-\$/g, "");

const renderSkeleton = (container: HTMLElement | null, count = 3) => {
  if (!container) return;
  container.innerHTML = Array.from({ length: count })
    .map(
      () => `
        <div class="rounded-2xl border border-ink-900/10 bg-white/70 px-4 py-3 animate-pulse">
          <div class="h-3 w-2/3 rounded bg-ink-900/10"></div>
          <div class="mt-2 h-2 w-1/3 rounded bg-ink-900/10"></div>
        </div>
      `
    )
    .join("");
};

const renderLoadingMessage = (container: HTMLElement | null, message: string) => {
  if (!container) return;
  container.innerHTML = `
    <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70 flex items-center gap-3">
      <span class="spinner" aria-hidden="true"></span>
      <span>${message}</span>
    </div>
  `;
};

const setSelectLoading = (select: HTMLSelectElement | null, message: string) => {
  if (!select) return;
  select.disabled = true;
  select.innerHTML = `<option value="">${message}</option>`;
};

const setSelectReady = (
  select: HTMLSelectElement | null,
  optionsHtml: string,
  keepDisabled = false
) => {
  if (!select) return;
  select.innerHTML = optionsHtml;
  select.disabled = keepDisabled;
};

const withLoading = async (form: HTMLFormElement | null, action: () => Promise<void>) => {
  if (!form) {
    await action();
    return;
  }
  const button = form.querySelector<HTMLButtonElement>("button[type='submit']");
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

const setMode = (
  form: HTMLFormElement | null,
  label: HTMLElement | null,
  cancel: HTMLButtonElement | null,
  mode: FormMode
) => {
  if (!form) return;
  form.dataset.mode = mode;
  if (label) {
    label.textContent = mode === "edit" ? "Modo edición" : "Modo crear";
  }
  if (cancel) {
    cancel.hidden = mode !== "edit";
  }
};

const setInputValue = (form: HTMLFormElement | null, name: string, value: string) => {
  if (!form) return;
  const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    `[name="${name}"]`
  );
  if (input) {
    input.value = value;
  }
};

const formatDateInput = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};

const setBusinessForm = (business?: Business) => {
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

const setBranchForm = (branch?: Branch) => {
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

const setPromoForm = async (promo?: Promotion) => {
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
  const dayInputs = promoForm.querySelectorAll<HTMLInputElement>('input[name="daysOfWeek"]');
  dayInputs.forEach((input) => {
    input.checked = promo.daysOfWeek.includes(input.value);
  });
  const activeInput = promoForm.querySelector<HTMLInputElement>('input[name="active"]');
  if (activeInput) {
    activeInput.checked = promo.active ?? true;
  }
};

const setCityForm = (city?: City) => {
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

const setCategoryForm = (category?: Category) => {
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

const setFormsEnabled = (enabled: boolean) => {
  [businessForm, branchForm, promoForm].forEach((form) => {
    if (!form) return;
    Array.from(form.elements).forEach((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.disabled = !enabled;
      }
    });
  });
};

const setOwnerSectionsVisible = (visible: boolean) => {
  ownerSections.forEach((section) => {
    section.hidden = !visible;
  });
};

const setDashboardMenuVisible = (visible: boolean) => {
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

const setDashboardMenuOpen = (open: boolean) => {
  if (!dashboardMenu || !dashboardOverlay) return;
  dashboardOverlay.hidden = !open;
  dashboardMenu.classList.toggle("translate-x-0", open);
  dashboardMenu.classList.toggle("translate-x-full", !open);
};

const setAuthGateVisible = (visible: boolean) => {
  if (authGate) {
    authGate.hidden = !visible;
  }
};

const setBranchFormEnabled = (enabled: boolean) => {
  if (!branchForm) return;
  Array.from(branchForm.elements).forEach((element) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    ) {
      element.disabled = !enabled;
    }
  });
};

const setPromoFormEnabled = (enabled: boolean) => {
  if (!promoForm) return;
  Array.from(promoForm.elements).forEach((element) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    ) {
      element.disabled = !enabled;
    }
  });
};

const renderUser = () => {
  if (!userCard) return;
  if (!currentUser) {
    userCard.innerHTML = "Inicia sesión para administrar tus negocios.";
    setFormsEnabled(false);
    setOwnerSectionsVisible(false);
    setAuthGateVisible(true);
    if (dashboardHero) {
      dashboardHero.hidden = true;
    }
    if (authGateText) {
      authGateText.textContent =
        "Inicia sesión con una cuenta de negocio para administrar promociones.";
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

  const logoutButton = userCard.querySelector<HTMLButtonElement>("[data-logout]");
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
  if (dashboardHero) {
    dashboardHero.hidden = !ownerAccess;
  }
  if (!ownerAccess && authGateText) {
    authGateText.textContent =
      "Tu usuario es de tipo visitante. Necesitas una cuenta de negocio para administrar promociones.";
  }
  if (adminPanel) {
    adminPanel.hidden = currentUser.role !== "ADMIN";
  }
  if (!ownerAccess) {
    setMessage(businessMessage, "Necesitas rol BUSINESS_OWNER para crear negocios.");
  }
};

const renderBusinesses = () => {
  if (!businessList) return;
  if (businesses.length === 0) {
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

  businessList.innerHTML = businesses
    .map(
      (business) => `
        <div class="rounded-2xl border border-ink-900/10 bg-white/70 px-4 py-3">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold">${business.name}</p>
              <p class="text-xs text-ink-900/60">${business.slug} · ${business.type}</p>
            </div>
            <div class="flex gap-2 text-xs">
              <button class="underline" data-business-select="${business._id}">Ver</button>
              <button class="underline" data-business-edit="${business._id}">Editar</button>
              <button class="underline" data-business-delete="${business._id}">Eliminar</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");
};

const populateBusinessSelects = () => {
  businessSelects.forEach((select) => {
    const selected = select.value;
    if (businesses.length === 0) {
      select.innerHTML = "<option value=\"\">Sin negocios</option>";
      select.disabled = true;
      return;
    }
    select.disabled = false;
    select.innerHTML = businesses
      .map((business) => `<option value="${business._id}">${business.name}</option>`)
      .join("");
    if (selected) {
      select.value = selected;
    }
  });
};

const populateBranchSelect = (businessId: string) => {
  if (!branchSelect) return;
  const filtered = branches.filter((branch) => branch.businessId === businessId);
  branchSelect.innerHTML = `<option value="">Global</option>`;
  filtered.forEach((branch) => {
    const option = document.createElement("option");
    option.value = branch._id;
    option.textContent = `${branch.city} · ${branch.address}`;
    branchSelect.append(option);
  });
  branchSelect.disabled = filtered.length === 0;
};

const renderBranches = () => {
  if (!branchList) return;
  if (!currentBusinessId) {
    branchList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        Selecciona un negocio para ver sedes.
      </div>
    `;
    return;
  }
  if (branches.length === 0) {
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
  branchList.innerHTML = branches
    .map(
      (branch) => `
        <div class="rounded-2xl border border-ink-900/10 bg-white/70 px-4 py-3">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold">${branch.city}</p>
              <p class="text-xs text-ink-900/60">${branch.address}</p>
            </div>
            <div class="flex gap-2 text-xs">
              <button class="underline" data-branch-edit="${branch._id}">Editar</button>
              <button class="underline" data-branch-delete="${branch._id}">Eliminar</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");
};

const renderPromotions = (promos: Promotion[]) => {
  if (!promoList) return;
  if (!currentBusinessId) {
    promoList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        Selecciona un negocio para ver promociones.
      </div>
    `;
    return;
  }
  if (promos.length === 0) {
    promoList.innerHTML = `
      <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70">
        No hay promociones creadas.
        <button class="mt-3 inline-flex text-xs underline" data-empty-action="promo">
          Crear promoción
        </button>
      </div>
    `;
    return;
  }
  const business = businesses.find((item) => item._id === currentBusinessId);
  const instagramHandle = (business?.instagram ?? "").replace("@", "").trim();
  const instagramLink = instagramHandle
    ? `<a class="underline" data-instagram-link data-instagram-handle="${instagramHandle}" href="https://instagram.com/${instagramHandle}" target="_blank" rel="noreferrer">@${instagramHandle}</a>`
    : "";

  promoList.innerHTML = promos
    .map(
      (promo) => `
        <div class="rounded-2xl border border-ink-900/10 bg-white/70 px-4 py-3">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold">${promo.title}</p>
              <p class="text-xs text-ink-900/60">${promo._id}</p>
              ${instagramLink ? `<div class="mt-2 text-xs text-ink-900/60">${instagramLink}</div>` : ""}
            </div>
            <div class="flex gap-2 text-xs">
              <button class="underline" data-promo-edit="${promo._id}">Editar</button>
              <button class="underline" data-promo-delete="${promo._id}">Eliminar</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");
};

const loadUser = async () => {
  if (userCard) {
    userCard.innerHTML = "Cargando usuario...";
  }
  try {
    currentUser = await apiFetch<User>("/auth/me");
  } catch {
    currentUser = null;
  }
  renderUser();
};

const loadBusinesses = async () => {
  if (!currentUser) return;
  renderLoadingMessage(businessList, "Cargando negocios...");
  businessSelects.forEach((select) => setSelectLoading(select, "Cargando negocios..."));
  const response = await apiFetch<Business[]>("/businesses/mine");
  businesses = response;
  renderBusinesses();
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
    const promos = await loadPromotions(currentBusinessId);
    renderPromotions(promos);
  }
};

const loadBranches = async (businessId: string) => {
  renderLoadingMessage(branchList, "Cargando sedes...");
  setSelectLoading(branchSelect, "Cargando sedes...");
  const response = await apiFetch<Branch[]>(`/branches?businessId=${businessId}`);
  branches = response;
  populateBranchSelect(businessId);
  renderBranches();
};

const loadPromotions = async (businessId: string): Promise<Promotion[]> => {
  if (!businessId) return [];
  renderLoadingMessage(promoList, "Cargando promociones...");
  const response = await apiFetch<Promotion[]>(`/promotions?businessId=${businessId}`);
  promotions = response;
  return response;
};

const renderCities = () => {
  if (!cityList) return;
  if (cities.length === 0) {
    cityList.innerHTML = "<p class=\"text-ink-900/60\">Sin ciudades registradas.</p>";
    return;
  }
  cityList.innerHTML = cities
    .map(
      (city) => `
        <div class=\"flex items-center justify-between rounded-2xl border border-ink-900/10 bg-white/70 px-4 py-2\">
          <div>
            <p class=\"font-semibold\">${city.name}</p>
            <p class=\"text-xs text-ink-900/60\">${city.countryCode}</p>
          </div>
          <div class=\"flex gap-2 text-xs\">
            <button class=\"underline\" data-city-edit=\"${city._id}\">Editar</button>
            <button class=\"underline\" data-city-delete=\"${city._id}\">Eliminar</button>
          </div>
        </div>
      `
    )
    .join("");
};

const renderCategories = () => {
  if (!categoryList) return;
  if (categories.length === 0) {
    categoryList.innerHTML = "<p class=\"text-ink-900/60\">Sin categorías registradas.</p>";
    return;
  }
  categoryList.innerHTML = categories
    .map(
      (category) => `
        <div class=\"flex items-center justify-between rounded-2xl border border-ink-900/10 bg-white/70 px-4 py-2\">
          <div>
            <p class=\"font-semibold\">${category.name}</p>
            <p class=\"text-xs text-ink-900/60\">${category.slug}</p>
          </div>
          <div class=\"flex gap-2 text-xs\">
            <button class=\"underline\" data-category-edit=\"${category._id}\">Editar</button>
            <button class=\"underline\" data-category-delete=\"${category._id}\">Eliminar</button>
          </div>
        </div>
      `
    )
    .join("");
};

const loadCities = async () => {
  renderLoadingMessage(cityList, "Cargando ciudades...");
  setSelectLoading(branchCitySelect, "Cargando ciudades...");
  cities = await apiFetch<City[]>("/cities");
  renderCities();
  if (branchCitySelect) {
    setSelectReady(
      branchCitySelect,
      [
        `<option value=\"\">Selecciona una ciudad</option>`,
        ...cities.map((city) => `<option value=\"${city.name}\">${city.name}</option>`),
      ].join("")
    );
  }
};

const loadCategories = async () => {
  renderLoadingMessage(categoryList, "Cargando categorías...");
  setSelectLoading(categorySuggestions, "Cargando categorías...");
  categories = await apiFetch<Category[]>("/categories");
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

const wireAdminActions = () => {
  if (cityList) {
    cityList.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;
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
      const target = event.target as HTMLElement;
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
      showToast("Listo", "Categoría eliminada.", "success");
      await loadCategories();
    });
  }
};

const handleBusinessForm = () => {
  if (!businessForm) return;
  businessForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const businessEditing = businessForm.dataset.mode === "edit";
    setMessage(businessMessage, businessEditing ? "Actualizando negocio..." : "Guardando negocio...");

    const data = new FormData(businessForm);
    const categoryValues = Array.from(
      businessForm.querySelectorAll<HTMLSelectElement>("[name='categories'] option:checked")
    ).map((option) => option.value);
    const slug = normalizeSlug(String(data.get("slug") ?? ""));
    const slugConflict = businesses.some(
      (business) =>
        business.slug.toLowerCase() === slug &&
        (!businessForm.dataset.editId || business._id !== businessForm.dataset.editId)
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
          instagram: data.get("instagram"),
        };
        if (businessForm.dataset.mode === "edit" && businessForm.dataset.editId) {
          await apiFetch<Business>(`/businesses/${businessForm.dataset.editId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
        } else {
          await apiFetch<Business>("/businesses", {
            method: "POST",
            body: JSON.stringify(payload),
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
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error creando negocio";
        setMessage(businessMessage, message);
        showToast("Error", message, "error");
      }
    });
  });
};

const handleBranchForm = () => {
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
          zone: data.get("zone") || undefined,
          phone: data.get("phone") || undefined,
        };
        if (branchForm.dataset.mode === "edit" && branchForm.dataset.editId) {
          await apiFetch<Branch>(`/branches/${branchForm.dataset.editId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
        } else {
          await apiFetch<Branch>("/branches", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        }
        branchForm.reset();
        setMessage(branchMessage, branchEditing ? "Sede actualizada." : "Sede creada.");
        setBranchForm();
        const businessId = String(data.get("businessId") ?? "");
        if (businessId) {
          currentBusinessId = businessId;
          await loadBranches(businessId);
          const promos = await loadPromotions(businessId);
          renderPromotions(promos);
        }
        showToast("Listo", branchEditing ? "Sede actualizada." : "Sede creada.", "success");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error creando sede";
        setMessage(branchMessage, message);
        showToast("Error", message, "error");
      }
    });
  });
};

const handlePromoForm = () => {
  if (!promoForm) return;
  promoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const promoEditing = promoForm.dataset.mode === "edit";
    setMessage(promoMessage, promoEditing ? "Actualizando promoción..." : "Guardando promoción...");

    const data = new FormData(promoForm);
    const days = data.getAll("daysOfWeek").map((day) => String(day));
    const startDate = String(data.get("startDate"));
    const endDate = String(data.get("endDate"));
    const startDateIso = startDate ? new Date(`${startDate}T00:00:00`).toISOString() : "";
    const endDateIso = endDate ? new Date(`${endDate}T23:59:59`).toISOString() : "";
    if (days.length === 0) {
      const message = "Selecciona al menos un día de la semana.";
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
          description: data.get("description") || undefined,
          promoType: data.get("promoType"),
          value: data.get("value") || undefined,
          startDate: startDateIso,
          endDate: endDateIso,
          daysOfWeek: days,
          startHour: data.get("startHour"),
          endHour: data.get("endHour"),
          active: Boolean(data.get("active")),
        };
        if (promoForm.dataset.mode === "edit" && promoForm.dataset.editId) {
          await apiFetch<Promotion>(`/promotions/${promoForm.dataset.editId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
        } else {
          await apiFetch<Promotion>("/promotions", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        }
        promoForm.reset();
        setMessage(promoMessage, promoEditing ? "Promoción actualizada." : "Promoción creada.");
        setPromoForm();
        if (currentBusinessId) {
          const promos = await loadPromotions(currentBusinessId);
          renderPromotions(promos);
        }
        showToast(
          "Listo",
          promoEditing ? "Promoción actualizada." : "Promoción creada.",
          "success"
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error creando promoción";
        setMessage(promoMessage, message);
        showToast("Error", message, "error");
      }
    });
  });
};

const handleCityForm = () => {
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
          countryCode: String(data.get("countryCode") ?? "").toUpperCase(),
        };
        if (cityForm.dataset.mode === "edit" && cityForm.dataset.editId) {
          await apiFetch<City>(`/cities/${cityForm.dataset.editId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
        } else {
          await apiFetch<City>("/cities", {
            method: "POST",
            body: JSON.stringify(payload),
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

const handleCategoryForm = () => {
  if (!categoryForm) return;
  categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const categoryEditing = categoryForm.dataset.mode === "edit";
    setMessage(categoryMessage, categoryEditing ? "Actualizando categoría..." : "Guardando categoría...");
    const data = new FormData(categoryForm);
    await withLoading(categoryForm, async () => {
      try {
        const payload = {
          name: data.get("name"),
          slug: String(data.get("slug") ?? "").toLowerCase(),
        };
        if (categoryForm.dataset.mode === "edit" && categoryForm.dataset.editId) {
          await apiFetch<Category>(`/categories/${categoryForm.dataset.editId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
        } else {
          await apiFetch<Category>("/categories", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        }
        categoryForm.reset();
        setMessage(
          categoryMessage,
          categoryEditing ? "Categoría actualizada." : "Categoría creada."
        );
        setCategoryForm();
        await loadCategories();
        showToast(
          "Listo",
          categoryEditing ? "Categoría actualizada." : "Categoría creada.",
          "success"
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error creando categoría";
        setMessage(categoryMessage, message);
        showToast("Error", message, "error");
      }
    });
  });
};

const wireSelectors = () => {
  businessSelects.forEach((select) => {
    select.addEventListener("change", async () => {
      if (select.value) {
        currentBusinessId = select.value;
        setBranchFormEnabled(true);
        setPromoFormEnabled(true);
        await loadBranches(select.value);
        const promos = await loadPromotions(select.value);
        renderPromotions(promos);
      }
    });
  });
};

const wireBusinessActions = () => {
  if (!businessList) return;
  businessList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const selectId = target.dataset.businessSelect;
    const editId = target.dataset.businessEdit;
    const deleteId = target.dataset.businessDelete;

    if (selectId) {
      currentBusinessId = selectId;
      businessSelects.forEach((select) => {
        select.value = selectId;
      });
      await loadBranches(selectId);
      const promos = await loadPromotions(selectId);
      renderPromotions(promos);
    }

    if (editId) {
      const business = businesses.find((item) => item._id === editId);
      if (business) {
        setBusinessForm(business);
        currentBusinessId = business._id;
        businessSelects.forEach((select) => {
          select.value = business._id;
        });
        await loadBranches(business._id);
        const promos = await loadPromotions(business._id);
        renderPromotions(promos);
      }
    }

    if (deleteId) {
      const confirmed = window.confirm("¿Eliminar este negocio? También perderás sus sedes y promos.");
      if (!confirmed) return;
      businesses = businesses.filter((business) => business._id !== deleteId);
      renderBusinesses();
      await apiFetch(`/businesses/${deleteId}`, { method: "DELETE" });
      showToast("Listo", "Negocio eliminado.", "success");
      await loadBusinesses();
      if (businesses.length > 0) {
        currentBusinessId = businesses[0]._id;
        await loadBranches(currentBusinessId);
        const promos = await loadPromotions(currentBusinessId);
        renderPromotions(promos);
      } else {
        currentBusinessId = "";
        renderBranches();
        renderPromotions([]);
      }
    }
  });
};

const wireBranchActions = () => {
  if (!branchList) return;
  branchList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const editId = target.dataset.branchEdit;
    const deleteId = target.dataset.branchDelete;
    if (editId) {
      const branch = branches.find((item) => item._id === editId);
      if (branch) {
        setBranchForm(branch);
        currentBusinessId = branch.businessId;
        businessSelects.forEach((select) => {
          select.value = branch.businessId;
        });
        await loadBranches(branch.businessId);
      }
    }
    if (!deleteId) return;
    const confirmed = window.confirm("¿Eliminar esta sede?");
    if (!confirmed) return;
    branches = branches.filter((branch) => branch._id !== deleteId);
    renderBranches();
    await apiFetch(`/branches/${deleteId}`, { method: "DELETE" });
    showToast("Listo", "Sede eliminada.", "success");
    if (currentBusinessId) {
      await loadBranches(currentBusinessId);
    }
  });
};

const wirePromoActions = () => {
  if (!promoList) return;
  promoList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const instagramLink = target.closest<HTMLAnchorElement>("[data-instagram-link]");
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
      }
    }
    if (!deleteId) return;
    const confirmed = window.confirm("¿Eliminar esta promoción?");
    if (!confirmed) return;
    promotions = promotions.filter((promo) => promo._id !== deleteId);
    renderPromotions(promotions);
    await apiFetch(`/promotions/${deleteId}`, { method: "DELETE" });
    showToast("Listo", "Promoción eliminada.", "success");
    if (currentBusinessId) {
      const promos = await loadPromotions(currentBusinessId);
      renderPromotions(promos);
    }
  });
};

const wireEmptyStateActions = () => {
  const scrollToForm = (selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  document.body.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.emptyAction;
    if (!action) return;
    if (action === "business") {
      scrollToForm("[data-business-form]");
    }
    if (action === "branch") {
      scrollToForm("[data-branch-form]");
    }
    if (action === "promo") {
      scrollToForm("[data-promo-form]");
    }
  });
};

const wireCancelButtons = () => {
  businessCancel?.addEventListener("click", () => setBusinessForm());
  branchCancel?.addEventListener("click", () => setBranchForm());
  promoCancel?.addEventListener("click", () => setPromoForm());
  cityCancel?.addEventListener("click", () => setCityForm());
  categoryCancel?.addEventListener("click", () => setCategoryForm());
};

const wireDashboardMenu = () => {
  if (!dashboardMenu || !dashboardOverlay || !dashboardToggle) return;
  const closeMenu = () => setDashboardMenuOpen(false);
  dashboardToggle.addEventListener("click", () => setDashboardMenuOpen(true));
  dashboardClose?.addEventListener("click", closeMenu);
  dashboardOverlay.addEventListener("click", closeMenu);
  dashboardLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
};

(async () => {
  setBusinessForm();
  setBranchForm();
  setPromoForm();
  setCityForm();
  setCategoryForm();
  await loadUser();
  if (currentUser) {
    await loadBusinesses();
    await loadCities();
    await loadCategories();
  }
  renderBusinesses();
  populateBusinessSelects();
  renderBranches();
  renderPromotions([]);
  wireSelectors();
  wireBusinessActions();
  wireBranchActions();
  wirePromoActions();
  wireEmptyStateActions();
  wireCancelButtons();
  wireDashboardMenu();
  handleBusinessForm();
  handleBranchForm();
  handlePromoForm();
  if (currentUser?.role === "ADMIN") {
    handleCityForm();
    handleCategoryForm();
    wireAdminActions();
  }
})();
