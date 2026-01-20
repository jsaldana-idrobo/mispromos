import { apiFetch } from "./api";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

const categorySelect = document.querySelector<HTMLSelectElement>(
  "[data-register-category-select]",
);

const loadCategories = async () => {
  if (!categorySelect) return;
  try {
    const categories = await apiFetch<Category[]>("/categories");
    categorySelect.innerHTML = categories
      .map(
        (category) =>
          `<option value="${category.slug}">${category.name}</option>`,
      )
      .join("");
  } catch {
    categorySelect.innerHTML =
      '<option value="">Sin categorias disponibles</option>';
    categorySelect.disabled = true;
  }
};

loadCategories();
