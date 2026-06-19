const catalogItems = [
  {
    title: "拡張コメントビューア",
    category: "アイテム",
    image: "images/kakutyo_comment.jpg",
    description: "コメント・ギフト、それぞれ最新7件を表示できるシンプルなコメントビューア。\nポインターで選択したコメントを拡大表示できます。",
    link: "https://virtualcast.jp/products/d550ac5a099df2761245b9c097828168348a65b394c3bdff908626eb878e2f22",
    tags: ["コメント","コメントビューア","わんコメ","配信"],
    meta: {
          "種類": "VCI",
          "対応": "VirtualCast"
    }
  },
  {
    title: "シンプルリボンステージ",
    category: "ロケーション",
    image: "images/simple_ribbon_stage.jpg",
    description: "仮想空間をイメージしたロケーション。",
    link: "https://virtualcast.jp/products/fbbb9bc1dbf238cd07eeb03bbe4473af1acc81e08b0b5b944fed44ab66eb5579",
    tags: ["配信","グリッド"],
    meta: {
          "種類": "VCI",
          "対応": "VirtualCast"
    }
  },
  {
    title: "ルーム配信用コメントセット",
    category: "アイテム",
    image: "images/comment_set.jpg",
    description: "ルーム配信向けにコメント落下とコメント窓の処理を1つにまとめました",
    link: "https://virtualcast.jp/products/1d53106791cd9753909b72da3a4736a363df3934ec9377551f8f6b59008b1398",
    tags: ["コメント","コメント窓","コメント落下","わんコメ","配信"],
    meta: {
          "種類": "VCI",
          "対応": "VirtualCast"
    }
  },
  {
    title: "シンプルコメントボット",
    category: "アイテム",
    image: "images/simple_comment_bot.jpg",
    description: "コメント欄を配信空間に実体化しました。\n\nリスナーがコメントするとロボットになって配信空間に現れます。\nコメント内容を吹き出しで表示し、新着コメントが届くとジャンプして反応します。\n\nコメントが増えるほどロボットも増え、空間がどんどん賑やかになっていきます。",
    link: "https://virtualcast.jp/products/428227be8c3eae37df2dc8df3bc56dc199fc1f577505a537cca22dd7cf713383",
    tags: ["コメント","ロボット","わんコメ","配信"],
    meta: {
          "種類": "VCI",
          "対応": "VirtualCast"
    }
  },
  {
    title: "コメントリアクションパック",
    category: "アイテム",
    image: "images/comment_reaction_pack.jpg",
    description: "リアクションが配信空間に現れる。\n\nリスナーのコメント内容によって「草」「たらい」「拍手」の演出が起きます。",
    link: "https://virtualcast.jp/products/7ba6b81dea10df78d8b71055e194d872e3e1f5f2a9e34969ec1dbb59368db477",
    tags: ["コメント","演出","わんコメ","草","たらい","拍手","配信"],
    meta: {
          "種類": "VCI",
          "対応": "VirtualCast"
    }
  },
  {
    title: "ミニマルグリッド",
    category: "ロケーション",
    image: "images/mini_grid.jpg",
    description: "グリッドを基調としたミニマルな空間。",
    link: "https://virtualcast.jp/products/8e417b7abba8b88302aa05b3073823bba43fedd42716300ff8869e86d4ec7b22",
    tags: ["シンプル","グリッド"],
    meta: {
          "種類": "VCI",
          "対応": "VirtualCast"
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
