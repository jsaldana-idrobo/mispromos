import { apiFetch } from "./api";
import { setButtonLoading, showToast } from "./ui";
import { isValidDateRange, isValidTimeRange } from "./validators";
import { businessTypeLabels, promoTypeLabels } from "../data/catalog";

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
  verified?: boolean;
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

const isMobileDevice = () =>
  /android|iphone|ipad|ipod/i.test(navigator.userAgent);

const userCard = document.querySelector<HTMLElement>("[data-user-card]");
const businessList = document.querySelector<HTMLElement>(
  "[data-business-list]",
);
const branchList = document.querySelector<HTMLElement>("[data-branch-list]");
const promoList = document.querySelector<HTMLElement>("[data-promo-list]");
const businessSelects = Array.from(
  document.querySelectorAll<HTMLSelectElement>("[data-business-select]"),
);
const businessSelectRows = Array.from(
  document.querySelectorAll<HTMLElement>("[data-business-select-row]"),
);
const branchSelect = document.querySelector<HTMLSelectElement>(
  "[data-branch-select]",
);

const businessForm = document.querySelector<HTMLFormElement>(
  "[data-business-form]",
);
const businessMessage = document.querySelector<HTMLElement>(
  "[data-business-message]",
);
const businessMode = document.querySelector<HTMLElement>(
  "[data-business-mode]",
);
const branchForm =
  document.querySelector<HTMLFormElement>("[data-branch-form]");
const branchMessage = document.querySelector<HTMLElement>(
  "[data-branch-message]",
);
const branchMode = document.querySelector<HTMLElement>("[data-branch-mode]");
const promoForm = document.querySelector<HTMLFormElement>("[data-promo-form]");
const promoMessage = document.querySelector<HTMLElement>(
  "[data-promo-message]",
);
const promoMode = document.querySelector<HTMLElement>("[data-promo-mode]");
const promoSearchInput = document.querySelector<HTMLInputElement>(
  "[data-promo-search]",
);
const promoStatusSelect = document.querySelector<HTMLSelectElement>(
  "[data-promo-status]",
);
const promoTypeSelect =
  document.querySelector<HTMLSelectElement>("[data-promo-type]");
const promoBusinessFilter = document.querySelector<HTMLSelectElement>(
  "[data-promo-business-filter]",
);
const promoPagination = document.querySelector<HTMLElement>(
  "[data-promo-pagination]",
);
const promoPagePrev = document.querySelector<HTMLButtonElement>(
  "[data-promo-page-prev]",
);
const promoPageNext = document.querySelector<HTMLButtonElement>(
  "[data-promo-page-next]",
);
const promoPageInfo = document.querySelector<HTMLElement>(
  "[data-promo-page-info]",
);
const promoKpiTotal = document.querySelector<HTMLElement>(
  "[data-promo-kpi-total]",
);
const promoKpiActive = document.querySelector<HTMLElement>(
  "[data-promo-kpi-active]",
);
const promoKpiInactive = document.querySelector<HTMLElement>(
  "[data-promo-kpi-inactive]",
);
const branchSearchInput = document.querySelector<HTMLInputElement>(
  "[data-branch-search]",
);
const branchCityFilter = document.querySelector<HTMLSelectElement>(
  "[data-branch-city-filter]",
);
const branchBusinessFilter = document.querySelector<HTMLSelectElement>(
  "[data-branch-business-filter]",
);
const branchPagination = document.querySelector<HTMLElement>(
  "[data-branch-pagination]",
);
const branchPagePrev = document.querySelector<HTMLButtonElement>(
  "[data-branch-page-prev]",
);
const branchPageNext = document.querySelector<HTMLButtonElement>(
  "[data-branch-page-next]",
);
const branchPageInfo = document.querySelector<HTMLElement>(
  "[data-branch-page-info]",
);
const branchKpiTotal = document.querySelector<HTMLElement>(
  "[data-branch-kpi-total]",
);
const branchKpiCities = document.querySelector<HTMLElement>(
  "[data-branch-kpi-cities]",
);
const branchKpiPhones = document.querySelector<HTMLElement>(
  "[data-branch-kpi-phones]",
);
const businessSearchInput = document.querySelector<HTMLInputElement>(
  "[data-business-search]",
);
const businessTypeFilter = document.querySelector<HTMLSelectElement>(
  "[data-business-type-filter]",
);
const businessCityFilter = document.querySelector<HTMLSelectElement>(
  "[data-business-city-filter]",
);
const businessCategoryFilter = document.querySelector<HTMLSelectElement>(
  "[data-business-category-filter]",
);
const businessVerifiedFilter = document.querySelector<HTMLSelectElement>(
  "[data-business-verified-filter]",
);
const businessInstagramFilter = document.querySelector<HTMLSelectElement>(
  "[data-business-instagram-filter]",
);
const businessPagination = document.querySelector<HTMLElement>(
  "[data-business-pagination]",
);
const businessPagePrev = document.querySelector<HTMLButtonElement>(
  "[data-business-page-prev]",
);
const businessPageNext = document.querySelector<HTMLButtonElement>(
  "[data-business-page-next]",
);
const businessPageInfo = document.querySelector<HTMLElement>(
  "[data-business-page-info]",
);
const businessKpiTotal = document.querySelector<HTMLElement>(
  "[data-business-kpi-total]",
);
const businessKpiBranches = document.querySelector<HTMLElement>(
  "[data-business-kpi-branches]",
);
const businessKpiPromos = document.querySelector<HTMLElement>(
  "[data-business-kpi-promos]",
);
const adminPanel = document.querySelector<HTMLElement>("[data-admin-panel]");
const adminOnlySections = Array.from(
  document.querySelectorAll<HTMLElement>("[data-admin-only]"),
);
const ownerBusinessPanel = document.querySelector<HTMLElement>(
  "[data-owner-business]",
);
const ownerBusinessName = document.querySelector<HTMLElement>(
  "[data-owner-business-name]",
);
const ownerBusinessType = document.querySelector<HTMLElement>(
  "[data-owner-business-type]",
);
const ownerBusinessSlug = document.querySelector<HTMLElement>(
  "[data-owner-business-slug]",
);
const ownerBusinessCategories = document.querySelector<HTMLElement>(
  "[data-owner-business-categories]",
);
const ownerBusinessInstagram = document.querySelector<HTMLElement>(
  "[data-owner-business-instagram]",
);
const ownerBusinessDescription = document.querySelector<HTMLElement>(
  "[data-owner-business-description]",
);
const ownerBusinessEdit = document.querySelector<HTMLButtonElement>(
  "[data-owner-business-edit]",
);
const cityForm = document.querySelector<HTMLFormElement>("[data-city-form]");
const cityMessage = document.querySelector<HTMLElement>("[data-city-message]");
const cityList = document.querySelector<HTMLElement>("[data-city-list]");
const cityMode = document.querySelector<HTMLElement>("[data-city-mode]");
const cityPagination = document.querySelector<HTMLElement>(
  "[data-city-pagination]",
);
const cityPagePrev = document.querySelector<HTMLButtonElement>(
  "[data-city-page-prev]",
);
const cityPageNext = document.querySelector<HTMLButtonElement>(
  "[data-city-page-next]",
);
const cityPageInfo = document.querySelector<HTMLElement>(
  "[data-city-page-info]",
);
const cityKpiTotal = document.querySelector<HTMLElement>(
  "[data-city-kpi-total]",
);
const cityKpiCountries = document.querySelector<HTMLElement>(
  "[data-city-kpi-countries]",
);
const cityKpiLast = document.querySelector<HTMLElement>("[data-city-kpi-last]");
const categoryForm = document.querySelector<HTMLFormElement>(
  "[data-category-form]",
);
const categoryMessage = document.querySelector<HTMLElement>(
  "[data-category-message]",
);
const categoryList = document.querySelector<HTMLElement>(
  "[data-category-list]",
);
const categoryMode = document.querySelector<HTMLElement>(
  "[data-category-mode]",
);
const categoryPagination = document.querySelector<HTMLElement>(
  "[data-category-pagination]",
);
const categoryPagePrev = document.querySelector<HTMLButtonElement>(
  "[data-category-page-prev]",
);
const categoryPageNext = document.querySelector<HTMLButtonElement>(
  "[data-category-page-next]",
);
const categoryPageInfo = document.querySelector<HTMLElement>(
  "[data-category-page-info]",
);
const categoryKpiTotal = document.querySelector<HTMLElement>(
  "[data-category-kpi-total]",
);
const categoryKpiSlugs = document.querySelector<HTMLElement>(
  "[data-category-kpi-slugs]",
);
const categoryKpiLast = document.querySelector<HTMLElement>(
  "[data-category-kpi-last]",
);
const categorySuggestions = document.querySelector<HTMLSelectElement>(
  "[data-business-category-select]",
);
const ownerSections = Array.from(
  document.querySelectorAll<HTMLElement>("[data-owner-only]"),
);
const authGate = document.querySelector<HTMLElement>("[data-auth-gate]");
const authGateText = document.querySelector<HTMLElement>(
  "[data-auth-gate-text]",
);
const branchCitySelect = document.querySelector<HTMLSelectElement>(
  "[data-branch-city-select]",
);
const dashboardHero = document.querySelector<HTMLElement>(
  "[data-dashboard-hero]",
);
const dashboardMenu = document.querySelector<HTMLElement>(
  "[data-dashboard-menu]",
);
const dashboardOverlay = document.querySelector<HTMLElement>(
  "[data-dashboard-overlay]",
);
const dashboardToggle = document.querySelector<HTMLButtonElement>(
  "[data-dashboard-toggle]",
);
const dashboardClose = document.querySelector<HTMLButtonElement>(
  "[data-dashboard-close]",
);
const dashboardLoader = document.querySelector<HTMLElement>(
  "[data-dashboard-loader]",
);
const dashboardContent = document.querySelector<HTMLElement>(
  "[data-dashboard-content]",
);
const dashboardTabs = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-dashboard-tab]"),
);
const dashboardPanels = Array.from(
  document.querySelectorAll<HTMLElement>("[data-dashboard-panel]"),
);
const dashboardCreateButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-dashboard-create]"),
);
const businessTabLabels = Array.from(
  document.querySelectorAll<HTMLElement>("[data-dashboard-business-label]"),
);
const businessTabTitle = document.querySelector<HTMLElement>(
  "[data-dashboard-business-title]",
);
const promoTabLabels = Array.from(
  document.querySelectorAll<HTMLElement>("[data-dashboard-promo-label]"),
);
const promoTabTitle = document.querySelector<HTMLElement>(
  "[data-dashboard-promo-title]",
);
const promoTabSubtitle = document.querySelector<HTMLElement>(
  "[data-dashboard-promo-subtitle]",
);
const branchTabLabels = Array.from(
  document.querySelectorAll<HTMLElement>("[data-dashboard-branch-label]"),
);
const branchTabTitle = document.querySelector<HTMLElement>(
  "[data-dashboard-branch-title]",
);
const branchTabSubtitle = document.querySelector<HTMLElement>(
  "[data-dashboard-branch-subtitle]",
);
const promoModalOverlay = document.querySelector<HTMLElement>(
  "[data-promo-modal-overlay]",
);
const promoModal = document.querySelector<HTMLElement>("[data-promo-modal]");
const promoModalClose = document.querySelector<HTMLButtonElement>(
  "[data-promo-modal-close]",
);
const promoModalTitle = document.querySelector<HTMLElement>(
  "[data-promo-modal-title]",
);
const branchModalOverlay = document.querySelector<HTMLElement>(
  "[data-branch-modal-overlay]",
);
const branchModal = document.querySelector<HTMLElement>("[data-branch-modal]");
const branchModalClose = document.querySelector<HTMLButtonElement>(
  "[data-branch-modal-close]",
);
const branchModalTitle = document.querySelector<HTMLElement>(
  "[data-branch-modal-title]",
);
const businessModalOverlay = document.querySelector<HTMLElement>(
  "[data-business-modal-overlay]",
);
const businessModal = document.querySelector<HTMLElement>(
  "[data-business-modal]",
);
const businessModalClose = document.querySelector<HTMLButtonElement>(
  "[data-business-modal-close]",
);
const businessModalTitle = document.querySelector<HTMLElement>(
  "[data-business-modal-title]",
);
const cityModalOverlay = document.querySelector<HTMLElement>(
  "[data-city-modal-overlay]",
);
const cityModal = document.querySelector<HTMLElement>("[data-city-modal]");
const cityModalClose = document.querySelector<HTMLButtonElement>(
  "[data-city-modal-close]",
);
const cityModalTitle = document.querySelector<HTMLElement>(
  "[data-city-modal-title]",
);
const categoryModalOverlay = document.querySelector<HTMLElement>(
  "[data-category-modal-overlay]",
);
const categoryModal = document.querySelector<HTMLElement>(
  "[data-category-modal]",
);
const categoryModalClose = document.querySelector<HTMLButtonElement>(
  "[data-category-modal-close]",
);
const categoryModalTitle = document.querySelector<HTMLElement>(
  "[data-category-modal-title]",
);

let businesses: Business[] = [];
let branches: Branch[] = [];
let currentUser: User | null = null;
let cities: City[] = [];
let categories: Category[] = [];
let currentBusinessId = "";
let promotions: Promotion[] = [];
let activeDashboardTab = "promos";
let promoFilters = {
  search: "",
  status: "all",
  type: "all",
  businessId: "all",
};
let branchFilters = {
  search: "",
  city: "all",
  businessId: "all",
};
let adminBusinessPage = 1;
const ADMIN_BUSINESS_PAGE_SIZE = 10;
let adminBranchPage = 1;
const ADMIN_BRANCH_PAGE_SIZE = 10;
let businessFilters = {
  search: "",
  type: "all",
  city: "all",
  category: "all",
  verified: "all",
  instagram: "all",
};
let adminPromoPage = 1;
const ADMIN_PROMO_PAGE_SIZE = 10;
let adminCityPage = 1;
const ADMIN_CITY_PAGE_SIZE = 10;
let adminCategoryPage = 1;
const ADMIN_CATEGORY_PAGE_SIZE = 10;

type FormMode = "create" | "edit" | "view";

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
      `,
    )
    .join("");
};

const renderLoadingMessage = (
  container: HTMLElement | null,
  message: string,
) => {
  if (!container) return;
  container.innerHTML = `
    <div class="rounded-2xl border border-ink-900/10 bg-sand-100 px-4 py-3 text-sm text-ink-900/70 flex items-center gap-3">
      <span class="spinner" aria-hidden="true"></span>
      <span>${message}</span>
    </div>
  `;
};

const setSelectLoading = (
  select: HTMLSelectElement | null,
  message: string,
) => {
  if (!select) return;
  select.disabled = true;
  select.innerHTML = `<option value="">${message}</option>`;
};

const setSelectReady = (
  select: HTMLSelectElement | null,
  optionsHtml: string,
  keepDisabled = false,
) => {
  if (!select) return;
  select.innerHTML = optionsHtml;
  select.disabled = keepDisabled;
};

const withLoading = async (
  form: HTMLFormElement | null,
  action: () => Promise<void>,
) => {
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
  mode: FormMode,
) => {
  if (!form) return;
  form.dataset.mode = mode;
  if (label) {
    if (mode === "edit") {
      label.textContent = "Modo edición";
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

const setFormReadOnly = (form: HTMLFormElement | null, readOnly: boolean) => {
  if (!form) return;
  form.dataset.readonly = readOnly ? "true" : "false";
  const fields = form.querySelectorAll<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >("input, select, textarea");
  fields.forEach((field) => {
    field.disabled = readOnly;
  });
  const submitButton = form.querySelector<HTMLButtonElement>(
    "button[type='submit']",
  );
  if (submitButton) {
    submitButton.hidden = readOnly;
  }
};

const setInputValue = (
  form: HTMLFormElement | null,
  name: string,
  value: string,
) => {
  if (!form) return;
  const input = form.querySelector<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >(`[name="${name}"]`);
  if (input) {
    input.value = value;
  }
};

const setMultiSelectValues = (
  select: HTMLSelectElement | null,
  values: string[],
) => {
  if (!select) return;
  Array.from(select.options).forEach((option) => {
    option.selected = values.includes(option.value);
  });
};

const formatDateInput = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};

const setBusinessForm = (
  business?: Business,
  options: { mode?: FormMode; readOnly?: boolean; title?: string } = {},
) => {
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
      businessModalTitle.textContent =
        mode === "view" ? "Detalle del negocio" : "Editar negocio";
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

const setBranchForm = (
  branch?: Branch,
  options: { mode?: FormMode; readOnly?: boolean; title?: string } = {},
) => {
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
      branchModalTitle.textContent =
        mode === "view" ? "Detalle de la sede" : "Editar sede";
    }
  }
  setInputValue(branchForm, "businessId", branch.businessId);
  setInputValue(branchForm, "city", branch.city);
  setInputValue(branchForm, "address", branch.address);
  setInputValue(branchForm, "zone", branch.zone ?? "");
  setInputValue(branchForm, "phone", branch.phone ?? "");
};

const setPromoForm = async (
  promo?: Promotion,
  options: { mode?: FormMode; readOnly?: boolean; title?: string } = {},
) => {
  if (!promoForm) return;
  if (!promo) {
    promoForm.reset();
    promoForm.dataset.editId = "";
    setFormReadOnly(promoForm, false);
    setMode(promoForm, promoMode, null, "create");
    if (promoModalTitle) {
      promoModalTitle.textContent = "Crear promoción";
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
      promoModalTitle.textContent =
        mode === "view" ? "Detalle de la promoción" : "Editar promoción";
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
  setInputValue(promoForm, "promoType", promo.promoType);
  setInputValue(promoForm, "value", promo.value ? String(promo.value) : "");
  setInputValue(promoForm, "startDate", formatDateInput(promo.startDate));
  setInputValue(promoForm, "endDate", formatDateInput(promo.endDate));
  setInputValue(promoForm, "startHour", promo.startHour);
  setInputValue(promoForm, "endHour", promo.endHour);
  const dayInputs = promoForm.querySelectorAll<HTMLInputElement>(
    'input[name="daysOfWeek"]',
  );
  dayInputs.forEach((input) => {
    input.checked = promo.daysOfWeek.includes(input.value);
  });
  const activeInput = promoForm.querySelector<HTMLInputElement>(
    'input[name="active"]',
  );
  if (activeInput) {
    activeInput.checked = promo.active ?? true;
  }
};

const setCityForm = (
  city?: City,
  options: { mode?: FormMode; readOnly?: boolean; title?: string } = {},
) => {
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
      cityModalTitle.textContent =
        mode === "view" ? "Detalle de la ciudad" : "Editar ciudad";
    }
  }
  setInputValue(cityForm, "name", city.name);
  setInputValue(cityForm, "countryCode", city.countryCode);
};

const setCategoryForm = (
  category?: Category,
  options: { mode?: FormMode; readOnly?: boolean; title?: string } = {},
) => {
  if (!categoryForm) return;
  if (!category) {
    categoryForm.reset();
    categoryForm.dataset.editId = "";
    setFormReadOnly(categoryForm, false);
    setMode(categoryForm, categoryMode, null, "create");
    if (categoryModalTitle) {
      categoryModalTitle.textContent = "Crear categoría";
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
      categoryModalTitle.textContent =
        mode === "view" ? "Detalle de la categoría" : "Editar categoría";
    }
  }
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

const setDashboardLoading = (isLoading: boolean) => {
  document.documentElement.dataset.dashboardLoading = isLoading
    ? "true"
    : "false";
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

const setHeaderAuthState = (isAuthenticated: boolean) => {
  const loginLink = document.querySelector<HTMLElement>("[data-nav-login]");
  const registerLink = document.querySelector<HTMLElement>(
    "[data-nav-register]",
  );
  const dashboardLink = document.querySelector<HTMLElement>(
    "[data-nav-dashboard]",
  );
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

const setBusinessSelectVisibility = (isAdmin: boolean) => {
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

const setBusinessLabels = (isAdmin: boolean) => {
  const label = isAdmin ? "Mis negocios" : "Mi negocio";
  businessTabLabels.forEach((item) => {
    item.textContent = label;
  });
  if (businessTabTitle) {
    businessTabTitle.textContent = label;
  }
};

const setPromoLabels = (isAdmin: boolean) => {
  const label = isAdmin ? "Promociones" : "Mis promociones";
  promoTabLabels.forEach((item) => {
    item.textContent = label;
  });
  if (promoTabTitle) {
    promoTabTitle.textContent = label;
  }
  if (promoTabSubtitle) {
    promoTabSubtitle.textContent = isAdmin
      ? "Gestiona promociones de todos los negocios."
      : "Gestiona las promos activas de tu negocio.";
  }
};

const setBranchLabels = (isAdmin: boolean) => {
  const label = isAdmin ? "Sedes" : "Mis sucursales";
  branchTabLabels.forEach((item) => {
    item.textContent = label;
  });
  if (branchTabTitle) {
    branchTabTitle.textContent = label;
  }
  if (branchTabSubtitle) {
    branchTabSubtitle.textContent = isAdmin
      ? "Gestiona sedes de todos los negocios."
      : "Administra las sedes activas de tu negocio.";
  }
};

const setAdminOnlyVisibility = (isAdmin: boolean) => {
  adminOnlySections.forEach((section) => {
    section.hidden = !isAdmin;
  });
  if (ownerBusinessPanel) {
    ownerBusinessPanel.hidden = isAdmin;
  }
};

const removeAdminOnlySections = () => {
  adminOnlySections.forEach((section) => {
    section.remove();
  });
};

const renderOwnerBusinessDetails = () => {
  if (!ownerBusinessPanel) return;
  const business =
    businesses.find((item) => item._id === currentBusinessId) ?? businesses[0];
  if (!business) {
    ownerBusinessPanel.hidden = true;
    return;
  }
  ownerBusinessPanel.hidden = false;
  if (ownerBusinessName) {
    ownerBusinessName.textContent = business.name;
  }
  if (ownerBusinessType) {
    ownerBusinessType.textContent =
      businessTypeLabels[business.type as keyof typeof businessTypeLabels] ??
      business.type;
  }
  if (ownerBusinessSlug) {
    ownerBusinessSlug.textContent = business.slug;
  }
  if (ownerBusinessCategories) {
    ownerBusinessCategories.textContent =
      (business.categories ?? []).join(", ") || "-";
  }
  if (ownerBusinessInstagram) {
    ownerBusinessInstagram.textContent = business.instagram
      ? `@${business.instagram}`
      : "-";
  }
  if (ownerBusinessDescription) {
    ownerBusinessDescription.textContent = business.description ?? "-";
  }
};

const updatePromoPagination = (total: number, isAdmin: boolean) => {
  if (!promoPagination || !promoPageInfo || !promoPagePrev || !promoPageNext)
    return;
  if (!isAdmin) {
    promoPagination.hidden = true;
    return;
  }
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PROMO_PAGE_SIZE));
  if (adminPromoPage > totalPages) {
    adminPromoPage = totalPages;
  }
  promoPageInfo.textContent = `Página ${adminPromoPage} de ${totalPages}`;
  promoPagePrev.disabled = adminPromoPage <= 1;
  promoPageNext.disabled = adminPromoPage >= totalPages;
  promoPagination.hidden = totalPages <= 1;
};

const closeAllModals = () => {
  const setHidden = (overlay: HTMLElement | null, hidden: boolean) => {
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

const openModal = (
  type: "promo" | "branch" | "business" | "city" | "category",
) => {
  closeAllModals();
  const modalMap = {
    promo: { overlay: promoModalOverlay, modal: promoModal },
    branch: { overlay: branchModalOverlay, modal: branchModal },
    business: { overlay: businessModalOverlay, modal: businessModal },
    city: { overlay: cityModalOverlay, modal: cityModal },
    category: { overlay: categoryModalOverlay, modal: categoryModal },
  } as const;
  const target = modalMap[type];
  if (!target.overlay || !target.modal) return;
  target.overlay.hidden = false;
  target.overlay.classList.remove("hidden");
  const focusTarget = target.modal.querySelector<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >("input, select, textarea");
  focusTarget?.focus();
};

const setActiveDashboardTab = (tab: string) => {
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

const focusCreateForm = (target: string) => {
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
      showToast(
        "Acceso restringido",
        "Solo el admin puede crear nuevos negocios.",
        "info",
      );
      return;
    }
    setActiveDashboardTab("business");
    setBusinessForm();
    openModal("business");
  }
  if (target === "city") {
    if (currentUser?.role !== "ADMIN") {
      showToast(
        "Acceso restringido",
        "Solo el admin puede crear ciudades.",
        "info",
      );
      return;
    }
    setActiveDashboardTab("cities");
    setCityForm();
    openModal("city");
  }
  if (target === "category") {
    if (currentUser?.role !== "ADMIN") {
      showToast(
        "Acceso restringido",
        "Solo el admin puede crear categorías.",
        "info",
      );
      return;
    }
    setActiveDashboardTab("categories");
    setCategoryForm();
    openModal("category");
  }
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
    setBusinessSelectVisibility(false);
    setAdminOnlyVisibility(false);
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
    </div>
  `;

  const ownerAccess =
    currentUser.role === "BUSINESS_OWNER" || currentUser.role === "ADMIN";
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
    authGateText.textContent =
      "Tu usuario es de tipo visitante. Necesitas una cuenta de negocio para administrar promociones.";
  }
  if (adminPanel) {
    adminPanel.hidden = !isAdmin;
  }
  if (!ownerAccess) {
    setMessage(
      businessMessage,
      "Necesitas rol BUSINESS_OWNER para crear negocios.",
    );
  }
  if (!isAdmin) {
    renderOwnerBusinessDetails();
  }
};

const getBusinessCities = (businessId: string) => {
  return Array.from(
    new Set(
      branches
        .filter((branch) => branch.businessId === businessId)
        .map((branch) => branch.city),
    ),
  ).sort();
};

const formatBusinessCities = (businessId: string) => {
  const list = getBusinessCities(businessId);
  if (list.length === 0) return "Sin sedes";
  if (list.length <= 2) return list.join(", ");
  return `${list.slice(0, 2).join(", ")} +${list.length - 2}`;
};

const formatBusinessCategories = (business: Business) => {
  const categoryMap = new Map(
    categories.map((category) => [category.slug, category.name]),
  );
  const list = (business.categories ?? []).map(
    (slug) => categoryMap.get(slug) ?? slug,
  );
  if (list.length === 0) return "Sin categoría";
  if (list.length <= 2) return list.join(", ");
  return `${list.slice(0, 2).join(", ")} +${list.length - 2}`;
};

const getFilteredBusinesses = () => {
  const searchValue = businessFilters.search.trim().toLowerCase();
  return businesses.filter((business) => {
    const typeMatch =
      businessFilters.type === "all" || business.type === businessFilters.type;
    const categoryMatch =
      businessFilters.category === "all" ||
      (business.categories ?? []).includes(businessFilters.category);
    const businessCities = getBusinessCities(business._id);
    const cityMatch =
      businessFilters.city === "all" ||
      businessCities.includes(businessFilters.city);
    const verifiedMatch =
      businessFilters.verified === "all" ||
      (businessFilters.verified === "verified" && business.verified) ||
      (businessFilters.verified === "unverified" && !business.verified);
    const hasInstagram = Boolean((business.instagram ?? "").trim());
    const instagramMatch =
      businessFilters.instagram === "all" ||
      (businessFilters.instagram === "with" && hasInstagram) ||
      (businessFilters.instagram === "without" && !hasInstagram);
    const textMatch =
      searchValue.length === 0 ||
      business.name.toLowerCase().includes(searchValue) ||
      business.slug.toLowerCase().includes(searchValue) ||
      (business.description ?? "").toLowerCase().includes(searchValue) ||
      (business.instagram ?? "").toLowerCase().includes(searchValue);
    return (
      typeMatch &&
      categoryMatch &&
      cityMatch &&
      verifiedMatch &&
      instagramMatch &&
      textMatch
    );
  });
};

const updateBusinessCityFilterOptions = () => {
  if (!businessCityFilter) return;
  const selected = businessCityFilter.value || "all";
  const cities = Array.from(
    new Set(branches.map((branch) => branch.city)),
  ).sort();
  businessCityFilter.innerHTML = `
    <option value="all">Todas</option>
    ${cities.map((city) => `<option value="${city}">${city}</option>`).join("")}
  `;
  businessCityFilter.value = cities.includes(selected) ? selected : "all";
};

const updateBusinessCategoryFilterOptions = () => {
  if (!businessCategoryFilter) return;
  const selected = businessCategoryFilter.value || "all";
  const options =
    categories.length > 0
      ? categories.map((category) => ({
          value: category.slug,
          label: category.name,
        }))
      : Array.from(
          new Set(businesses.flatMap((business) => business.categories ?? [])),
        ).map((slug) => ({ value: slug, label: slug }));
  businessCategoryFilter.innerHTML = `
    <option value="all">Todas</option>
    ${options.map((item) => `<option value="${item.value}">${item.label}</option>`).join("")}
  `;
  businessCategoryFilter.value = options.some((item) => item.value === selected)
    ? selected
    : "all";
};

const renderBusinesses = (list: Business[], total: number) => {
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
            <th class="px-4 text-left font-semibold">Categorías</th>
            <th class="px-4 text-left font-semibold">Instagram</th>
            <th class="px-4 text-left font-semibold">Estado</th>
            <th class="px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${list
            .map(
              (business) => `
                <tr class="rounded-2xl bg-white/90">
                  <td class="rounded-l-2xl border border-ink-900/10 bg-white/90 px-4 py-3 align-top">
                    <p class="truncate text-sm font-semibold">${business.name}</p>
                    <p class="mt-1 text-xs text-ink-900/60">${business.slug}</p>
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${businessTypeLabels[business.type as keyof typeof businessTypeLabels] ?? business.type}
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${formatBusinessCities(business._id)}
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${formatBusinessCategories(business)}
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${business.instagram ? `@${business.instagram}` : "—"}
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
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="grid gap-3 md:hidden">
      ${list
        .map(
          (business) => `
            <div class="rounded-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-sm font-semibold truncate">${business.name}</p>
                  <p class="text-xs text-ink-900/60">${business.slug}</p>
                  <p class="text-xs text-ink-900/60">
                    ${businessTypeLabels[business.type as keyof typeof businessTypeLabels] ?? business.type} ·
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
          `,
        )
        .join("")}
    </div>
  `;
};

const populateBusinessSelects = () => {
  const isAdmin = currentUser?.role === "ADMIN";
  businessSelects.forEach((select) => {
    const selected = select.value;
    if (businesses.length === 0) {
      select.innerHTML = '<option value="">Sin negocios</option>';
      select.disabled = true;
      return;
    }
    if (!isAdmin && currentBusinessId) {
      const business =
        businesses.find((item) => item._id === currentBusinessId) ??
        businesses[0];
      select.innerHTML = `<option value="${business._id}">${business.name}</option>`;
      select.value = business._id;
      select.disabled = true;
      return;
    }
    select.disabled = false;
    select.innerHTML = businesses
      .map(
        (business) =>
          `<option value="${business._id}">${business.name}</option>`,
      )
      .join("");
    if (selected) {
      select.value = selected;
    }
  });
};

const populateBranchSelect = (
  businessId: string,
  branchItems: Branch[] = branches,
) => {
  if (!branchSelect) return;
  const filtered = branchItems.filter(
    (branch) => branch.businessId === businessId,
  );
  branchSelect.innerHTML = `<option value="">Global</option>`;
  filtered.forEach((branch) => {
    const option = document.createElement("option");
    option.value = branch._id;
    option.textContent = `${branch.city} · ${branch.address}`;
    branchSelect.append(option);
  });
  branchSelect.disabled = filtered.length === 0;
};

const getFilteredBranches = () => {
  const searchValue = branchFilters.search.trim().toLowerCase();
  return branches.filter((branch) => {
    const businessMatch =
      branchFilters.businessId === "all" ||
      branch.businessId === branchFilters.businessId;
    const cityMatch =
      branchFilters.city === "all" || branch.city === branchFilters.city;
    const textMatch =
      searchValue.length === 0 ||
      branch.address.toLowerCase().includes(searchValue);
    return businessMatch && cityMatch && textMatch;
  });
};

const renderBranches = (list: Branch[], total: number) => {
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
        ${
          isAdmin
            ? ""
            : `<button class="mt-3 inline-flex text-xs underline" data-empty-action="branch">
          Crear sede
        </button>`
        }
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
            <th class="px-4 text-left font-semibold">Dirección</th>
            <th class="px-4 text-left font-semibold">Contacto</th>
            <th class="px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${list
            .map(
              (branch) => `
                <tr class="rounded-2xl bg-white/90">
                  <td class="rounded-l-2xl border border-ink-900/10 bg-white/90 px-4 py-3 align-top">
                    <p class="truncate text-sm font-semibold">${businessMap.get(branch.businessId)?.name ?? "Negocio"}</p>
                    <p class="mt-1 text-xs text-ink-900/60">${branch.city}</p>
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">${branch.city}</td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">${branch.zone ?? "Sin zona"}</td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">${branch.address}</td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">${branch.phone ?? "Sin teléfono"}</td>
                  <td class="rounded-r-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
                    <div class="flex flex-wrap gap-2 text-xs">
                      <button class="action-btn action-view" data-branch-view="${branch._id}">Ver</button>
                      <button class="action-btn action-edit" data-branch-edit="${branch._id}">Editar</button>
                      <button class="action-btn action-delete" data-branch-delete="${branch._id}">Eliminar</button>
                    </div>
                  </td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="grid gap-3 md:hidden">
      ${list
        .map(
          (branch) => `
            <div class="rounded-2xl border border-ink-900/10 bg-white/90 px-4 py-3">
              <p class="text-sm font-semibold">${businessMap.get(branch.businessId)?.name ?? "Negocio"}</p>
              <p class="text-xs text-ink-900/60">${branch.city} · ${branch.zone ?? "Sin zona"}</p>
              <p class="text-xs text-ink-900/60">${branch.address}</p>
              <p class="text-xs text-ink-900/60">${branch.phone ?? "Sin teléfono"}</p>
              <div class="mt-3 flex flex-wrap gap-2 text-xs">
                <button class="action-btn action-view" data-branch-view="${branch._id}">Ver</button>
                <button class="action-btn action-edit" data-branch-edit="${branch._id}">Editar</button>
                <button class="action-btn action-delete" data-branch-delete="${branch._id}">Eliminar</button>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
};

const updatePromoKpis = () => {
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

const updatePromoBusinessFilterOptions = () => {
  if (!promoBusinessFilter) return;
  const isAdmin = currentUser?.role === "ADMIN";
  promoBusinessFilter.hidden = !isAdmin;
  if (!isAdmin) {
    return;
  }
  const currentValue = promoBusinessFilter.value || "all";
  promoBusinessFilter.innerHTML = `
    <option value="all">Todos</option>
    ${businesses
      .map(
        (business) =>
          `<option value="${business._id}">${business.name}</option>`,
      )
      .join("")}
  `;
  promoBusinessFilter.value = currentValue;
};

const getFilteredPromotions = () => {
  const searchValue = promoFilters.search.trim().toLowerCase();
  return promotions.filter((promo) => {
    const businessMatch =
      promoFilters.businessId === "all" ||
      promo.businessId === promoFilters.businessId;
    const statusMatch =
      promoFilters.status === "all" ||
      (promoFilters.status === "active" && (promo.active ?? true)) ||
      (promoFilters.status === "inactive" && !(promo.active ?? true));
    const typeMatch =
      promoFilters.type === "all" || promo.promoType === promoFilters.type;
    const textMatch =
      searchValue.length === 0 ||
      promo.title.toLowerCase().includes(searchValue) ||
      (promo.description ?? "").toLowerCase().includes(searchValue);
    return businessMatch && statusMatch && typeMatch && textMatch;
  });
};

const renderPromotions = (promos: Promotion[], total: number) => {
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
          Crear promoción
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
            <th class="px-4 text-left font-semibold">Promoción</th>
            <th class="px-4 text-left font-semibold">Tipo</th>
            <th class="px-4 text-left font-semibold">Estado</th>
            <th class="px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${promos
            .map((promo) => {
              const isActive = promo.active ?? true;
              const statusLabel = isActive ? "Activa" : "Inactiva";
              const dateLabel =
                promo.startDate && promo.endDate
                  ? `${promo.startDate.slice(0, 10)} → ${promo.endDate.slice(0, 10)}`
                  : "Sin fechas";
              const promoBusiness = isAdmin
                ? businessMap.get(promo.businessId)
                : businessMap.get(currentBusinessId);
              const businessName = promoBusiness?.name ?? "Negocio";
              const instagramHandle = (promoBusiness?.instagram ?? "")
                .replace("@", "")
                .trim();
              const instagramLink = instagramHandle
                ? `<a class="underline" data-instagram-link data-instagram-handle="${instagramHandle}" href="https://instagram.com/${instagramHandle}" target="_blank" rel="noreferrer">@${instagramHandle}</a>`
                : "";
              return `
                <tr class="rounded-2xl bg-white/90">
                  <td class="rounded-l-2xl border border-ink-900/10 bg-white/90 px-4 py-3 align-top">
                    <p class="truncate text-sm font-semibold">${promo.title}</p>
                    <p class="text-xs text-ink-900/60">${dateLabel}</p>
                    <p class="text-xs text-ink-900/60">${businessName}</p>
                    ${instagramLink ? `<div class="mt-1 text-xs text-ink-900/60">${instagramLink}</div>` : ""}
                  </td>
                  <td class="border-y border-l border-ink-900/10 bg-white/90 px-4 py-3 text-xs text-ink-900/70">
                    ${promoTypeLabels[promo.promoType as keyof typeof promoTypeLabels] ?? promo.promoType}
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
            })
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="grid gap-3 md:hidden">
      ${promos
        .map((promo) => {
          const isActive = promo.active ?? true;
          const statusLabel = isActive ? "Activa" : "Inactiva";
          const dateLabel =
            promo.startDate && promo.endDate
              ? `${promo.startDate.slice(0, 10)} → ${promo.endDate.slice(0, 10)}`
              : "Sin fechas";
          const promoBusiness = isAdmin
            ? businessMap.get(promo.businessId)
            : businessMap.get(currentBusinessId);
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
        })
        .join("")}
    </div>
  `;
};

const updatePromotionsView = () => {
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

const updateBranchCityFilterOptions = () => {
  if (!branchCityFilter) return;
  const cities = Array.from(
    new Set(branches.map((branch) => branch.city)),
  ).sort();
  const currentValue = branchCityFilter.value;
  branchCityFilter.innerHTML = `
    <option value="all">Todas</option>
    ${cities.map((city) => `<option value="${city}">${city}</option>`).join("")}
  `;
  if (cities.includes(currentValue)) {
    branchCityFilter.value = currentValue;
  } else {
    branchCityFilter.value = "all";
    branchFilters.city = "all";
  }
};

const updateBranchBusinessFilterOptions = () => {
  if (!branchBusinessFilter) return;
  const isAdmin = currentUser?.role === "ADMIN";
  branchBusinessFilter.hidden = !isAdmin;
  if (!isAdmin) {
    return;
  }
  const currentValue = branchBusinessFilter.value || "all";
  branchBusinessFilter.innerHTML = `
    <option value="all">Todos</option>
    ${businesses
      .map(
        (business) =>
          `<option value="${business._id}">${business.name}</option>`,
      )
      .join("")}
  `;
  branchBusinessFilter.value = currentValue;
};

const updateBranchPagination = (total: number, isAdmin: boolean) => {
  if (
    !branchPagination ||
    !branchPageInfo ||
    !branchPagePrev ||
    !branchPageNext
  )
    return;
  if (!isAdmin) {
    branchPagination.hidden = true;
    return;
  }
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_BRANCH_PAGE_SIZE));
  if (adminBranchPage > totalPages) {
    adminBranchPage = totalPages;
  }
  branchPageInfo.textContent = `Página ${adminBranchPage} de ${totalPages}`;
  branchPagePrev.disabled = adminBranchPage <= 1;
  branchPageNext.disabled = adminBranchPage >= totalPages;
  branchPagination.hidden = totalPages <= 1;
};

const updateBranchesView = () => {
  updateBranchCityFilterOptions();
  updateBranchBusinessFilterOptions();
  const total = branches.length;
  if (branchKpiTotal) {
    branchKpiTotal.textContent = String(total);
  }
  if (branchKpiCities) {
    branchKpiCities.textContent = String(
      new Set(branches.map((branch) => branch.city)).size,
    );
  }
  if (branchKpiPhones) {
    branchKpiPhones.textContent = String(
      branches.filter((branch) => (branch.phone ?? "").trim().length > 0)
        .length,
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

const updateBusinessesView = () => {
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

const updateBusinessPagination = (total: number, isAdmin: boolean) => {
  if (
    !businessPagination ||
    !businessPageInfo ||
    !businessPagePrev ||
    !businessPageNext
  )
    return;
  if (!isAdmin) {
    businessPagination.hidden = true;
    return;
  }
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_BUSINESS_PAGE_SIZE));
  if (adminBusinessPage > totalPages) {
    adminBusinessPage = totalPages;
  }
  businessPageInfo.textContent = `Página ${adminBusinessPage} de ${totalPages}`;
  businessPagePrev.disabled = adminBusinessPage <= 1;
  businessPageNext.disabled = adminBusinessPage >= totalPages;
  businessPagination.hidden = totalPages <= 1;
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
  if (!currentUser) {
    setHeaderAuthState(false);
  }
  renderUser();
};

const loadBusinesses = async () => {
  if (!currentUser) return;
  renderLoadingMessage(businessList, "Cargando negocios...");
  businessSelects.forEach((select) =>
    setSelectLoading(select, "Cargando negocios..."),
  );
  const isAdmin = currentUser.role === "ADMIN";
  adminBusinessPage = 1;
  const response = await apiFetch<Business[]>(
    isAdmin ? "/businesses" : "/businesses/mine",
  );
  businesses = response;
  businessFilters = {
    search: "",
    type: "all",
    city: "all",
    category: "all",
    verified: "all",
    instagram: "all",
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

const loadBranches = async (businessId: string) => {
  renderLoadingMessage(branchList, "Cargando sedes...");
  setSelectLoading(branchSelect, "Cargando sedes...");
  const response = await apiFetch<Branch[]>(
    businessId ? `/branches?businessId=${businessId}` : "/branches",
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

const loadPromotions = async (businessId?: string): Promise<Promotion[]> => {
  renderLoadingMessage(promoList, "Cargando promociones...");
  const response = await apiFetch<Promotion[]>(
    businessId ? `/promotions?businessId=${businessId}` : "/promotions",
  );
  promotions = response;
  return response;
};

const loadBranchOptionsForBusiness = async (businessId: string) => {
  if (!branchSelect) return;
  setSelectLoading(branchSelect, "Cargando sedes...");
  const response = await apiFetch<Branch[]>(
    `/branches?businessId=${businessId}`,
  );
  populateBranchSelect(businessId, response);
};

const updateCityPagination = (total: number) => {
  if (!cityPagination || !cityPageInfo || !cityPagePrev || !cityPageNext)
    return;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_CITY_PAGE_SIZE));
  if (adminCityPage > totalPages) {
    adminCityPage = totalPages;
  }
  cityPageInfo.textContent = `Página ${adminCityPage} de ${totalPages}`;
  cityPagePrev.disabled = adminCityPage <= 1;
  cityPageNext.disabled = adminCityPage >= totalPages;
  cityPagination.hidden = totalPages <= 1;
};

const renderCities = () => {
  if (!cityList) return;
  if (cities.length === 0) {
    cityList.innerHTML =
      '<p class="text-ink-900/60">Sin ciudades registradas.</p>';
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
      new Set(cities.map((city) => city.countryCode.toUpperCase())).size,
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
            <th class="px-4 text-left font-semibold">País</th>
            <th class="px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${paged
            .map(
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
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="grid gap-2 md:hidden">
      ${paged
        .map(
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
          `,
        )
        .join("")}
    </div>
  `;
  updateCityPagination(cities.length);
};

const renderCategories = () => {
  if (!categoryList) return;
  if (categories.length === 0) {
    categoryList.innerHTML =
      '<p class="text-ink-900/60">Sin categorías registradas.</p>';
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
      categories.filter((category) => category.slug.trim().length > 0).length,
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
            <th class="px-4 text-left font-semibold">Categoría</th>
            <th class="px-4 text-left font-semibold">Slug</th>
            <th class="px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${paged
            .map(
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
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="grid gap-2 md:hidden">
      ${paged
        .map(
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
          `,
        )
        .join("")}
    </div>
  `;
  updateCategoryPagination(categories.length);
};

const updateCategoryPagination = (total: number) => {
  if (
    !categoryPagination ||
    !categoryPageInfo ||
    !categoryPagePrev ||
    !categoryPageNext
  )
    return;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_CATEGORY_PAGE_SIZE));
  if (adminCategoryPage > totalPages) {
    adminCategoryPage = totalPages;
  }
  categoryPageInfo.textContent = `Página ${adminCategoryPage} de ${totalPages}`;
  categoryPagePrev.disabled = adminCategoryPage <= 1;
  categoryPageNext.disabled = adminCategoryPage >= totalPages;
  categoryPagination.hidden = totalPages <= 1;
};

const loadCities = async () => {
  renderLoadingMessage(cityList, "Cargando ciudades...");
  setSelectLoading(branchCitySelect, "Cargando ciudades...");
  cities = await apiFetch<City[]>("/cities");
  adminCityPage = 1;
  renderCities();
  if (branchCitySelect) {
    setSelectReady(
      branchCitySelect,
      [
        `<option value=\"\">Selecciona una ciudad</option>`,
        ...cities.map(
          (city) => `<option value=\"${city.name}\">${city.name}</option>`,
        ),
      ].join(""),
    );
  }
};

const loadCategories = async () => {
  renderLoadingMessage(categoryList, "Cargando categorías...");
  setSelectLoading(categorySuggestions, "Cargando categorías...");
  categories = await apiFetch<Category[]>("/categories");
  adminCategoryPage = 1;
  renderCategories();
  if (categorySuggestions) {
    setSelectReady(
      categorySuggestions,
      categories
        .map(
          (category) =>
            `<option value="${category.slug}">${category.name}</option>`,
        )
        .join(""),
      false,
    );
  }
};

const wireAdminActions = () => {
  if (cityList) {
    cityList.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;
      const viewId = target.dataset.cityView;
      const editId = target.dataset.cityEdit;
      const id = target.dataset.cityDelete;
      if (viewId) {
        const city = cities.find((item) => item._id === viewId);
        if (city) {
          setCityForm(city, {
            mode: "view",
            readOnly: true,
            title: "Detalle de la ciudad",
          });
          openModal("city");
        }
        return;
      }
      if (editId) {
        const city = cities.find((item) => item._id === editId);
        if (city) {
          setCityForm(city, {
            mode: "edit",
            readOnly: false,
            title: "Editar ciudad",
          });
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
      const target = event.target as HTMLElement;
      const viewId = target.dataset.categoryView;
      const editId = target.dataset.categoryEdit;
      const id = target.dataset.categoryDelete;
      if (viewId) {
        const category = categories.find((item) => item._id === viewId);
        if (category) {
          setCategoryForm(category, {
            mode: "view",
            readOnly: true,
            title: "Detalle de la categoría",
          });
          openModal("category");
        }
        return;
      }
      if (editId) {
        const category = categories.find((item) => item._id === editId);
        if (category) {
          setCategoryForm(category, {
            mode: "edit",
            readOnly: false,
            title: "Editar categoría",
          });
          openModal("category");
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
    if (businessForm.dataset.mode === "view") {
      return;
    }
    const businessEditing = businessForm.dataset.mode === "edit";
    setMessage(
      businessMessage,
      businessEditing ? "Actualizando negocio..." : "Guardando negocio...",
    );

    const data = new FormData(businessForm);
    const categoryValues = Array.from(
      businessForm.querySelectorAll<HTMLSelectElement>(
        "[name='categories'] option:checked",
      ),
    ).map((option) => option.value);
    const slug = normalizeSlug(String(data.get("slug") ?? ""));
    const slugConflict = businesses.some(
      (business) =>
        business.slug.toLowerCase() === slug &&
        (!businessForm.dataset.editId ||
          business._id !== businessForm.dataset.editId),
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
        if (
          businessForm.dataset.mode === "edit" &&
          businessForm.dataset.editId
        ) {
          await apiFetch<Business>(
            `/businesses/${businessForm.dataset.editId}`,
            {
              method: "PATCH",
              body: JSON.stringify(payload),
            },
          );
        } else {
          await apiFetch<Business>("/businesses", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        }
        businessForm.reset();
        setMessage(
          businessMessage,
          businessEditing ? "Negocio actualizado." : "Negocio creado.",
        );
        setBusinessForm();
        await loadBusinesses();
        if (businesses.length > 0) {
          currentBusinessId = businesses[0]._id;
        }
        showToast(
          "Listo",
          businessEditing ? "Negocio actualizado." : "Negocio creado.",
          "success",
        );
        closeAllModals();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error creando negocio";
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
    if (branchForm.dataset.mode === "view") {
      return;
    }
    const branchEditing = branchForm.dataset.mode === "edit";
    setMessage(
      branchMessage,
      branchEditing ? "Actualizando sede..." : "Guardando sede...",
    );

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
        setMessage(
          branchMessage,
          branchEditing ? "Sede actualizada." : "Sede creada.",
        );
        setBranchForm();
        const businessId = String(data.get("businessId") ?? "");
        if (businessId) {
          currentBusinessId = businessId;
          await loadBranches(businessId);
          await loadPromotions(businessId);
          updatePromotionsView();
        }
        showToast(
          "Listo",
          branchEditing ? "Sede actualizada." : "Sede creada.",
          "success",
        );
        closeAllModals();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error creando sede";
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
    if (promoForm.dataset.mode === "view") {
      return;
    }
    const promoEditing = promoForm.dataset.mode === "edit";
    setMessage(
      promoMessage,
      promoEditing ? "Actualizando promoción..." : "Guardando promoción...",
    );

    const data = new FormData(promoForm);
    const days = data.getAll("daysOfWeek").map((day) => String(day));
    const startDate = String(data.get("startDate"));
    const endDate = String(data.get("endDate"));
    const startDateIso = startDate
      ? new Date(`${startDate}T00:00:00`).toISOString()
      : "";
    const endDateIso = endDate
      ? new Date(`${endDate}T23:59:59`).toISOString()
      : "";
    if (days.length === 0) {
      const message = "Selecciona al menos un día de la semana.";
      setMessage(promoMessage, message);
      showToast("Error", message, "error");
      return;
    }
    if (startDate && endDate && !isValidDateRange(startDateIso, endDateIso)) {
      const message =
        "La fecha de fin debe ser posterior a la fecha de inicio.";
      setMessage(promoMessage, message);
      showToast("Error", message, "error");
      return;
    }
    if (
      !isValidTimeRange(
        String(data.get("startHour") ?? ""),
        String(data.get("endHour") ?? ""),
      )
    ) {
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
        setMessage(
          promoMessage,
          promoEditing ? "Promoción actualizada." : "Promoción creada.",
        );
        setPromoForm();
        if (currentBusinessId) {
          await loadPromotions(currentBusinessId);
          updatePromotionsView();
        }
        showToast(
          "Listo",
          promoEditing ? "Promoción actualizada." : "Promoción creada.",
          "success",
        );
        closeAllModals();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error creando promoción";
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
    if (cityForm.dataset.mode === "view") {
      return;
    }
    const cityEditing = cityForm.dataset.mode === "edit";
    setMessage(
      cityMessage,
      cityEditing ? "Actualizando ciudad..." : "Guardando ciudad...",
    );
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
        setMessage(
          cityMessage,
          cityEditing ? "Ciudad actualizada." : "Ciudad creada.",
        );
        setCityForm();
        await loadCities();
        showToast(
          "Listo",
          cityEditing ? "Ciudad actualizada." : "Ciudad creada.",
          "success",
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error creando ciudad";
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
    if (categoryForm.dataset.mode === "view") {
      return;
    }
    const categoryEditing = categoryForm.dataset.mode === "edit";
    setMessage(
      categoryMessage,
      categoryEditing ? "Actualizando categoría..." : "Guardando categoría...",
    );
    const data = new FormData(categoryForm);
    await withLoading(categoryForm, async () => {
      try {
        const payload = {
          name: data.get("name"),
          slug: String(data.get("slug") ?? "").toLowerCase(),
        };
        if (
          categoryForm.dataset.mode === "edit" &&
          categoryForm.dataset.editId
        ) {
          await apiFetch<Category>(
            `/categories/${categoryForm.dataset.editId}`,
            {
              method: "PATCH",
              body: JSON.stringify(payload),
            },
          );
        } else {
          await apiFetch<Category>("/categories", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        }
        categoryForm.reset();
        setMessage(
          categoryMessage,
          categoryEditing ? "Categoría actualizada." : "Categoría creada.",
        );
        setCategoryForm();
        await loadCategories();
        showToast(
          "Listo",
          categoryEditing ? "Categoría actualizada." : "Categoría creada.",
          "success",
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error creando categoría";
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

const wireBusinessActions = () => {
  if (!businessList) return;
  businessList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
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
            title: "Detalle del negocio",
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
        setBusinessForm(business, {
          mode: "edit",
          readOnly: false,
          title: "Editar negocio",
        });
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
      const confirmed = window.confirm(
        "¿Eliminar este negocio? También perderás sus sedes y promos.",
      );
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

const wireOwnerBusinessEdit = () => {
  if (!ownerBusinessEdit) return;
  ownerBusinessEdit.addEventListener("click", async () => {
    const business =
      businesses.find((item) => item._id === currentBusinessId) ??
      businesses[0];
    if (!business) return;
    setBusinessForm(business, {
      mode: "edit",
      readOnly: false,
      title: "Editar negocio",
    });
    setActiveDashboardTab("business");
    openModal("business");
  });
};

const wireBranchActions = () => {
  if (!branchList) return;
  branchList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const viewId = target.dataset.branchView;
    const editId = target.dataset.branchEdit;
    const deleteId = target.dataset.branchDelete;
    if (viewId) {
      const branch = branches.find((item) => item._id === viewId);
      if (branch) {
        setBranchForm(branch, {
          mode: "view",
          readOnly: true,
          title: "Detalle de la sede",
        });
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
        setBranchForm(branch, {
          mode: "edit",
          readOnly: false,
          title: "Editar sede",
        });
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
    const confirmed = window.confirm("¿Eliminar esta sede?");
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

const wirePromoActions = () => {
  if (!promoList) return;
  promoList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const instagramLink = target.closest<HTMLAnchorElement>(
      "[data-instagram-link]",
    );
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
          title: "Detalle de la promoción",
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
        await setPromoForm(promo, {
          mode: "edit",
          readOnly: false,
          title: "Editar promoción",
        });
        setActiveDashboardTab("promos");
        openModal("promo");
      }
    }
    if (!deleteId) return;
    const confirmed = window.confirm("¿Eliminar esta promoción?");
    if (!confirmed) return;
    promotions = promotions.filter((promo) => promo._id !== deleteId);
    updatePromotionsView();
    await apiFetch(`/promotions/${deleteId}`, { method: "DELETE" });
    showToast("Listo", "Promoción eliminada.", "success");
    if (currentBusinessId) {
      await loadPromotions(currentBusinessId);
      updatePromotionsView();
    }
  });
};

const wireEmptyStateActions = () => {
  document.body.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.emptyAction;
    if (!action) return;
    focusCreateForm(action);
  });
};

const wireCancelButtons = () => {
  // no-op: cancel buttons removed
};

const wireDashboardTabs = () => {
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

const wireDashboardMenu = () => {
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

const wireDashboardCreateButtons = () => {
  if (dashboardCreateButtons.length === 0) return;
  dashboardCreateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.dashboardCreate;
      if (!target) return;
      focusCreateForm(target);
    });
  });
};

const wireDashboardDelegates = () => {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const tabButton = target.closest<HTMLElement>("[data-dashboard-tab]");
    if (tabButton?.dataset.dashboardTab) {
      event.preventDefault();
      setActiveDashboardTab(tabButton.dataset.dashboardTab);
      setDashboardMenuOpen(false);
      return;
    }
    const createButton = target.closest<HTMLElement>("[data-dashboard-create]");
    if (createButton?.dataset.dashboardCreate) {
      event.preventDefault();
      focusCreateForm(createButton.dataset.dashboardCreate);
    }
  });
};

const wireDashboardModal = () => {
  const wireModal = (
    overlay: HTMLElement | null,
    closeButton: HTMLButtonElement | null,
  ) => {
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

const wirePromoFilters = () => {
  if (!promoSearchInput || !promoStatusSelect || !promoTypeSelect) return;
  const updateFilters = () => {
    promoFilters = {
      search: promoSearchInput.value,
      status: promoStatusSelect.value,
      type: promoTypeSelect.value,
      businessId: promoBusinessFilter?.value ?? "all",
    };
    adminPromoPage = 1;
    updatePromotionsView();
  };
  promoSearchInput.addEventListener("input", updateFilters);
  promoStatusSelect.addEventListener("change", updateFilters);
  promoTypeSelect.addEventListener("change", updateFilters);
  promoBusinessFilter?.addEventListener("change", updateFilters);
};

const wirePromoPagination = () => {
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

const wireBranchPagination = () => {
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

const wireBusinessPagination = () => {
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

const wireCityPagination = () => {
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

const wireCategoryPagination = () => {
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

const wireBranchFilters = () => {
  if (!branchSearchInput || !branchCityFilter) return;
  const updateFilters = () => {
    branchFilters = {
      search: branchSearchInput.value,
      city: branchCityFilter.value,
      businessId: branchBusinessFilter?.value ?? "all",
    };
    adminBranchPage = 1;
    updateBranchesView();
  };
  branchSearchInput.addEventListener("input", updateFilters);
  branchCityFilter.addEventListener("change", updateFilters);
  branchBusinessFilter?.addEventListener("change", updateFilters);
};

const wireBusinessFilters = () => {
  if (!businessSearchInput || !businessTypeFilter) return;
  const updateFilters = () => {
    businessFilters = {
      search: businessSearchInput.value,
      type: businessTypeFilter.value,
      city: businessCityFilter?.value ?? "all",
      category: businessCategoryFilter?.value ?? "all",
      verified: businessVerifiedFilter?.value ?? "all",
      instagram: businessInstagramFilter?.value ?? "all",
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
