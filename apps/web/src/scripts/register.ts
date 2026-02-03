import { apiFetch } from "./api";

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

const categorySelect = document.querySelector<HTMLSelectElement>(
  "[data-register-category-select]",
);
const categorySearch = document.querySelector<HTMLInputElement>(
  "[data-register-category-search]",
);
const categoryChips = document.querySelector<HTMLElement>(
  "[data-register-category-chips]",
);
const categorySelectAll = document.querySelector<HTMLButtonElement>(
  "[data-register-category-select-all]",
);
const categoryClear = document.querySelector<HTMLButtonElement>(
  "[data-register-category-clear]",
);
const categoryCount = document.querySelector<HTMLElement>(
  "[data-register-category-count]",
);
const categoryResults = document.querySelector<HTMLElement>(
  "[data-register-category-results]",
);
const citySelect = document.querySelector<HTMLSelectElement>(
  "[data-register-city-select]",
);

const loadCategories = async () => {
  if (!categorySelect) return;
  try {
    const categories = await apiFetch<Category[]>("/categories");
    categorySelect.innerHTML = categories
      .map(
        (category) =>
          `<option value="${category.slug}" data-label="${category.name}">${category.name}</option>`,
      )
      .join("");
    if (categorySearch) {
      categorySearch.disabled = false;
    }
    if (categorySelectAll) {
      categorySelectAll.disabled = false;
    }
    if (categoryClear) {
      categoryClear.disabled = false;
    }
    renderCategoryChips();
    renderCategoryResults("");
  } catch {
    categorySelect.innerHTML =
      '<option value="">Sin categorias disponibles</option>';
    categorySelect.disabled = true;
    if (categorySearch) {
      categorySearch.disabled = true;
    }
    if (categorySelectAll) {
      categorySelectAll.disabled = true;
    }
    if (categoryClear) {
      categoryClear.disabled = true;
    }
    if (categoryResults) {
      categoryResults.innerHTML =
        '<p class="text-ink-900/60">Sin categorías disponibles.</p>';
    }
  }
};

loadCategories();

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const highlightMatch = (label: string, query: string) => {
  if (!query) return escapeHtml(label);
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedQuery, "ig");
  return escapeHtml(label).replace(
    regex,
    (match) => `<mark class="rounded bg-sand-200/80 px-1">${match}</mark>`,
  );
};

const renderCategoryChips = () => {
  if (!categorySelect || !categoryChips) return;
  const selected = Array.from(categorySelect.options).filter(
    (option) => option.selected,
  );
  categoryChips.innerHTML =
    selected.length === 0
      ? '<span class="text-ink-900/50">Sin categorías seleccionadas.</span>'
      : selected
          .map(
            (option) =>
              `<button type="button" class="rounded-full border border-ink-900/10 bg-white/90 px-3 py-1" data-category-chip="${option.value}">${option.textContent}</button>`,
          )
          .join("");
  if (categoryCount) {
    categoryCount.textContent = `Seleccionadas: ${selected.length}`;
  }
};

const renderCategoryResults = (query: string) => {
  if (!categorySelect || !categoryResults) return;
  if (query.length > 0 && query.length < 2) {
    categoryResults.innerHTML =
      '<p class="text-ink-900/60">Escribe al menos 2 letras para buscar.</p>';
    return;
  }
  const options = Array.from(categorySelect.options);
  const matches = options.filter((option) =>
    option.textContent?.toLowerCase().includes(query),
  );
  categoryResults.innerHTML =
    matches.length === 0
      ? '<p class="text-ink-900/60">No encontramos coincidencias.</p>'
      : matches
          .map((option) => {
            const label = option.textContent ?? "";
            const highlighted = highlightMatch(label, query);
            const selected = option.selected;
            return `<button type="button" class="flex items-center justify-between rounded-xl border border-ink-900/10 bg-white/90 px-3 py-2 text-left" data-category-result="${option.value}">
              <span class="truncate">${highlighted}</span>
              <span class="text-ink-900/50">${selected ? "Seleccionada" : "Agregar"}</span>
            </button>`;
          })
          .join("");
};

if (categorySelect) {
  categorySelect.addEventListener("change", () => {
    renderCategoryChips();
    const query = categorySearch?.value.trim().toLowerCase() ?? "";
    renderCategoryResults(query);
  });
}

if (categoryChips && categorySelect) {
  categoryChips.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const value = target.dataset.categoryChip;
    if (!value) return;
    const option = Array.from(categorySelect.options).find(
      (item) => item.value === value,
    );
    if (option) {
      option.selected = false;
      categorySelect.dispatchEvent(new Event("change"));
    }
  });
}

if (categoryResults && categorySelect) {
  categoryResults.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLElement>("[data-category-result]");
    const value = button?.dataset.categoryResult;
    if (!value) return;
    const option = Array.from(categorySelect.options).find(
      (item) => item.value === value,
    );
    if (option) {
      option.selected = !option.selected;
      categorySelect.dispatchEvent(new Event("change"));
    }
  });
}

if (categorySelectAll && categorySelect) {
  categorySelectAll.addEventListener("click", () => {
    Array.from(categorySelect.options).forEach((option) => {
      option.selected = true;
    });
    categorySelect.dispatchEvent(new Event("change"));
  });
}

if (categoryClear && categorySelect) {
  categoryClear.addEventListener("click", () => {
    Array.from(categorySelect.options).forEach((option) => {
      option.selected = false;
    });
    categorySelect.dispatchEvent(new Event("change"));
  });
}

if (categorySelect && categorySearch) {
  categorySearch.addEventListener("input", () => {
    const query = categorySearch.value.trim().toLowerCase();
    Array.from(categorySelect.options).forEach((option) => {
      const matches = option.textContent?.toLowerCase().includes(query);
      option.hidden = query.length >= 2 && !matches;
    });
    renderCategoryResults(query);
    categorySelect.hidden = query.length >= 2;
  });
  categorySearch.addEventListener("blur", () => {
    const query = categorySearch.value.trim().toLowerCase();
    if (query.length < 2) {
      categorySelect.hidden = false;
    }
  });
}

const loadCities = async () => {
  if (!citySelect) return;
  try {
    const cities = await apiFetch<City[]>("/cities");
    citySelect.innerHTML = [
      `<option value="">Selecciona una ciudad</option>`,
      ...cities.map((city) => `<option value="${city.name}">${city.name}</option>`),
    ].join("");
  } catch {
    citySelect.innerHTML = '<option value="">Sin ciudades disponibles</option>';
    citySelect.disabled = true;
  }
};

loadCities();
