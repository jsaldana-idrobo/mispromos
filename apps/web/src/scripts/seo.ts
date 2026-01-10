const setMeta = (name: string, content: string) => {
  const existing = document.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  );
  if (existing) {
    existing.content = content;
    return;
  }
  const meta = document.createElement("meta");
  meta.name = name;
  meta.content = content;
  document.head.append(meta);
};

setMeta(
  "description",
  "Promociones activas de negocios locales filtradas por ciudad y horario.",
);
setMeta("theme-color", "#1a1716");
