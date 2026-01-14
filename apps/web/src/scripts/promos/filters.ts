export const initFiltersToggle = (
  filtersToggle: HTMLButtonElement | null,
  filtersBody: HTMLElement | null,
) => {
  if (!filtersToggle || !filtersBody) return;
  const updateFiltersToggle = (isOpen: boolean) => {
    filtersBody.classList.toggle("hidden", !isOpen);
    filtersBody.toggleAttribute("hidden", !isOpen);
    filtersToggle.textContent = isOpen ? "Ocultar" : "Mostrar";
    filtersToggle.setAttribute("aria-expanded", String(isOpen));
  };
  filtersBody.classList.add("hidden");
  filtersBody.setAttribute("hidden", "true");
  updateFiltersToggle(false);
  filtersToggle.addEventListener("click", () => {
    const isOpen = !filtersBody.classList.contains("hidden");
    updateFiltersToggle(!isOpen);
  });
};
