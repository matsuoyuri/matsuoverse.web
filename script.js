const catalogItems = [
  {
    title: "拡張コメントビューア",
    category: "アイテム",
    image: "images/kakutyo_comment",
    description: "コメント・ギフト、それぞれ最新7件を表示できるシンプルなコメントビューア。\nポインターで選択したコメントを拡大表示できます。\n\n本体長押しでポインターリスポーン\n\n公式のわんコメプラグインが必要です\n導入方法\nhttps://wiki.virtualcast.jp/wiki/deliverytool/onecomme\n\n配信者のためのコメントアプリ「わんコメ」https://onecomme.com\n\n効果音\n・ポケットサウンド – https://pocket-se.info/　\n・効果音ラボ",
    link: "https://virtualcast.jp/products/d550ac5a099df2761245b9c097828168348a65b394c3bdff908626eb878e2f22",
    meta: {
          "種類": "アイテム",
          "対応": "VirtualCast",
          "価格": "無料"
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

function renderCatalog() {
  grid.innerHTML = "";

  catalogItems.forEach((item, index) => {
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
    `;

    grid.appendChild(button);
  });
}

function openModal(index) {
  const item = catalogItems[index];

  modalImage.src = item.image;
  modalImage.alt = item.title;
  modalCategory.textContent = item.category;
  modalTitle.textContent = item.title;
  modalDescription.textContent = item.description;

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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

renderCatalog();
