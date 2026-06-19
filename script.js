const catalogItems = [
  {
    title: "シンプルリボンステージ",
    category: "Location",
    image: "images/simple-ribbon-stage.svg",
    description:
      "配信者を主役にするための、軽量で360度使いやすいVirtualCast向けロケーションです。\n\n正面を固定せず、どこから見ても成立しやすいシンプルな空間を想定しています。",
    link: "",
    tags: ["背景", "軽量", "配信向け"],
    meta: {
      "種類": "ロケーション",
      "対応": "VirtualCast",
      "価格": "未設定"
    }
  },
  {
    title: "シンプルコメントボット",
    category: "VCI Item",
    image: "images/simple-comment-bot.svg",
    description:
      "配信コメントが小さなロボットとして空間に出現するVCIです。\n\nコメントを単なる文字ではなく、配信空間にいる存在として見せることを目的にしています。",
    link: "",
    tags: ["コメント", "わんコメ", "ロボット"],
    meta: {
      "種類": "VCI",
      "対応": "VirtualCast / わんコメOSC",
      "価格": "未設定"
    }
  },
  {
    title: "拡張コメントビューア",
    category: "VCI Item",
    image: "images/comment-viewer.svg",
    description:
      "コメント・ギフトをVR空間内で見やすく扱うための表示アイテムです。",
    link: "",
    tags: ["コメント", "ビューア", "配信支援"],
    meta: {
      "種類": "VCI",
      "対応": "VirtualCast / わんコメOSC",
      "価格": "未設定"
    }
  },
  {
    title: "コメントリアクションパック",
    category: "VCI Item",
    image: "images/comment-reaction-pack.svg",
    description:
      "リスナーのコメント内容に応じて、空間内にリアクション演出を発生させるVCIセットです。",
    link: "",
    tags: ["コメント", "演出", "リアクション"],
    meta: {
      "種類": "VCI",
      "対応": "VirtualCast / わんコメOSC",
      "価格": "未設定"
    }
  }
];

const grid = document.getElementById("catalogGrid");
const overlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalLink = document.getElementById("modalLink");
const modalMeta = document.getElementById("modalMeta");
const modalTags = document.getElementById("modalTags");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");

let currentCategory = "All";
let currentQuery = "";

function renderCategoryFilters() {
  const categories = ["All", ...new Set(catalogItems.map(item => item.category).filter(Boolean))];

  categoryFilters.innerHTML = "";

  categories.forEach(category => {
    const button = document.createElement("button");
    button.className = "filter-button";
    button.type = "button";
    button.textContent = category === "All" ? "すべて" : category;
    button.dataset.category = category;

    if (category === currentCategory) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentCategory = category;
      renderCategoryFilters();
      renderCatalog();
    });

    categoryFilters.appendChild(button);
  });
}

function getFilteredItems() {
  const query = normalizeText(currentQuery);

  return catalogItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const matchesCategory = currentCategory === "All" || item.category === currentCategory;

      const searchable = normalizeText([
        item.title,
        item.category,
        item.description,
        ...(item.tags || []),
        ...Object.values(item.meta || {})
      ].join(" "));

      const matchesQuery = !query || searchable.includes(query);

      return matchesCategory && matchesQuery;
    });
}

function renderCatalog() {
  const filtered = getFilteredItems();
  grid.innerHTML = "";

  filtered.forEach(({ item, index }) => {
    const button = document.createElement("button");
    button.className = "catalog-item";
    button.type = "button";
    button.addEventListener("click", () => openModal(index));

    button.innerHTML = `
      <span class="thumb-wrap">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
      </span>
      <span class="catalog-title">${escapeHtml(item.title)}</span>
      <span class="catalog-category">${escapeHtml(item.category)}</span>
      ${renderTagHtml(item.tags || [])}
    `;

    grid.appendChild(button);
  });

  resultCount.textContent = `${filtered.length} / ${catalogItems.length} 件を表示中`;
  emptyMessage.classList.toggle("show", filtered.length === 0);
}

function renderTagHtml(tags) {
  if (!tags.length) return "";

  return `
    <span class="catalog-tags">
      ${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
    </span>
  `;
}

function openModal(index) {
  const item = catalogItems[index];

  modalImage.src = item.image;
  modalImage.alt = item.title;
  modalCategory.textContent = item.category;
  modalTitle.textContent = item.title;
  modalDescription.textContent = item.description;

  renderModalTags(item.tags || []);
  renderMeta(item.meta || {});

  if (item.link) {
    modalLink.href = item.link;
    modalLink.style.display = "inline-flex";
  } else {
    modalLink.style.display = "none";
  }

  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderModalTags(tags) {
  modalTags.innerHTML = "";

  tags.forEach(tag => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    modalTags.appendChild(span);
  });

  modalTags.style.display = tags.length ? "flex" : "none";
}

function renderMeta(meta) {
  modalMeta.innerHTML = "";

  Object.entries(meta).forEach(([key, value]) => {
    if (!value) return;

    const row = document.createElement("div");
    row.innerHTML = `
      <dt>${escapeHtml(key)}</dt>
      <dd>${escapeHtml(value)}</dd>
    `;
    modalMeta.appendChild(row);
  });

  modalMeta.style.display = modalMeta.children.length ? "grid" : "none";
}

function normalizeText(value) {
  return String(value ?? "").toLowerCase().normalize("NFKC");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

searchInput.addEventListener("input", (event) => {
  currentQuery = event.target.value;
  renderCatalog();
});

modalClose.addEventListener("click", closeModal);

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

renderCategoryFilters();
renderCatalog();
