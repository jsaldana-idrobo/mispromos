import type { Promotion } from "./types";
import { formatDaysFull, formatPromoType, getPromoVisual } from "./formatters";

type PromoModalElements = {
  overlay: HTMLElement | null;
  modal: HTMLElement | null;
  close: HTMLButtonElement | null;
  title: HTMLElement | null;
  featured: HTMLElement | null;
  business: HTMLElement | null;
  description: HTMLElement | null;
  tags: HTMLElement | null;
  promoType: HTMLElement | null;
  value: HTMLElement | null;
  days: HTMLElement | null;
  instagram: HTMLAnchorElement | null;
  image: HTMLImageElement | null;
  emoji: HTMLElement | null;
  fieldValue: HTMLElement | null;
  fieldInstagram: HTMLElement | null;
};

const setModalFieldVisibility = (
  wrapper: HTMLElement | null,
  value: string | null,
) => {
  if (!wrapper) return;
  if (!value) {
    wrapper.classList.add("hidden");
    return;
  }
  wrapper.classList.remove("hidden");
};

const getTagsHtml = (categories: string[]) => {
  if (categories.length === 0) {
    return `<span class="promo-pill">#local</span>`;
  }
  return categories
    .slice(0, 4)
    .map((item) => `<span class="promo-pill">#${item}</span>`)
    .join("");
};

const updateInstagram = (elements: PromoModalElements, handle: string) => {
  if (!elements.instagram) return;
  if (handle) {
    elements.instagram.textContent = `@${handle}`;
    elements.instagram.href = `https://instagram.com/${handle}`;
  } else {
    elements.instagram.textContent = "";
    elements.instagram.removeAttribute("href");
  }
  setModalFieldVisibility(elements.fieldInstagram, handle || null);
};

const updateMedia = (
  elements: PromoModalElements,
  promo: Promotion,
  emoji: string,
) => {
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
    return;
  }
  if (elements.image) {
    elements.image.removeAttribute("src");
    elements.image.classList.add("hidden");
  }
  if (elements.emoji) {
    elements.emoji.textContent = emoji;
    elements.emoji.classList.remove("hidden");
  }
};

const updateTextFields = (
  elements: PromoModalElements,
  promo: Promotion,
  businessName: string,
  promoTypeLabel: string,
  days: string,
  tagsHtml: string,
) => {
  if (elements.title) elements.title.textContent = promo.title;
  if (elements.featured) {
    elements.featured.classList.toggle("hidden", !promo.featured);
  }
  if (elements.business) elements.business.textContent = businessName;
  if (elements.description) {
    elements.description.textContent =
      promo.description ?? "Promoción vigente.";
  }
  if (elements.promoType) elements.promoType.textContent = promoTypeLabel;
  if (elements.value) elements.value.textContent = String(promo.value ?? "");
  if (elements.days) elements.days.textContent = days;
  if (elements.tags) {
    elements.tags.innerHTML = tagsHtml;
  }
  setModalFieldVisibility(
    elements.fieldValue,
    promo.value ? String(promo.value) : null,
  );
};

export const createPromoModal = (elements: PromoModalElements) => {
  const open = (promo: Promotion) => {
    if (!elements.overlay || !elements.modal) return;
    const businessName = promo.business?.name ?? "Negocio local";
    const categories = promo.business?.categories ?? [];
    const category = categories[0];
    const visual = getPromoVisual(category);
    const promoTypeLabel = formatPromoType(promo.promoType);
    const days = formatDaysFull(promo.daysOfWeek);
    const tagsHtml = getTagsHtml(categories);
    const instagramHandle = (promo.business?.instagram ?? "")
      .replaceAll("@", "")
      .trim();
    updateTextFields(
      elements,
      promo,
      businessName,
      promoTypeLabel,
      days,
      tagsHtml,
    );
    updateInstagram(elements, instagramHandle);
    updateMedia(elements, promo, visual.emoji);

    elements.overlay.hidden = false;
    elements.overlay.classList.remove("hidden");
  };

  const close = () => {
    if (!elements.overlay) return;
    elements.overlay.classList.add("hidden");
    elements.overlay.hidden = true;
  };

  const bind = () => {
    elements.close?.addEventListener("click", close);
    elements.overlay?.addEventListener("click", (event) => {
      if (event.target === elements.overlay) {
        close();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
      }
    });
    elements.image?.addEventListener("click", (event) => {
      event.stopPropagation();
      elements.image?.classList.toggle("is-contain");
    });
  };

  return { open, close, bind };
};
